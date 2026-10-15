export interface OrbitalElement {
  name: string;
  value: number | null;
  units: string | null;
  title: string | null;
  sigma: string | null;
  raw_value: string | null;
}

export interface PhysicalParameter {
  name: string;
  value: string | null;
  title: string | null;
  units: string | null;
  desc: string | null;
  sigma: string | null;
}

export interface OrbitClass {
  code?: string;
  name?: string;
}

export interface AsteroidSummary {
  designation: string;
  fullname: string;
  spkid?: string;
  pha: boolean;
  neo: boolean;
  orbit_class?: OrbitClass;
  estimated_diameter_km?: number;
  absolute_magnitude_h?: number;
}

export interface AsteroidDetail {
  designation: string;
  fullname: string;
  spkid?: string;
  pha: boolean;
  neo: boolean;
  orbit_class?: OrbitClass;
  epoch_jd?: number;
  epoch_mjd?: number;
  data_arc_days?: string;
  condition_code?: string;
  rms_residual?: string;
  first_obs?: string;
  last_obs?: string;
  elements: OrbitalElement[];
  physical_parameters: PhysicalParameter[];
  source_url: string;
  retrieved_at: string;
  provenance_note: string;
}

export interface CloseApproachItem {
  designation: string;
  orbit_id?: string;
  epoch_jd: number;
  approach_date: string;
  dist_au: number;
  dist_ld: number;
  dist_min_au?: number;
  dist_max_au?: number;
  dist_min_ld?: number;
  dist_max_ld?: number;
  v_rel_km_s: number;
  v_inf_km_s?: number;
  h_mag?: number;
  pha: boolean;
}

export interface CloseApproachResponse {
  count: number;
  total: number;
  items: CloseApproachItem[];
  filters_applied: Record<string, any>;
  source_url: string;
  retrieved_at: string;
  disclaimer: string;
}

export interface EphemerisPoint {
  jd: number;
  calendar_date: string;
  x_au: number;
  y_au: number;
  z_au: number;
  vx_km_s?: number;
  vy_km_s?: number;
  vz_km_s?: number;
  distance_sun_au: number;
  speed_km_s?: number;
}

export interface EphemerisResponse {
  designation: string;
  target_name: string;
  center_body: string;
  reference_frame: string;
  points: EphemerisPoint[];
  start_time: string;
  stop_time: string;
  step_size: string;
  count: number;
  source_url: string;
  retrieved_at: string;
  provenance_note: string;
}

export interface GlossaryTerm {
  term: string;
  label_bn: string;
  definition: string;
  importance: string;
  misconception?: string;
}
