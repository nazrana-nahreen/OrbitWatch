import httpx
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List
from fastapi import HTTPException
from ..config import settings
from ..schemas.asteroid import (
    AsteroidDetailResponse,
    AsteroidSummary,
    OrbitalElement,
    PhysicalParameter,
    OrbitClass
)
from .cache_service import cache

class SBDBClient:
    def __init__(self):
        self.base_url = settings.SBDB_API_URL
        self.timeout = settings.DEFAULT_TIMEOUT_SEC

    async def get_asteroid_detail(self, identifier: str) -> AsteroidDetailResponse:
        cache_key = f"sbdb:{identifier.lower().strip()}"
        cached = cache.get(cache_key)
        if cached:
            return AsteroidDetailResponse(**cached)

        params = {
            "sstr": identifier.strip(),
            "phys-par": "1"
        }
        headers = {"User-Agent": settings.USER_AGENT}

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(self.base_url, params=params, headers=headers)
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=503,
                detail=f"NASA/JPL SBDB service connection error: {str(exc)}"
            )

        if resp.status_code != 200:
            raise HTTPException(
                status_code=resp.status_code,
                detail=f"NASA/JPL SBDB returned error: {resp.text}"
            )

        data = resp.json()
        if "message" in data and "not found" in data["message"].lower():
            raise HTTPException(
                status_code=404,
                detail=f"Asteroid '{identifier}' was not found in NASA/JPL SBDB."
            )

        obj_data = data.get("object", {})
        orbit_data = data.get("orbit", {})
        phys_data = data.get("phys_par", [])

        # Parse orbit class
        oc_raw = obj_data.get("orbit_class", {})
        orbit_class = OrbitClass(
            code=oc_raw.get("code") if isinstance(oc_raw, dict) else None,
            name=oc_raw.get("name") if isinstance(oc_raw, dict) else None
        )

        # Parse orbital elements
        elements: List[OrbitalElement] = []
        for el in orbit_data.get("elements", []):
            try:
                val = float(el.get("value")) if el.get("value") is not None else None
            except ValueError:
                val = None

            elements.append(OrbitalElement(
                name=el.get("name", ""),
                value=val,
                units=el.get("units"),
                title=el.get("title"),
                sigma=el.get("sigma"),
                raw_value=str(el.get("value")) if el.get("value") is not None else None
            ))

        # Parse physical parameters
        physical_params: List[PhysicalParameter] = []
        for p in phys_data:
            physical_params.append(PhysicalParameter(
                name=p.get("name", ""),
                value=str(p.get("value")) if p.get("value") is not None else None,
                title=p.get("title"),
                units=p.get("units"),
                desc=p.get("desc"),
                sigma=str(p.get("sigma")) if p.get("sigma") is not None else None
            ))

        # Try to parse epoch
        epoch_raw = orbit_data.get("epoch")
        epoch_jd = None
        epoch_mjd = None
        if epoch_raw is not None:
            try:
                epoch_jd = float(epoch_raw)
                epoch_mjd = epoch_jd - 2400000.5
            except ValueError:
                pass

        result = AsteroidDetailResponse(
            designation=obj_data.get("des", identifier),
            fullname=obj_data.get("fullname", obj_data.get("shortname", identifier)),
            spkid=obj_data.get("spkid"),
            pha=bool(obj_data.get("pha", False)),
            neo=bool(obj_data.get("neo", False)),
            orbit_class=orbit_class,
            epoch_jd=epoch_jd,
            epoch_mjd=epoch_mjd,
            data_arc_days=str(orbit_data.get("data_arc")),
            condition_code=str(orbit_data.get("condition_code")),
            rms_residual=str(orbit_data.get("rms")),
            first_obs=str(orbit_data.get("first_obs")),
            last_obs=str(orbit_data.get("last_obs")),
            elements=elements,
            physical_parameters=physical_params,
            source_url=f"https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr={identifier}",
            retrieved_at=datetime.now(timezone.utc).isoformat(),
            provenance_note="Data retrieved from NASA/JPL Small-Body Database (SBDB). Orbital elements are Keplerian elements computed from observation arc fits."
        )

        cache.set(cache_key, result.model_dump(), ttl_sec=settings.CACHE_TTL_SECONDS)
        return result

    async def search_quick(self, query: str) -> List[AsteroidSummary]:
        # High-interest prominent catalog items for instant suggestions
        popular = [
            {"des": "99942", "name": "99942 Apophis", "spkid": "20099942", "pha": True, "neo": True, "class": "Aten", "code": "ATE"},
            {"des": "101955", "name": "101955 Bennu", "spkid": "20101955", "pha": True, "neo": True, "class": "Apollo", "code": "APO"},
            {"des": "433", "name": "433 Eros", "spkid": "20000433", "pha": False, "neo": True, "class": "Amor", "code": "AMO"},
            {"des": "162173", "name": "162173 Ryugu", "spkid": "20162173", "pha": True, "neo": True, "class": "Apollo", "code": "APO"},
            {"des": "2024 YR4", "name": "(2024 YR4)", "spkid": "54509621", "pha": False, "neo": True, "class": "Apollo", "code": "APO"},
            {"des": "4179", "name": "4179 Toutatis", "spkid": "20004179", "pha": True, "neo": True, "class": "Apollo", "code": "APO"},
            {"des": "3200", "name": "3200 Phaethon", "spkid": "20003200", "pha": True, "neo": True, "class": "Apollo", "code": "APO"},
            {"des": "153814", "name": "153814 (2001 WN5)", "spkid": "20153814", "pha": True, "neo": True, "class": "Apollo", "code": "APO"}
        ]
        
        q = query.strip().lower()
        results: List[AsteroidSummary] = []

        # Check in curated list
        for item in popular:
            if q in item["name"].lower() or q in item["des"].lower():
                results.append(AsteroidSummary(
                    designation=item["des"],
                    fullname=item["name"],
                    spkid=item["spkid"],
                    pha=item["pha"],
                    neo=item["neo"],
                    orbit_class=OrbitClass(name=item["class"], code=item["code"])
                ))

        # Also attempt direct lookup if length >= 2 and not already found
        if not results and len(query.strip()) >= 2:
            try:
                detail = await self.get_asteroid_detail(query.strip())
                results.append(AsteroidSummary(
                    designation=detail.designation,
                    fullname=detail.fullname,
                    spkid=detail.spkid,
                    pha=detail.pha,
                    neo=detail.neo,
                    orbit_class=detail.orbit_class
                ))
            except HTTPException:
                pass

        return results

sbdb_client = SBDBClient()
