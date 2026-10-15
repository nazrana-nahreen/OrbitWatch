from fastapi import APIRouter, Query, Path
from typing import Optional
from ..services.horizons_client import horizons_client
from ..schemas.asteroid import EphemerisResponse

router = APIRouter(prefix="/ephemeris", tags=["Orbit & Ephemeris Visualization"])

@router.get("/{identifier}", response_model=EphemerisResponse)
async def get_orbit_ephemeris(
    identifier: str = Path(..., description="Asteroid designation or SPK-ID (e.g., '99942', '101955', '399' for Earth)"),
    start_time: Optional[str] = Query("2026-10-01", description="Start date (YYYY-MM-DD)"),
    stop_time: Optional[str] = Query("2027-10-01", description="Stop date (YYYY-MM-DD)"),
    step_size: Optional[str] = Query("10d", description="Step size (e.g., '5d', '10d', '1mo')")
):
    return await horizons_client.get_ephemeris(
        command=identifier,
        start_time=start_time,
        stop_time=stop_time,
        step_size=step_size
    )
