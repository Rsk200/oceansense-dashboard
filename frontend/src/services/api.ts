import axios from 'axios';
import type {
  EnsoForecastResponse,
  EnsoScenarioRequest,
  WaterLevelRequest,
  WaterLevelResponse,
  ManualWaterLevelRequest,
  RiskStation,
  AlertOut,
  AdvisoryOut,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ensoApi = {
  predict: async (): Promise<EnsoForecastResponse> => {
    const response = await api.post<EnsoForecastResponse>('/enso-predict');
    return response.data;
  },

  scenario: async (payload: EnsoScenarioRequest): Promise<EnsoForecastResponse> => {
    const response = await api.post<EnsoForecastResponse>('/enso-scenario', payload);
    return response.data;
  },
};

export const waterLevelApi = {
  forecast: async (payload: WaterLevelRequest): Promise<WaterLevelResponse> => {
    const response = await api.post<WaterLevelResponse>('/water-level', payload);
    return response.data;
  },

  manualForecast: async (payload: ManualWaterLevelRequest): Promise<WaterLevelResponse> => {
    const response = await api.post<WaterLevelResponse>('/water-level/manual', payload);
    return response.data;
  },
};

export const alertsApi = {
  floodRisk: async (): Promise<RiskStation[]> => {
    const response = await api.get<RiskStation[]>('/flood-risk');
    return response.data;
  },

  alerts: async (): Promise<AlertOut[]> => {
    const response = await api.get<AlertOut[]>('/alerts');
    return response.data;
  },

  advisory: async (): Promise<AdvisoryOut[]> => {
    const response = await api.get<AdvisoryOut[]>('/advisory');
    return response.data;
  },
};

export const healthApi = {
  check: async (): Promise<{ status: string }> => {
    const baseUrl = import.meta.env.VITE_API_URL || '';
    const response = await axios.get<{ status: string }>(`${baseUrl}/health`);
    return response.data;
  },
};
