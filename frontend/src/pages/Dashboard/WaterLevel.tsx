import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWaterLevelForecast, useWaterLevelScenario } from '../../hooks/queries';
import { useToast } from '../../components/common/Toast';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import LineChart from '../../components/common/LineChart';
import { STATIONS, type StationId, type RiskLabel } from '../../types';
import { downloadCSV } from '../../utils/helpers';
import { Droplets, TrendingUp, AlertTriangle, Download, Play } from 'lucide-react';

const WaterLevel = () => {
  const [selectedStation, setSelectedStation] = useState<StationId | 'all'>('all');
  const [forecastYear, setForecastYear] = useState<2026 | 2027>(2026);
  const [mode, setMode] = useState<'auto' | 'scenario'>('auto');
  const [ensoValuesInput, setEnsoValuesInput] = useState('');

  const toast = useToast();

  const autoQuery = useWaterLevelForecast({
    station_id: selectedStation,
    mode: 'auto',
    forecast_year: forecastYear,
  });

  const scenarioMutation = useWaterLevelScenario();

  const isLoading = mode === 'auto' ? autoQuery.isLoading : scenarioMutation.isPending;
  const waterLevelData = mode === 'auto' ? autoQuery.data : scenarioMutation.data;

  const stationForecasts =
    selectedStation === 'all'
      ? waterLevelData?.forecasts ?? []
      : waterLevelData?.forecasts.filter((f) => f.station_id === selectedStation) ?? [];

  const getChartForStation = (stationId: StationId) => {
    const stationData = stationForecasts.filter((f) => f.station_id === stationId);
    return stationData.map((f) => ({
      month: f.month,
      'Water Level': f.predicted_water_level_m,
      Threshold: f.flood_threshold_m,
    }));
  };

  const handleScenarioRun = () => {
    const values = ensoValuesInput.split(',').map((v) => parseFloat(v.trim()));
    if (values.some(Number.isNaN)) {
      toast.error('Please enter valid numeric ENSO values');
      return;
    }
    if (values.length !== 12 && values.length !== 24) {
      toast.error('Please enter 12 or 24 comma-separated ENSO values');
      return;
    }

    scenarioMutation.mutate(
      {
        station_id: selectedStation,
        mode: 'scenario',
        forecast_year: forecastYear,
        enso_values: values,
      },
      {
        onSuccess: () => toast.success('Scenario water level forecast generated'),
        onError: () => toast.error('Failed to generate scenario forecast'),
      },
    );
  };

  const handleDownloadCSV = () => {
    if (!waterLevelData?.forecasts.length) {
      toast.warning('No forecast data to download');
      return;
    }

    const csvData = waterLevelData.forecasts.map((f) => ({
      Station: f.station_id,
      Month: f.month,
      'Predicted (m)': f.predicted_water_level_m.toFixed(3),
      'Threshold (m)': f.flood_threshold_m.toFixed(3),
      Risk: f.risk_label,
    }));

    downloadCSV(csvData, `water_level_${forecastYear}_${mode}.csv`);
    toast.success('CSV downloaded successfully');
  };

  const stationIds =
    selectedStation === 'all' ? (Object.keys(STATIONS) as StationId[]) : [selectedStation];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Water Level Forecast</h1>
          <p className="text-white/70">Station-specific water level predictions with flood thresholds</p>
        </div>
        <div className="flex items-center space-x-2">
          {mode === 'auto' && (
            <Button variant="ghost" size="sm" onClick={() => autoQuery.refetch()} disabled={isLoading}>
              <Droplets className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={handleDownloadCSV} disabled={!waterLevelData}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="wl-station" className="text-white/70 text-sm">Station:</label>
              <select
                id="wl-station"
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
              <label htmlFor="wl-year" className="text-white/70 text-sm">Forecast Year:</label>
              <select
                id="wl-year"
                value={forecastYear}
                onChange={(e) => setForecastYear(Number(e.target.value) as 2026 | 2027)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label htmlFor="wl-mode" className="text-white/70 text-sm">Mode:</label>
              <select
                id="wl-mode"
                value={mode}
                onChange={(e) => setMode(e.target.value as 'auto' | 'scenario')}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="auto">Auto</option>
                <option value="scenario">Scenario</option>
              </select>
            </div>
          </div>

          {mode === 'scenario' && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={ensoValuesInput}
                onChange={(e) => setEnsoValuesInput(e.target.value)}
                placeholder="12 or 24 comma-separated ENSO values"
                aria-label="ENSO scenario values for water level"
                className="flex-1 min-w-[240px] bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button size="sm" onClick={handleScenarioRun} disabled={scenarioMutation.isPending}>
                <Play className="w-4 h-4 mr-2" />
                Run Scenario
              </Button>
              <p className="w-full text-white/50 text-xs">
                Required when mode is scenario. For 2027, 12 values auto-chain through 2026.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : mode === 'scenario' && !waterLevelData ? (
        <Card>
          <CardContent className="p-8 text-center text-white/60">
            Enter ENSO scenario values and run the forecast to view hydrographs.
          </CardContent>
        </Card>
      ) : (
        <>
          {stationIds.map((stationId) => {
            const stationData = stationForecasts.filter((f) => f.station_id === stationId);
            const peakRisk = stationData.reduce<RiskLabel>(
              (best, row) =>
                row.risk_label === 'RED' || (best !== 'RED' && row.risk_label === 'YELLOW')
                  ? row.risk_label
                  : best,
              'GREEN',
            );

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
                    data={getChartForStation(stationId)}
                    lines={[
                      { dataKey: 'Water Level', stroke: '#00C2FF', name: 'Predicted' },
                      { dataKey: 'Threshold', stroke: '#EF4444', name: 'Threshold' },
                    ]}
                    xAxisDataKey="month"
                    height={300}
                  />
                </CardContent>
              </Card>
            );
          })}

          <Card>
            <CardHeader>
              <CardTitle>Risk Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(STATIONS).map(([stationId, config]) => {
                  const stationData = stationForecasts.filter((f) => f.station_id === stationId);
                  const highestRisk = stationData.reduce(
                    (best, row) =>
                      row.risk_label === 'RED' || (best.risk_label !== 'RED' && row.risk_label === 'YELLOW')
                        ? row
                        : best,
                    stationData[0],
                  );

                  if (!highestRisk) return null;

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

                  return (
                    <motion.div
                      key={stationId}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="glass rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">{config.name}</h3>
                        <Badge variant={highestRisk.risk_label}>{highestRisk.risk_label}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <RiskIcon className={`w-4 h-4 ${riskColor}`} />
                          <span className="text-white/60">Peak month:</span>
                          <span className="text-white">{highestRisk.month}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Level:</span>
                          <span className="text-white">{highestRisk.predicted_water_level_m.toFixed(2)}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Threshold:</span>
                          <span className="text-white">{highestRisk.flood_threshold_m.toFixed(2)}m</span>
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

export default WaterLevel;
