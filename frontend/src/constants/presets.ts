import type { ManualClimateInput } from '../types';

const MONTHS_2026 = [
  '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06',
  '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12',
];

const MONTHS_2027 = [
  '2027-01', '2027-02', '2027-03', '2027-04', '2027-05', '2027-06',
  '2027-07', '2027-08', '2027-09', '2027-10', '2027-11', '2027-12',
];

export type ManualPresetKey = 'neutral' | 'wet_monsoon' | 'dry_season';

export interface ManualPreset {
  label: string;
  description: string;
  build: (forecastYear: 2026 | 2027) => ManualClimateInput[];
}

const buildMonthly = (
  months: string[],
  values: Omit<ManualClimateInput, 'month'>,
): ManualClimateInput[] =>
  months.map((month) => ({ month, ...values }));

export const MANUAL_PRESETS: Record<ManualPresetKey, ManualPreset> = {
  neutral: {
    label: 'Neutral',
    description: 'Average ENSO, rainfall, and soil moisture conditions',
    build: (forecastYear) => {
      const months = forecastYear === 2026 ? MONTHS_2026 : MONTHS_2027;
      return buildMonthly(months, {
        enso_index: 0,
        PRECTOTCORR: 6.5,
        RAIN_ANOMALY: 0,
        GWETROOT: 0.5,
      });
    },
  },
  wet_monsoon: {
    label: 'Wet Monsoon',
    description: 'Elevated rainfall and soil moisture during monsoon season',
    build: (forecastYear) => {
      const months = forecastYear === 2026 ? MONTHS_2026 : MONTHS_2027;
      return months.map((month, index) => {
        const isMonsoon = index >= 5 && index <= 8;
        return {
          month,
          enso_index: 0.6,
          PRECTOTCORR: isMonsoon ? 14.0 : 5.0,
          RAIN_ANOMALY: isMonsoon ? 0.45 : 0.05,
          GWETROOT: isMonsoon ? 0.95 : 0.55,
        };
      });
    },
  },
  dry_season: {
    label: 'Dry Season',
    description: 'Reduced rainfall with La Niña-leaning ENSO conditions',
    build: (forecastYear) => {
      const months = forecastYear === 2026 ? MONTHS_2026 : MONTHS_2027;
      return buildMonthly(months, {
        enso_index: -0.5,
        PRECTOTCORR: 2.5,
        RAIN_ANOMALY: -0.35,
        GWETROOT: 0.3,
      });
    },
  },
};
