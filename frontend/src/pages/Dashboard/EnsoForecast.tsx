import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useEnsoPredict, useEnsoScenario } from '../../hooks/queries';
import { useToast } from '../../components/common/Toast';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import LineChart from '../../components/common/LineChart';
import { downloadCSV } from '../../utils/helpers';
import { Download, RefreshCw, Play, TrendingUp, Droplets, Sun, Activity } from 'lucide-react';
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

  // Calculate Quick Insights
  const insights = useMemo(() => {
    if (!filteredForecast.length) return null;
    const maxElNino = [...filteredForecast].sort((a, b) => b.nino34 - a.nino34)[0];
    const maxLaNina = [...filteredForecast].sort((a, b) => a.nino34 - b.nino34)[0];
    const avgNino = filteredForecast.reduce((acc, curr) => acc + curr.nino34, 0) / filteredForecast.length;
    
    let domTrend = 'Neutral';
    if (avgNino > 0.5) domTrend = 'El Niño Dominant';
    if (avgNino < -0.5) domTrend = 'La Niña Dominant';

    const currentStatus = filteredForecast[0];
    let currentLabel = 'Neutral';
    if (currentStatus.nino34 > 0.5) currentLabel = 'El Niño';
    if (currentStatus.nino34 < -0.5) currentLabel = 'La Niña';

    let peakExtreme = maxElNino;
    let extremeType = 'El Niño';
    if (Math.abs(maxLaNina.nino34) > Math.abs(maxElNino.nino34)) {
      peakExtreme = maxLaNina;
      extremeType = 'La Niña';
    }

    return { domTrend, currentStatus, currentLabel, peakExtreme, extremeType };
  }, [filteredForecast]);

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

      {/* Quick Insights Cards */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-xl border border-white/10 bg-[#041C3E] p-4 flex items-center gap-4 relative overflow-hidden"
          >
            <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-20 ${insights.currentLabel === 'El Niño' ? 'bg-[#EA4343]' : insights.currentLabel === 'La Niña' ? 'bg-[#00C2FF]' : 'bg-[#21C45D]'}`} />
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-white/70">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-white/50 font-mono uppercase tracking-wider mb-1">Current Status ({insights.currentStatus.month})</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-bold text-white">{insights.currentLabel}</h3>
                <span className="text-sm font-mono text-white/70">({insights.currentStatus.nino34.toFixed(2)})</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-xl border border-white/10 bg-[#041C3E] p-4 flex items-center gap-4 relative overflow-hidden"
          >
            <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-20 ${insights.extremeType === 'El Niño' ? 'bg-[#EA4343]' : 'bg-[#00C2FF]'}`} />
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-white/70">
              {insights.extremeType === 'El Niño' ? <Sun className="w-5 h-5" /> : <Droplets className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs text-white/50 font-mono uppercase tracking-wider mb-1">Peak Extreme</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-bold text-white">{insights.peakExtreme.month}</h3>
                <span className="text-sm font-mono text-white/70">({insights.peakExtreme.nino34.toFixed(2)})</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-xl border border-white/10 bg-[#041C3E] p-4 flex items-center gap-4 relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-20 bg-white/20" />
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-white/70">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-white/50 font-mono uppercase tracking-wider mb-1">Yearly Trend</p>
              <h3 className="text-xl font-bold text-white">{insights.domTrend}</h3>
            </div>
          </motion.div>
        </div>
      )}

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
              referenceLines={[
                { y: 0.5, stroke: '#EA4343', label: 'El Niño Threshold (+0.5)', strokeDasharray: '4 4' },
                { y: -0.5, stroke: '#00C2FF', label: 'La Niña Threshold (-0.5)', strokeDasharray: '4 4' }
              ]}
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
                  <th className="text-left text-white/70 text-sm font-medium p-3">Local Impact (Bangladesh)</th>
                </tr>
              </thead>
              <tbody>
                {filteredForecast.map((point, index) => {
                  const status =
                    point.nino34 > 0.5 ? 'El Niño' : point.nino34 < -0.5 ? 'La Niña' : 'Neutral';
                  
                  let impact = 'Average monsoon patterns expected.';
                  let badgeVariant: 'default' | 'GREEN' | 'RED' = 'GREEN';
                  
                  if (status === 'La Niña') {
                    impact = 'High probability of heavy monsoon rainfall & increased flood risk.';
                    badgeVariant = 'default';
                  } else if (status === 'El Niño') {
                    impact = 'Drier conditions expected; lower flood probability.';
                    badgeVariant = 'RED';
                  }

                  return (
                    <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                      <td className="text-white p-3">{point.month}</td>
                      <td className="text-white p-3 font-mono">{point.nino34.toFixed(3)}</td>
                      <td className="p-3">
                        <Badge variant={badgeVariant} className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5">
                          {status}
                        </Badge>
                      </td>
                      <td className="text-white/60 p-3 text-sm">{impact}</td>
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
