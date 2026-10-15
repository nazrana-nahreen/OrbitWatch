import pytest
from backend.app.services.cad_client import cad_client
from backend.app.services.sbdb_client import sbdb_client
from backend.app.services.horizons_client import horizons_client

@pytest.mark.asyncio
async def test_sbdb_lookup_apophis():
    res = await sbdb_client.get_asteroid_detail("99942")
    assert res.designation == "99942"
    assert "Apophis" in res.fullname
    assert res.pha is True
    assert res.neo is True
    assert len(res.elements) > 0

@pytest.mark.asyncio
async def test_cad_upcoming_list():
    res = await cad_client.get_close_approaches(dist_max_ld=10.0, limit=5)
    assert res.count > 0
    assert len(res.items) > 0
    first = res.items[0]
    assert first.dist_au > 0
    assert first.dist_ld > 0

@pytest.mark.asyncio
async def test_horizons_ephemeris():
    res = await horizons_client.get_ephemeris("99942", start_time="2026-10-01", stop_time="2026-10-05", step_size="1d")
    assert res.count > 0
    assert len(res.points) > 0
    p = res.points[0]
    assert p.distance_sun_au > 0
    assert p.jd > 2460000
