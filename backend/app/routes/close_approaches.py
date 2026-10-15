from fastapi import APIRouter, Query
from typing import Optional
from ..services.cad_client import cad_client
from ..schemas.asteroid import CloseApproachResponse

router = APIRouter(prefix="/close-approaches", tags=["Close Approaches & Risk Explorer"])

@router.get("", response_model=CloseApproachResponse)
async def list_close_approaches(
    date_min: Optional[str] = Query("now", description="Start date (YYYY-MM-DD or 'now')"),
    date_max: Optional[str] = Query("+30", description="End date (YYYY-MM-DD or '+ND' like '+30')"),
    dist_max_ld: Optional[float] = Query(15.0, ge=0.1, le=100.0, description="Max miss distance in Lunar Distances (LD)"),
    pha_only: bool = Query(False, description="Filter for Potentially Hazardous Asteroids (PHA) only"),
    sort: str = Query("date", pattern="^(date|dist)$", description="Sort order: 'date' or 'dist'"),
    limit: int = Query(50, ge=1, le=100, description="Max number of items to return")
):
    return await cad_client.get_close_approaches(
        date_min=date_min,
        date_max=date_max,
        dist_max_ld=dist_max_ld,
        pha_only=pha_only,
        sort=sort,
        limit=limit
    )
