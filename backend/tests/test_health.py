from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "OrbitWatch" in data["app"]

def test_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "sbdb" in data["datasources"]
    assert "cad" in data["datasources"]
    assert "horizons" in data["datasources"]

def test_glossary():
    response = client.get("/api/v1/explain/glossary")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5
    terms = [item["term"] for item in data]
    assert "Close Approach" in terms
    assert "Potentially Hazardous Asteroid (PHA)" in terms

def test_disclaimer():
    response = client.get("/api/v1/explain/disclaimer")
    assert response.status_code == 200
    data = response.json()
    assert "cneos.jpl.nasa.gov" in data["text"]
