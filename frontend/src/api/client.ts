import axios from 'axios';
import {
  AsteroidDetail,
  AsteroidSummary,
  CloseApproachResponse,
  EphemerisResponse,
  GlossaryTerm
} from '../types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || '/api/v1';

export const apiClient = {
  // Health
  checkHealth: async () => {
    const res = await axios.get(`${API_BASE}/health`);
    return res.data;
  },

  // Asteroid Search & Profile
  searchAsteroids: async (query: string): Promise<AsteroidSummary[]> => {
    const res = await axios.get<AsteroidSummary[]>(`${API_BASE}/objects/search`, {
      params: { q: query }
    });
    return res.data;
  },

  getAsteroidDetail: async (identifier: string): Promise<AsteroidDetail> => {
    const res = await axios.get<AsteroidDetail>(`${API_BASE}/objects/${encodeURIComponent(identifier)}`);
    return res.data;
  },

  getObjectCloseApproaches: async (identifier: string, limit = 20): Promise<CloseApproachResponse> => {
    const res = await axios.get<CloseApproachResponse>(
      `${API_BASE}/objects/${encodeURIComponent(identifier)}/close-approaches`,
      { params: { limit } }
    );
    return res.data;
  },

  // CAD Close Approaches feed
  getCloseApproaches: async (params?: {
    date_min?: string;
    date_max?: string;
    dist_max_ld?: number;
    pha_only?: boolean;
    sort?: 'date' | 'dist';
    limit?: number;
  }): Promise<CloseApproachResponse> => {
    const res = await axios.get<CloseApproachResponse>(`${API_BASE}/close-approaches`, {
      params
    });
    return res.data;
  },

  // Horizons Ephemeris
  getEphemeris: async (
    identifier: string,
    params?: {
      start_time?: string;
      stop_time?: string;
      step_size?: string;
    }
  ): Promise<EphemerisResponse> => {
    const res = await axios.get<EphemerisResponse>(
      `${API_BASE}/ephemeris/${encodeURIComponent(identifier)}`,
      { params }
    );
    return res.data;
  },

  // Scientific Explainability & Glossary
  getGlossary: async (): Promise<GlossaryTerm[]> => {
    const res = await axios.get<GlossaryTerm[]>(`${API_BASE}/explain/glossary`);
    return res.data;
  },

  getDisclaimer: async (): Promise<{ title: string; title_bn: string; text: string; text_bn: string }> => {
    const res = await axios.get(`${API_BASE}/explain/disclaimer`);
    return res.data;
  }
};
