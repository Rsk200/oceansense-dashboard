import type { EnsoForecastResponse, Mode, RiskLabel, StationId, WaterLevelResponse } from '../types';

export interface ForecastHistoryRecord {
  id: string;
  runDate: string;
  type: 'enso' | 'water-level' | 'manual';
  mode: Mode;
  forecastYear?: 2026 | 2027;
  stationId?: StationId | 'all';
  rows: ForecastHistoryRow[];
}

export interface ForecastHistoryRow {
  station_id?: StationId;
  month: string;
  predicted_water_level_m?: number;
  nino34?: number;
  risk_label?: RiskLabel;
  mode: Mode;
}

const STORAGE_KEY = 'oceansense_forecast_history';
const MAX_RECORDS = 100;

const readRecords = (): ForecastHistoryRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ForecastHistoryRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeRecords = (records: ForecastHistoryRecord[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, MAX_RECORDS)));
};

export const getForecastHistory = (): ForecastHistoryRecord[] => readRecords();

export const saveEnsoForecast = (response: EnsoForecastResponse): void => {
  const records = readRecords();
  records.unshift({
    id: crypto.randomUUID(),
    runDate: new Date().toISOString(),
    type: 'enso',
    mode: response.mode,
    rows: response.forecast.map((point) => ({
      month: point.month,
      nino34: point.nino34,
      mode: response.mode,
    })),
  });
  writeRecords(records);
};

export const saveWaterLevelForecast = (
  response: WaterLevelResponse,
  stationId: StationId | 'all' = 'all',
): void => {
  const records = readRecords();
  records.unshift({
    id: crypto.randomUUID(),
    runDate: new Date().toISOString(),
    type: response.mode === 'manual' ? 'manual' : 'water-level',
    mode: response.mode,
    forecastYear: response.forecast_year,
    stationId,
    rows: response.forecasts.map((point) => ({
      station_id: point.station_id,
      month: point.month,
      predicted_water_level_m: point.predicted_water_level_m,
      risk_label: point.risk_label,
      mode: response.mode,
    })),
  });
  writeRecords(records);
};

export const clearForecastHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
