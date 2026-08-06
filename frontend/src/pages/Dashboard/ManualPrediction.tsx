import { useState } from 'react';
import { motion } from 'framer-motion';
import { useManualWaterLevelForecast } from '../../hooks/queries';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import LineChart from '../../components/common/LineChart';
import { STATIONS, type StationId, type ManualClimateInput } from '../../types';
import { Plus, Trash2, Play, AlertCircle } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

type PresetKey = 'neutral' | 'wetMonsoon' | 'extremeFlood' | 'drySeason' | 'elNino' | 'laNina';

const PRESETS: Record<PresetKey, { label: string; description: string; values: Omit<ManualClimateInput, 'month'> }> = {
  neutral: {
    label: 'Neutral Baseline',
    description: 'Average ENSO-neutral conditions with typical seasonal rainfall',
    values: { enso_index: 0, PRECTOTCORR: 4.5, RAIN_ANOMALY: 0, GWETROOT: 0.55 },
  },
  wetMonsoon: {
    label: 'Wet Monsoon',
    description: 'Heavy monsoon rainfall with saturated soils, elevated flood potential',
    values: { enso_index: -0.4, PRECTOTCORR: 12.5, RAIN_ANOMALY: 3.2, GWETROOT: 0.95 },
  },
  extremeFlood: {
    label: 'Extreme Flood Scenario (Test)',
    description: 'Catastrophic rainfall to guarantee a RED alert on the dashboard',
    values: { enso_index: 2.0, PRECTOTCORR: 100.0, RAIN_ANOMALY: 50.0, GWETROOT: 1.5 },
  },
  drySeason: {
    label: 'Dry Season',
    description: 'Low rainfall and drier soils typical of the winter dry season',
    values: { enso_index: 0.2, PRECTOTCORR: 0.8, RAIN_ANOMALY: -1.5, GWETROOT: 0.25 },
  },
  elNino: {
    label: 'El Niño (Warm)',
    description: 'Strong warm-phase ENSO signal, historically linked to drier conditions',
    values: { enso_index: 1.8, PRECTOTCORR: 2.0, RAIN_ANOMALY: -1.0, GWETROOT: 0.35 },
  },
  laNina: {
    label: 'La Niña (Cool)',
    description: 'Strong cool-phase ENSO signal, historically linked to wetter conditions',
    values: { enso_index: -1.8, PRECTOTCORR: 9.5, RAIN_ANOMALY: 2.4, GWETROOT: 0.85 },
  },
};

const ManualPrediction = () => {
  const [selectedStation, setSelectedStation] = useState<StationId | 'all'>('all');
  const [forecastYear, setForecastYear] = useState<2026 | 2027>(2026);
  const [manualValues, setManualValues] = useState<ManualClimateInput[]>([]);
  const manualForecast = useManualWaterLevelForecast();
  const toast = useToast();

  const addMonth = () => {
    setManualValues([...manualValues, {
      month: null,
      enso_index: 0,
      PRECTOTCORR: 0,
      RAIN_ANOMALY: 0,
      GWETROOT: 0,
    }]);
  };

  const removeMonth = (index: number) => {
    setManualValues(manualValues.filter((_, i) => i !== index));
  };

  const updateValue = (index: number, field: keyof ManualClimateInput, value: string | number) => {
    const updated = [...manualValues];
    updated[index] = { ...updated[index], [field]: value };
    setManualValues(updated);
  };

  const generateMonths = (): ManualClimateInput[] => {
    const months = forecastYear === 2026
      ? ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06',
         '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12']
      : ['2027-01', '2027-02', '2027-03', '2027-04', '2027-05', '2027-06',
         '2027-07', '2027-08', '2027-09', '2027-10', '2027-11', '2027-12'];

    return months.map(month => ({
      month,
      enso_index: 0,
      PRECTOTCORR: 0,
      RAIN_ANOMALY: 0,
      GWETROOT: 0,
    }));
  };

  const generateTemplate = () => {
    setManualValues(generateMonths());
  };

  const applyPreset = (key: PresetKey) => {
    if (manualValues.length === 0) {
      generateTemplate();
    }
    const preset = PRESETS[key];
    setManualValues((current) => {
      const base = current.length > 0 ? current : generateMonths();
      return base.map((row) => ({ ...row, ...preset.values }));
    });
    toast.info(`Applied "${preset.label}" preset to all months`);
  };

  const handleForecast = () => {
    if (manualValues.length !== 12 && manualValues.length !== 24) {
      toast.error('Please enter exactly 12 or 24 months of data before running the forecast.');
      return;
    }
    if (manualValues.some((row) => !row.month)) {
      toast.error('Every row needs a month in YYYY-MM format.');
      return;
    }

    manualForecast.mutate(
      {
        station_id: selectedStation,
        forecast_year: forecastYear,
        manual_values: manualValues,
      },
      {
        onSuccess: () => toast.success('Manual forecast completed successfully'),
        onError: (err: any) => {
          const detail = err?.response?.data?.detail;
          const message = Array.isArray(detail)
            ? detail.map((d: any) => d.msg).join('; ')
            : detail || err?.message || 'Failed to run manual forecast';
          toast.error(message);
        },
      },
    );
  };

  const forecastData = manualForecast.data?.forecasts || [];
  const stationForecasts = selectedStation === 'all' 
    ? forecastData
    : forecastData.filter(f => f.station_id === selectedStation);

  const getChartForStation = (stationId: StationId) => {
    const stationData = stationForecasts.filter(f => f.station_id === stationId);
    return stationData.map(f => ({
      month: f.month,
      'Water Level': f.predicted_water_level_m,
      'Threshold': f.flood_threshold_m,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Manual Prediction</h1>
        <p className="text-white/70">Enter custom climate values for water level forecasting</p>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <label className="text-white/70 text-sm">Station:</label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value as StationId | 'all')}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="all">All Stations</option>
                {Object.entries(STATIONS).map(([id, config]) => (
                  <option key={id} value={id}>{config.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-white/70 text-sm">Forecast Year:</label>
              <select
                value={forecastYear}
                onChange={(e) => setForecastYear(e.target.value as unknown as 2026 | 2027)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>

            <Button variant="secondary" size="sm" onClick={generateTemplate}>
              <Plus className="w-4 h-4 mr-2" />
              Generate Template
            </Button>
          </div>

          <div className="mb-4">
            <label className="text-white/70 text-sm mb-2 block">Quick presets:</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PRESETS) as PresetKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyPreset(key)}
                  title={PRESETS[key].description}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 border border-white/20 text-white/80 hover:bg-accent/20 hover:border-accent/40 hover:text-accent transition-colors"
                >
                  {PRESETS[key].label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-white/70 text-sm">
              {manualValues.length} months entered (required: 12 or 24)
            </div>
            <Button variant="ghost" size="sm" onClick={addMonth}>
              <Plus className="w-4 h-4 mr-2" />
              Add Month
            </Button>
          </div>

          {/* Data Entry Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/70 text-sm font-medium p-2">Month</th>
                  <th className="text-left text-white/70 text-sm font-medium p-2">ENSO Index</th>
                  <th className="text-left text-white/70 text-sm font-medium p-2">Rainfall (mm)</th>
                  <th className="text-left text-white/70 text-sm font-medium p-2">Rain Anomaly</th>
                  <th className="text-left text-white/70 text-sm font-medium p-2">Soil Moisture</th>
                  <th className="text-left text-white/70 text-sm font-medium p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {manualValues.map((row, index) => (
                  <tr key={index} className="border-b border-white/5">
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.month || ''}
                        onChange={(e) => updateValue(index, 'month', e.target.value)}
                        placeholder="YYYY-MM"
                        className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        step="0.1"
                        value={row.enso_index}
                        onChange={(e) => updateValue(index, 'enso_index', parseFloat(e.target.value))}
                        className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        step="0.1"
                        value={row.PRECTOTCORR}
                        onChange={(e) => updateValue(index, 'PRECTOTCORR', parseFloat(e.target.value))}
                        className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        step="0.1"
                        value={row.RAIN_ANOMALY}
                        onChange={(e) => updateValue(index, 'RAIN_ANOMALY', parseFloat(e.target.value))}
                        className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1.5"
                        value={row.GWETROOT}
                        onChange={(e) => updateValue(index, 'GWETROOT', parseFloat(e.target.value))}
                        className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </td>
                    <td className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMonth(index)}
                        className="text-danger hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleForecast}
              disabled={manualForecast.isPending}
              className="w-full md:w-auto"
            >
              <Play className="w-4 h-4 mr-2" />
              {manualForecast.isPending ? 'Calculating...' : 'Run Forecast'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {manualForecast.isPending && (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {manualForecast.isError && (
        <Card className="border border-danger/30">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-danger font-medium">Manual forecast failed</p>
              <p className="text-white/60 text-sm mt-1">
                {(manualForecast.error as any)?.response?.data?.detail
                  ? String((manualForecast.error as any).response.data.detail)
                  : (manualForecast.error as Error)?.message || 'Please check your input values and try again.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {manualForecast.data && (
        <>
          {(selectedStation === 'all' ? Object.keys(STATIONS) : [selectedStation]).map((stationId) => (
            <Card key={stationId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{STATIONS[stationId as StationId].name}</CardTitle>
                  <Badge variant={stationForecasts.find(f => f.station_id === stationId)?.risk_label || 'GREEN'}>
                    {stationForecasts.find(f => f.station_id === stationId)?.risk_label || 'GREEN'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={getChartForStation(stationId as StationId)}
                  lines={[
                    { dataKey: 'Water Level', stroke: '#00C2FF', name: 'Predicted' },
                    { dataKey: 'Threshold', stroke: '#EF4444', name: 'Threshold' },
                  ]}
                  xAxisDataKey="month"
                  height={300}
                />
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </motion.div>
  );
};

export default ManualPrediction;
