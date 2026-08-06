// Types matching backend schemas exactly

export type StationId = "Station-A" | "Station-B" | "Station-C";
export type Mode = "auto" | "scenario" | "manual";
export type RiskLabel = "GREEN" | "YELLOW" | "RED";

export interface EnsoPoint {
  month: string;
  nino34: number;
}

export interface EnsoScenarioRequest {
  values: number[];
  forecast_year: 2026 | 2027;
}

export interface EnsoForecastResponse {
  mode: Mode;
  forecast: EnsoPoint[];
}

export interface WaterLevelRequest {
  station_id: StationId | "all";
  mode: Mode;
  forecast_year: 2026 | 2027;
  enso_values?: number[] | null;
}

export interface ManualClimateInput {
  month?: string | null;
  enso_index: number;
  PRECTOTCORR: number;
  RAIN_ANOMALY: number;
  GWETROOT: number;
}

export interface ManualWaterLevelRequest {
  station_id: StationId | "all";
  forecast_year: 2026 | 2027;
  manual_values: ManualClimateInput[];
}

export interface WaterLevelPoint {
  station_id: StationId;
  month: string;
  predicted_water_level_m: number;
  lower_m: number;
  upper_m: number;
  flood_threshold_m: number;
  risk_label: RiskLabel;
  risk_description: string;
}

export interface WaterLevelResponse {
  mode: Mode;
  forecast_year: 2026 | 2027;
  enso: EnsoPoint[];
  forecasts: WaterLevelPoint[];
}

export interface RiskStation {
  station_id: StationId;
  lat: number;
  lon: number;
  flood_threshold_m: number;
  latest_month: string | null;
  predicted_water_level_m: number | null;
  risk_label: RiskLabel;
  risk_description: string;
}

export interface AlertOut {
  station_id: StationId;
  target_month: string;
  risk_label: "YELLOW" | "RED";
  message: string;
}

export interface AdvisoryOut {
  station_id: StationId;
  target_month: string | null;
  risk_label: RiskLabel;
  headline: string;
  community_message: string;
  actions: string[];
  predicted_water_level_m: number | null;
  flood_threshold_m: number;
}

export interface StationConfig {
  name: string;
  lat: number;
  lon: number;
  flood_threshold_m: number;
}

export const STATIONS: Record<StationId, StationConfig> = {
  "Station-A": { name: "Jamalpur", lat: 25.13028, lon: 89.73464, flood_threshold_m: 19.05 },
  "Station-B": { name: "Gaibandha", lat: 25.18713, lon: 89.59932, flood_threshold_m: 19.35 },
  "Station-C": { name: "Kurigram", lat: 25.56806, lon: 89.67889, flood_threshold_m: 23.25 },
};

export const getStationName = (stationId?: StationId | "all" | null): string => {
  if (!stationId) return "N/A";
  if (stationId === "all") return "All Stations";
  return STATIONS[stationId]?.name ?? stationId;
};
