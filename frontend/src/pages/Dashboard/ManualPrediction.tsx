import { useState } from 'react';
import { motion } from 'framer-motion';
import { useManualWaterLevelForecast } from '../../hooks/queries';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import LineChart from '../../components/common/LineChart';
import { STATIONS, type StationId, type ManualClimateInput, type RiskLabel } from '../../types';
import { Plus, Trash2, Play, AlertCircle, Droplets, TrendingUp, AlertTriangle, CloudRain, Sun, Thermometer, Snowflake, Activity } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

type PresetKey = 'neutral' | 'wetMonsoon' | 'extremeFlood' | 'drySeason' | 'elNino' | 'laNina';

const PRESETS: Record<PresetKey, { label: string; description: string; icon: React.ReactNode; values: Omit<ManualClimateInput, 'month'> }> = {
  neutral: {
    label: 'Neutral Baseline',
    description: 'Average ENSO-neutral conditions with typical seasonal rainfall',
    icon: <Activity className="w-4 h-4 mr-1.5 opacity-70" />,
    values: { enso_index: 0, PRECTOTCORR: 4.5, RAIN_ANOMALY: 0, GWETROOT: 0.55 },
  },
  wetMonsoon: {
    label: 'Wet Monsoon',
    description: 'Heavy monsoon rainfall with saturated soils, elevated flood potential',
    icon: <CloudRain className="w-4 h-4 mr-1.5 text-blue-400" />,
    values: { enso_index: -0.4, PRECTOTCORR: 12.5, RAIN_ANOMALY: 3.2, GWETROOT: 0.95 },
  },
  extremeFlood: {
    label: 'Extreme Flood Scenario',
    description: 'Catastrophic rainfall to guarantee a RED alert on the dashboard',
    icon: <AlertTriangle className="w-4 h-4 mr-1.5 text-danger" />,
    values: { enso_index: 2.0, PRECTOTCORR: 100.0, RAIN_ANOMALY: 50.0, GWETROOT: 1.5 },
  },
  drySeason: {
    label: 'Dry Season',
    description: 'Low rainfall and drier soils typical of the winter dry season',
    icon: <Sun className="w-4 h-4 mr-1.5 text-warning" />,
    values: { enso_index: 0.2, PRECTOTCORR: 0.8, RAIN_ANOMALY: -1.5, GWETROOT: 0.25 },
  },
  elNino: {
    label: 'El Niño (Warm)',
    description: 'Strong warm-phase ENSO signal, historically linked to drier conditions',
    icon: <Thermometer className="w-4 h-4 mr-1.5 text-danger" />,
    values: { enso_index: 1.8, PRECTOTCORR: 2.0, RAIN_ANOMALY: -1.0, GWETROOT: 0.35 },
  },
  laNina: {
    label: 'La Niña (Cool)',
    description: 'Strong cool-phase ENSO signal, historically linked to wetter conditions',
    icon: <Snowflake className="w-4 h-4 mr-1.5 text-accent" />,
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
    return stationData.map(f => {
      const dateStr = new Date(f.month + '-01').toLocaleString('en-US', { month: 'short', year: 'numeric' });
      return {
        month: dateStr,
        'Water Level': f.predicted_water_level_m,
        'Threshold': f.flood_threshold_m,
      };
    });
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

          <div className="mb-6">
            <label className="text-white/70 text-sm mb-3 block font-medium">Quick Scenarios:</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PRESETS) as PresetKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyPreset(key)}
                  title={PRESETS[key].description}
                  className="flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all shadow-sm"
                >
                  {PRESETS[key].icon}
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
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0A192F]/50 backdrop-blur-md">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/70 text-xs uppercase tracking-wider font-medium p-4">Month</th>
                  <th className="text-left text-white/70 text-xs uppercase tracking-wider font-medium p-4">ENSO Index</th>
                  <th className="text-left text-white/70 text-xs uppercase tracking-wider font-medium p-4">Rainfall (mm)</th>
                  <th className="text-left text-white/70 text-xs uppercase tracking-wider font-medium p-4">Rain Anomaly</th>
                  <th className="text-left text-white/70 text-xs uppercase tracking-wider font-medium p-4">Soil Moisture</th>
                  <th className="text-center text-white/70 text-xs uppercase tracking-wider font-medium p-4 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {manualValues.map((row, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors group">
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.month || ''}
                        onChange={(e) => updateValue(index, 'month', e.target.value)}
                        placeholder="YYYY-MM"
                        className="w-full bg-transparent border-0 border-b border-transparent focus:border-accent rounded-none px-2 py-1.5 text-white text-sm font-mono focus:outline-none focus:ring-0 transition-colors"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        step="0.1"
                        value={row.enso_index}
                        onChange={(e) => updateValue(index, 'enso_index', parseFloat(e.target.value))}
                        className="w-full bg-transparent border-0 border-b border-transparent focus:border-accent rounded-none px-2 py-1.5 text-white text-sm font-mono focus:outline-none focus:ring-0 transition-colors"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        step="0.1"
                        value={row.PRECTOTCORR}
                        onChange={(e) => updateValue(index, 'PRECTOTCORR', parseFloat(e.target.value))}
                        className="w-full bg-transparent border-0 border-b border-transparent focus:border-accent rounded-none px-2 py-1.5 text-white text-sm font-mono focus:outline-none focus:ring-0 transition-colors"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        step="0.1"
                        value={row.RAIN_ANOMALY}
                        onChange={(e) => updateValue(index, 'RAIN_ANOMALY', parseFloat(e.target.value))}
                        className="w-full bg-transparent border-0 border-b border-transparent focus:border-accent rounded-none px-2 py-1.5 text-white text-sm font-mono focus:outline-none focus:ring-0 transition-colors"
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
                        className="w-full bg-transparent border-0 border-b border-transparent focus:border-accent rounded-none px-2 py-1.5 text-white text-sm font-mono focus:outline-none focus:ring-0 transition-colors"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => removeMonth(index)}
                        className="text-white/20 hover:text-danger p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
          <div className="flex items-center gap-3 my-8 border-b border-white/10 pb-4">
            <Activity className="text-accent w-6 h-6" />
            <h2 className="text-2xl font-bold text-white">Simulation Results</h2>
          </div>
          
          <div className={selectedStation === 'all' ? "grid grid-cols-1 xl:grid-cols-2 gap-6" : "space-y-6"}>
            {(selectedStation === 'all' ? (Object.keys(STATIONS) as StationId[]) : [selectedStation as StationId]).map((stationId) => {
              const stationData = stationForecasts.filter((f) => f.station_id === stationId);
              const peakRisk = stationData.reduce<RiskLabel>(
                (best, row) =>
                  row.risk_label === 'RED' || (best !== 'RED' && row.risk_label === 'YELLOW')
                    ? row.risk_label
                    : best,
                'GREEN',
              );

              const chartData = getChartForStation(stationId);
              const threshold = stationData[0]?.flood_threshold_m;

              return (
                <Card key={stationId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{STATIONS[stationId].name}</CardTitle>
                      <Badge variant={peakRisk}>{peakRisk}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <LineChart
                      data={chartData}
                      lines={[
                        { dataKey: 'Water Level', stroke: '#00C2FF', name: 'Predicted (m)' },
                        { dataKey: 'Threshold', stroke: '#EF4444', name: 'Danger Level (m)' },
                      ]}
                      referenceAreas={threshold ? [
                        { y1: threshold, y2: threshold + 2, fill: '#EF4444', fillOpacity: 0.1 }
                      ] : undefined}
                      xAxisDataKey="month"
                      height={300}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Risk Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(STATIONS).map(([stationId, config]) => {
                  const stationData = stationForecasts.filter((f) => f.station_id === stationId);
                  if (stationData.length === 0) return null;

                  const highestRisk = stationData.reduce(
                    (best, row) =>
                      row.risk_label === 'RED' || (best.risk_label !== 'RED' && row.risk_label === 'YELLOW')
                        ? row
                        : best,
                    stationData[0],
                  );

                  const RiskIcon =
                    highestRisk.risk_label === 'RED'
                      ? AlertTriangle
                      : highestRisk.risk_label === 'YELLOW'
                        ? TrendingUp
                        : Droplets;
                  const riskColor =
                    highestRisk.risk_label === 'RED'
                      ? 'text-danger'
                      : highestRisk.risk_label === 'YELLOW'
                        ? 'text-warning'
                        : 'text-success';

                  const percentage = Math.min(100, Math.max(0, (highestRisk.predicted_water_level_m / highestRisk.flood_threshold_m) * 100));

                  return (
                    <motion.div
                      key={stationId}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="glass rounded-lg p-5 border border-white/5 relative overflow-hidden"
                    >
                      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[30px] opacity-20 ${highestRisk.risk_label === 'RED' ? 'bg-danger' : highestRisk.risk_label === 'YELLOW' ? 'bg-warning' : 'bg-success'}`} />
                      
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${riskColor}`}>
                            <RiskIcon className="w-4 h-4" />
                          </div>
                          <h3 className="text-base font-bold text-white">{config.name}</h3>
                        </div>
                        <Badge variant={highestRisk.risk_label}>{highestRisk.risk_label}</Badge>
                      </div>

                      <div className="space-y-3 text-sm relative z-10">
                        <div className="flex justify-between items-end border-b border-white/5 pb-2">
                          <div>
                            <span className="text-[10px] uppercase font-mono tracking-wider text-white/50 block mb-1">Peak Month</span>
                            <span className="text-white font-medium">{new Date(highestRisk.month + '-01').toLocaleString('en-US', { month: 'short', year: 'numeric' })}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-white/50 block mb-1">Predicted Peak</span>
                            <span className="text-white font-bold text-lg">{highestRisk.predicted_water_level_m.toFixed(2)}<span className="text-xs text-white/50 font-normal">m</span></span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between text-xs mb-1.5 font-mono">
                            <span className="text-white/50">Capacity vs Danger ({highestRisk.flood_threshold_m.toFixed(2)}m)</span>
                            <span className={percentage >= 100 ? 'text-danger font-bold' : percentage > 85 ? 'text-warning' : 'text-success'}>
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                              className={`h-full rounded-full ${percentage >= 100 ? 'bg-danger shadow-[0_0_10px_rgba(239,68,68,0.5)]' : percentage > 85 ? 'bg-warning' : 'bg-success'}`} 
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </motion.div>
  );
};

export default ManualPrediction;
