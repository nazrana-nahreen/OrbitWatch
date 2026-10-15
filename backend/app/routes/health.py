from fastapi import APIRouter
from datetime import datetime, timezone
from ..config import settings

router = APIRouter(tags=["Health"])

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "datasources": {
            "sbdb": "NASA/JPL Small-Body Database API",
            "cad": "NASA/JPL Close-Approach Data API",
            "horizons": "NASA/JPL Horizons Ephemeris System"
        }
    }
