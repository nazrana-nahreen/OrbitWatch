from pydantic import BaseModel
import os

class Settings(BaseModel):
    PROJECT_NAME: str = "OrbitWatch AI"
    VERSION: str = "0.1.0"
    API_PREFIX: str = "/api/v1"
    
    # NASA / JPL Endpoints
    SBDB_API_URL: str = "https://ssd-api.jpl.nasa.gov/sbdb.api"
    CAD_API_URL: str = "https://ssd-api.jpl.nasa.gov/cad.api"
    HORIZONS_API_URL: str = "https://ssd.jpl.nasa.gov/api/horizons.api"
    
    # Request & Cache settings
    DEFAULT_TIMEOUT_SEC: float = 12.0
    CACHE_TTL_SECONDS: int = 3600  # 1 hour default cache
    USER_AGENT: str = "OrbitWatch-AI/1.0 (Educational Asteroid Tracker)"

settings = Settings()
