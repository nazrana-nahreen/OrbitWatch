from fastapi import APIRouter, Query, Path
from typing import List
from ..services.sbdb_client import sbdb_client
from ..services.cad_client import cad_client
from ..schemas.asteroid import AsteroidDetailResponse, AsteroidSummary, CloseApproachResponse

router = APIRouter(prefix="/objects", tags=["Asteroids & Objects"])

@router.get("/search", response_model=List[AsteroidSummary])
async def search_objects(
    q: str = Query(..., min_length=1, description="Search query by name or designation (e.g., 'Apophis', '99942', '2024 YR4')")
):
    return await sbdb_client.search_quick(q)

@router.get("/{identifier}", response_model=AsteroidDetailResponse)
async def get_object_detail(
    identifier: str = Path(..., description="Asteroid designation, name, or SPK-ID")
):
    return await sbdb_client.get_asteroid_detail(identifier)

@router.get("/{identifier}/close-approaches", response_model=CloseApproachResponse)
async def get_object_close_approaches(
    identifier: str = Path(..., description="Asteroid designation (e.g. '99942')"),
    limit: int = Query(20, ge=1, le=100)
):
    return await cad_client.get_close_approaches(
        des=identifier,
        date_min="1950-01-01",
        date_max="2070-01-01",
        dist_max_ld=100.0,
        sort="date",
        limit=limit
    )
