from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class OrbitalElement(BaseModel):
    name: str
    value: Optional[float] = None
    units: Optional[str] = None
    title: Optional[str] = None
    sigma: Optional[str] = None
    raw_value: Optional[str] = None

class PhysicalParameter(BaseModel):
    name: str
    value: Optional[str] = None
    title: Optional[str] = None
    units: Optional[str] = None
    desc: Optional[str] = None
    sigma: Optional[str] = None

class OrbitClass(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None

class AsteroidSummary(BaseModel):
    designation: str
    fullname: str
    spkid: Optional[str] = None
    pha: bool = False
    neo: bool = False
    orbit_class: Optional[OrbitClass] = None
    estimated_diameter_km: Optional[float] = None
    absolute_magnitude_h: Optional[float] = None

class AsteroidDetailResponse(BaseModel):
    designation: str
    fullname: str
    spkid: Optional[str] = None
    pha: bool = False
    neo: bool = False
    orbit_class: Optional[OrbitClass] = None
    epoch_jd: Optional[float] = None
    epoch_mjd: Optional[float] = None
    data_arc_days: Optional[str] = None
    condition_code: Optional[str] = None
    rms_residual: Optional[str] = None
    first_obs: Optional[str] = None
    last_obs: Optional[str] = None
    elements: List[OrbitalElement] = []
    physical_parameters: List[PhysicalParameter] = []
    source_url: str
    retrieved_at: str
    provenance_note: str

class CloseApproachItem(BaseModel):
    designation: str
    orbit_id: Optional[str] = None
    epoch_jd: float
    approach_date: str
    dist_au: float
    dist_ld: float
    dist_min_au: Optional[float] = None
    dist_max_au: Optional[float] = None
    dist_min_ld: Optional[float] = None
    dist_max_ld: Optional[float] = None
    v_rel_km_s: float
    v_inf_km_s: Optional[float] = None
    h_mag: Optional[float] = None
    pha: bool = False

class CloseApproachResponse(BaseModel):
    count: int
    total: int
    items: List[CloseApproachItem]
    filters_applied: Dict[str, Any]
    source_url: str
    retrieved_at: str
    disclaimer: str

class EphemerisPoint(BaseModel):
    jd: float
    calendar_date: str
    # Heliocentric position coordinates in AU or km (default AU for orbit plotting)
    x_au: float
    y_au: float
    z_au: float
    # Velocity in km/s
    vx_km_s: Optional[float] = None
    vy_km_s: Optional[float] = None
    vz_km_s: Optional[float] = None
    distance_sun_au: float
    speed_km_s: Optional[float] = None

class EphemerisResponse(BaseModel):
    designation: str
    target_name: str
    center_body: str
    reference_frame: str
    points: List[EphemerisPoint]
    start_time: str
    stop_time: str
    step_size: str
    count: int
    source_url: str
    retrieved_at: str
    provenance_note: str

class GlossaryTerm(BaseModel):
    term: str
    label_bn: str
    definition: str
    importance: str
    misconception: Optional[str] = None
