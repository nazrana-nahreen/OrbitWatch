from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .config import settings
from .routes import health, objects, close_approaches, ephemeris, glossary

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="OrbitWatch AI Backend: Asteroid Tracking, Close Approach Explorer & Orbit Ephemeris Service",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include route modules under API_PREFIX (/api/v1)
app.include_router(health.router, prefix=settings.API_PREFIX)
app.include_router(objects.router, prefix=settings.API_PREFIX)
app.include_router(close_approaches.router, prefix=settings.API_PREFIX)
app.include_router(ephemeris.router, prefix=settings.API_PREFIX)
app.include_router(glossary.router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": f"{settings.API_PREFIX}/health"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "InternalServerError",
            "message": str(exc),
            "path": str(request.url)
        }
    )
