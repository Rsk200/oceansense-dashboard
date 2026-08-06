import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { History, Calendar, Filter, Download, Trash2, Inbox } from 'lucide-react';
import { getForecastHistory, clearForecastHistory, type ForecastHistoryRecord } from '../../stores/forecastHistory';
import { downloadCSV, formatDateTime } from '../../utils/helpers';
import { useToast } from '../../components/common/Toast';
import type { RiskLabel, StationId } from '../../types';

type FlatRow = {
  recordId: string;
  runDate: string;
  type: ForecastHistoryRecord['type'];
  mode: ForecastHistoryRecord['mode'];
  forecastYear?: 2026 | 2027;
  stationId?: StationId | 'all';
  station_id?: StationId;
  month: string;
  predicted_water_level_m?: number;
  nino34?: number;
  risk_label?: RiskLabel;
};

const TYPE_LABELS: Record<ForecastHistoryRecord['type'], string> = {
  enso: 'ENSO Forecast',
  'water-level': 'Water Level (Auto/Scenario)',
  manual: 'Manual Prediction',
};

const flattenRecords = (records: ForecastHistoryRecord[]): FlatRow[] =>
  records.flatMap((record) =>
    record.rows.map((row) => ({
      recordId: record.id,
      runDate: record.runDate,
      type: record.type,
      forecastYear: record.forecastYear,
      stationId: record.stationId,
      ...row,
    })),
  );

const ForecastHistory = () => {
  const [records, setRecords] = useState<ForecastHistoryRecord[]>(() => getForecastHistory());
  const [typeFilter, setTypeFilter] = useState<'all' | ForecastHistoryRecord['type']>('all');
  const [stationFilter, setStationFilter] = useState<'all' | StationId>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const toast = useToast();

  const allRows = useMemo(() => flattenRecords(records), [records]);

  const filteredRows = useMemo(() => {
    return allRows.filter((row) => {
      if (typeFilter !== 'all' && row.type !== typeFilter) return false;
      if (stationFilter !== 'all' && row.station_id && row.station_id !== stationFilter) return false;
      if (dateRange.start && new Date(row.runDate) < new Date(dateRange.start)) return false;
      if (dateRange.end && new Date(row.runDate) > new Date(`${dateRange.end}T23:59:59`)) return false;
      return true;
    });
  }, [allRows, typeFilter, stationFilter, dateRange]);

  const stats = useMemo(() => {
    const totalRuns = records.length;
    const totalRows = allRows.length;
    const byType = records.reduce<Record<string, number>>((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    }, {});
    const riskCounts = allRows.reduce<Record<string, number>>((acc, r) => {
      if (r.risk_label) acc[r.risk_label] = (acc[r.risk_label] || 0) + 1;
      return acc;
    }, {});
    const lastRun = records[0]?.runDate;
    return { totalRuns, totalRows, byType, riskCounts, lastRun };
  }, [records, allRows]);

  const handleExport = () => {
    if (filteredRows.length === 0) {
      toast.warning('No records to export for the current filters.');
      return;
    }
    downloadCSV(
      filteredRows.map((row) => ({
        run_date: row.runDate,
        type: row.type,
        mode: row.mode,
        forecast_year: row.forecastYear ?? '',
        station_id: row.station_id ?? row.stationId ?? '',
        month: row.month,
        predicted_water_level_m: row.predicted_water_level_m ?? '',
        nino34: row.nino34 ?? '',
        risk_label: row.risk_label ?? '',
      })),
      `oceansense_forecast_history_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    toast.success('Forecast history exported to CSV');
  };

  const handleClear = () => {
    if (records.length === 0) return;
    if (!window.confirm('Clear all locally stored forecast history? This cannot be undone.')) return;
    clearForecastHistory();
    setRecords([]);
    toast.info('Forecast history cleared');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Forecast History</h1>
          <p className="text-white/70">
            Every ENSO, water-level, and manual forecast run in this browser, stored locally for quick review.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-danger hover:text-red-400">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-3xl font-bold text-accent mb-2">{stats.totalRuns}</div>
            <div className="text-white/60 text-sm">Forecast Runs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-3xl font-bold text-success mb-2">{stats.totalRows}</div>
            <div className="text-white/60 text-sm">Total Data Points</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-3xl font-bold text-warning mb-2">{stats.riskCounts.YELLOW || 0}</div>
            <div className="text-white/60 text-sm">Yellow-Risk Points</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-3xl font-bold text-danger mb-2">{stats.riskCounts.RED || 0}</div>
            <div className="text-white/60 text-sm">Red-Risk Points</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-white/50" />
              <label className="text-white/70 text-sm">Type:</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="all">All Types</option>
                <option value="enso">ENSO Forecast</option>
                <option value="water-level">Water Level</option>
                <option value="manual">Manual Prediction</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-white/70 text-sm">Station:</label>
              <select
                value={stationFilter}
                onChange={(e) => setStationFilter(e.target.value as typeof stationFilter)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="all">All Stations</option>
                <option value="Station-A">Station-A</option>
                <option value="Station-B">Station-B</option>
                <option value="Station-C">Station-C</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-white/50" />
              <label className="text-white/70 text-sm">From:</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-white/70 text-sm">To:</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <History className="w-6 h-6 text-accent" />
            <CardTitle>Forecast Records ({filteredRows.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRows.length === 0 ? (
            <div className="text-center py-12 text-white/50 flex flex-col items-center gap-3">
              <Inbox className="w-10 h-10 text-white/30" />
              <p>No forecast records yet.</p>
              <p className="text-sm">
                Run a forecast from the ENSO, Water Level, or Manual Prediction pages and it will show up here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/70 text-sm font-medium p-3">Run Date</th>
                    <th className="text-left text-white/70 text-sm font-medium p-3">Type</th>
                    <th className="text-left text-white/70 text-sm font-medium p-3">Station</th>
                    <th className="text-left text-white/70 text-sm font-medium p-3">Month</th>
                    <th className="text-left text-white/70 text-sm font-medium p-3">Mode</th>
                    <th className="text-left text-white/70 text-sm font-medium p-3">Nino3.4</th>
                    <th className="text-left text-white/70 text-sm font-medium p-3">Water Level (m)</th>
                    <th className="text-left text-white/70 text-sm font-medium p-3">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.slice(0, 300).map((row, idx) => (
                    <tr key={`${row.recordId}-${idx}`} className="border-b border-white/5 hover:bg-white/5">
                      <td className="text-white p-3 text-sm whitespace-nowrap">{formatDateTime(row.runDate)}</td>
                      <td className="text-white p-3 text-sm">{TYPE_LABELS[row.type]}</td>
                      <td className="text-white p-3">{row.station_id ?? row.stationId ?? '—'}</td>
                      <td className="text-white p-3">{row.month}</td>
                      <td className="text-white p-3">
                        <Badge variant="default">{row.mode}</Badge>
                      </td>
                      <td className="text-white p-3">{row.nino34 !== undefined ? row.nino34.toFixed(2) : '—'}</td>
                      <td className="text-white p-3">
                        {row.predicted_water_level_m !== undefined ? row.predicted_water_level_m.toFixed(2) : '—'}
                      </td>
                      <td className="p-3">
                        {row.risk_label ? <Badge variant={row.risk_label}>{row.risk_label}</Badge> : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRows.length > 300 && (
                <p className="text-white/50 text-xs text-center mt-3">
                  Showing the first 300 of {filteredRows.length} matching rows. Export to CSV to see all of them.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ForecastHistory;
