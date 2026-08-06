import { useState } from 'react';
import { motion } from 'framer-motion';
import { useEnsoPredict, useEnsoScenario } from '../../hooks/queries';
import { useToast } from '../../components/common/Toast';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import LineChart from '../../components/common/LineChart';
import { downloadCSV } from '../../utils/helpers';
import { Download, RefreshCw, Play } from 'lucide-react';
import type { EnsoForecastResponse } from '../../types';

const EnsoForecast = () => {
  const [forecastYear, setForecastYear] = useState<2026 | 2027>(2026);
  const [scenarioMode, setScenarioMode] = useState(false);
  const [scenarioValues, setScenarioValues] = useState('');
  const [activeForecast, setActiveForecast] = useState<EnsoForecastResponse | null>(null);

  const { data: ensoData, isLoading, refetch, isFetching } = useEnsoPredict();
  const ensoScenario = useEnsoScenario();
  const toast = useToast();

  const displayData = activeForecast ?? ensoData;
  const filteredForecast =
    displayData?.forecast.filter((point) => point.month.startsWith(String(forecastYear))) ?? [];

  const handleScenarioSubmit = () => {
    const values = scenarioValues.split(',').map((v) => parseFloat(v.trim()));
    if (values.some(Number.isNaN)) {
      toast.error('Please enter valid numeric values');
      return;
    }
    if (values.length === 12 || values.length === 24) {
      ensoScenario.mutate(
        { values, forecast_year: forecastYear },
        {
          onSuccess: (data) => {
            setActiveForecast(data);
            toast.success('Scenario forecast generated successfully');
          },
          onError: () => {
            toast.error('Failed to generate scenario forecast');
          },
        },
      );
    } else {
      toast.error('Please enter 12 or 24 comma-separated values');
    }
  };

  const handleRefresh = async () => {
    setActiveForecast(null);
    setScenarioMode(false);
    await refetch();
    toast.success('Auto forecast refreshed');
  };

  const handleDownloadCSV = () => {
    if (filteredForecast.length === 0) {
      toast.warning('No data available to download');
      return;
    }

    const csvData = filteredForecast.map((f) => ({
      Month: f.month,
      'NINO3.4': f.nino34.toFixed(3),
    }));

    downloadCSV(csvData, `enso_forecast_${forecastYear}_${displayData?.mode ?? 'auto'}.csv`);
    toast.success('CSV downloaded successfully');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const chartData = filteredForecast.map((f) => ({
    month: f.month,
    'NINO3.4 Index': f.nino34,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">ENSO Forecast</h1>
          <p className="text-white/70">El Niño-Southern Oscillation predictions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isFetching}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownloadCSV} disabled={filteredForecast.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="enso-year" className="text-white/70 text-sm">Forecast Year:</label>
              <select
                id="enso-year"
                value={forecastYear}
                onChange={(e) => setForecastYear(Number(e.target.value) as 2026 | 2027)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="scenario"
                checked={scenarioMode}
                onChange={(e) => {
                  setScenarioMode(e.target.checked);
                  if (!e.target.checked) setActiveForecast(null);
                }}
                className="w-4 h-4 accent-accent"
              />
              <label htmlFor="scenario" className="text-white/70 text-sm">Scenario Mode</label>
            </div>

            {displayData && (
              <Badge variant="default">{displayData.mode}</Badge>
            )}

            {scenarioMode && (
              <div className="flex items-center space-x-2 flex-1 min-w-[280px]">
                <input
                  type="text"
                  placeholder="Enter 12 or 24 comma-separated NINO3.4 values"
                  value={scenarioValues}
                  onChange={(e) => setScenarioValues(e.target.value)}
                  aria-label="ENSO scenario values"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Button size="sm" onClick={handleScenarioSubmit} disabled={ensoScenario.isPending}>
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </Button>
              </div>
            )}
          </div>
          {scenarioMode && (
            <p className="text-white/50 text-xs mt-3">
              For 2027: provide 12 manual values (backend chains 2026 auto) or 24 values for a full 2026–2027 chain.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ENSO Forecast — {forecastYear}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredForecast.length > 0 ? (
            <LineChart
              data={chartData}
              lines={[{ dataKey: 'NINO3.4 Index', stroke: '#00C2FF', name: 'NINO3.4' }]}
              xAxisDataKey="month"
              height={400}
            />
          ) : (
            <div className="text-center py-12 text-white/50">
              No forecast data for {forecastYear}. Run a scenario or switch to 2026 auto forecast.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/70 text-sm font-medium p-3">Month</th>
                  <th className="text-left text-white/70 text-sm font-medium p-3">NINO3.4 Index</th>
                  <th className="text-left text-white/70 text-sm font-medium p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredForecast.map((point, index) => {
                  const status =
                    point.nino34 > 0.5 ? 'El Niño' : point.nino34 < -0.5 ? 'La Niña' : 'Neutral';
                  const statusColor =
                    status === 'El Niño' ? 'text-danger' : status === 'La Niña' ? 'text-accent' : 'text-success';

                  return (
                    <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                      <td className="text-white p-3">{point.month}</td>
                      <td className="text-white p-3">{point.nino34.toFixed(3)}</td>
                      <td className={`p-3 ${statusColor}`}>{status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnsoForecast;
