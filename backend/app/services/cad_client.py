import httpx
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List
from fastapi import HTTPException
from ..config import settings
from ..schemas.asteroid import CloseApproachItem, CloseApproachResponse
from .cache_service import cache

# Astronomical Constants
AU_TO_LD = 389.17227  # 1 AU in Lunar Distances (Earth-Moon distance)

class CADClient:
    def __init__(self):
        self.base_url = settings.CAD_API_URL
        self.timeout = settings.DEFAULT_TIMEOUT_SEC

    async def get_close_approaches(
        self,
        date_min: Optional[str] = "now",
        date_max: Optional[str] = "+30",
        dist_max_ld: Optional[float] = 15.0,
        pha_only: bool = False,
        des: Optional[str] = None,
        sort: str = "date",
        limit: int = 50
    ) -> CloseApproachResponse:
        cache_key = f"cad:{date_min}:{date_max}:{dist_max_ld}:{pha_only}:{des}:{sort}:{limit}"
        cached = cache.get(cache_key)
        if cached:
            return CloseApproachResponse(**cached)

        params: Dict[str, str] = {
            "limit": str(limit),
            "sort": "date" if sort == "date" else "dist"
        }

        if des:
            params["des"] = des.strip()
        else:
            if date_min:
                params["date-min"] = date_min
            if date_max:
                params["date-max"] = date_max
            if dist_max_ld is not None:
                params["dist-max"] = f"{dist_max_ld}LD"
            if pha_only:
                params["pha"] = "true"

        headers = {"User-Agent": settings.USER_AGENT}

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(self.base_url, params=params, headers=headers)
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=503,
                detail=f"NASA/JPL CAD service connection error: {str(exc)}"
            )

        if resp.status_code != 200:
            raise HTTPException(
                status_code=resp.status_code,
                detail=f"NASA/JPL CAD returned error: {resp.text}"
            )

        data = resp.json()
        fields = data.get("fields", [])
        raw_rows = data.get("data", [])

        # Map field name to column index
        col_idx = {name: idx for idx, name in enumerate(fields)}

        items: List[CloseApproachItem] = []
        for row in raw_rows:
            try:
                des_val = str(row[col_idx["des"]]) if "des" in col_idx else "Unknown"
                orbit_id_val = str(row[col_idx["orbit_id"]]) if "orbit_id" in col_idx else None
                jd_val = float(row[col_idx["jd"]]) if "jd" in col_idx and row[col_idx["jd"]] else 0.0
                cd_val = str(row[col_idx["cd"]]) if "cd" in col_idx else ""
                dist_val = float(row[col_idx["dist"]]) if "dist" in col_idx and row[col_idx["dist"]] else 0.0
                
                dist_min = float(row[col_idx["dist_min"]]) if "dist_min" in col_idx and row[col_idx["dist_min"]] else None
                dist_max = float(row[col_idx["dist_max"]]) if "dist_max" in col_idx and row[col_idx["dist_max"]] else None
                
                v_rel = float(row[col_idx["v_rel"]]) if "v_rel" in col_idx and row[col_idx["v_rel"]] else 0.0
                v_inf = float(row[col_idx["v_inf"]]) if "v_inf" in col_idx and row[col_idx["v_inf"]] else None
                h_mag = float(row[col_idx["h"]]) if "h" in col_idx and row[col_idx["h"]] else None

                # Calculate Lunar Distances
                dist_ld = dist_val * AU_TO_LD
                dist_min_ld = (dist_min * AU_TO_LD) if dist_min is not None else None
                dist_max_ld_val = (dist_max * AU_TO_LD) if dist_max is not None else None

                # A close approach does not mean impact. If dist_min < 0.05 AU and H <= 22, it meets PHA thresholds
                is_pha = (dist_val < 0.05 and (h_mag is not None and h_mag <= 22.0)) or (pha_only)

                items.append(CloseApproachItem(
                    designation=des_val,
                    orbit_id=orbit_id_val,
                    epoch_jd=jd_val,
                    approach_date=cd_val,
                    dist_au=dist_val,
                    dist_ld=round(dist_ld, 2),
                    dist_min_au=dist_min,
                    dist_max_au=dist_max,
                    dist_min_ld=round(dist_min_ld, 2) if dist_min_ld is not None else None,
                    dist_max_ld=round(dist_max_ld_val, 2) if dist_max_ld_val is not None else None,
                    v_rel_km_s=round(v_rel, 2),
                    v_inf_km_s=round(v_inf, 2) if v_inf is not None else None,
                    h_mag=h_mag,
                    pha=is_pha
                ))
            except Exception:
                continue

        response = CloseApproachResponse(
            count=len(items),
            total=int(data.get("total", len(items))),
            items=items,
            filters_applied=params,
            source_url="https://ssd-api.jpl.nasa.gov/doc/cad.html",
            retrieved_at=datetime.now(timezone.utc).isoformat(),
            disclaimer="Educational explorer; not an official impact-monitoring or emergency-warning service. Close approach data is published by NASA/JPL CNEOS."
        )

        cache.set(cache_key, response.model_dump(), ttl_sec=900)  # 15 minutes cache for CAD
        return response

cad_client = CADClient()
