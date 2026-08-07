import { useMemo, useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleUpdate = () => setRecords(getForecastHistory());
    window.addEventListener('forecast_history_updated', handleUpdate);
    
    // Also listen to storage events from other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'oceansense_forecast_history') handleUpdate();
    };
    window.addEventListener('storage', handleStorage);
    
    return () => {
      window.removeEventListener('forecast_history_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

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

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-xl p-6 border border-white/5 relative overflow-hidden"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[40px] opacity-10 bg-accent" />
          <div className="relative z-10 text-center">
            <div className="text-4xl font-black tracking-tight text-accent mb-1">{stats.totalRuns}</div>
            <div className="text-xs uppercase tracking-wider font-semibold text-white/50">Forecast Runs</div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass rounded-xl p-6 border border-white/5 relative overflow-hidden"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[40px] opacity-10 bg-success" />
          <div className="relative z-10 text-center">
            <div className="text-4xl font-black tracking-tight text-success mb-1">{stats.totalRows}</div>
            <div className="text-xs uppercase tracking-wider font-semibold text-white/50">Data Points</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className={`glass rounded-xl p-6 border relative overflow-hidden ${stats.riskCounts.YELLOW ? 'border-warning/30' : 'border-white/5'}`}
        >
          {!!stats.riskCounts.YELLOW && <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[40px] opacity-10 bg-warning" />}
          <div className="relative z-10 text-center">
            <div className={`text-4xl font-black tracking-tight mb-1 ${stats.riskCounts.YELLOW ? 'text-warning' : 'text-white/30'}`}>
              {stats.riskCounts.YELLOW || 0}
            </div>
            <div className="text-xs uppercase tracking-wider font-semibold text-white/50">Yellow Alerts</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className={`glass rounded-xl p-6 border relative overflow-hidden ${stats.riskCounts.RED ? 'border-danger/30' : 'border-white/5'}`}
        >
          {!!stats.riskCounts.RED && <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[40px] opacity-10 bg-danger" />}
          <div className="relative z-10 text-center">
            <div className={`text-4xl font-black tracking-tight mb-1 ${stats.riskCounts.RED ? 'text-danger' : 'text-white/30'}`}>
              {stats.riskCounts.RED || 0}
            </div>
            <div className="text-xs uppercase tracking-wider font-semibold text-white/50">Red Alerts</div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4 border border-white/5">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-accent" />
            <div className="flex items-center space-x-2">
              <label className="text-white/50 text-xs font-mono uppercase tracking-wider">Type:</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                className="bg-white/5 border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
              >
                <option value="all" className="bg-[#041E42]">All Types</option>
                <option value="enso" className="bg-[#041E42]">ENSO Forecast</option>
                <option value="water-level" className="bg-[#041E42]">Water Level</option>
                <option value="manual" className="bg-[#041E42]">Manual Prediction</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-white/50 text-xs font-mono uppercase tracking-wider">Station:</label>
            <select
              value={stationFilter}
              onChange={(e) => setStationFilter(e.target.value as typeof stationFilter)}
              className="bg-white/5 border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
            >
              <option value="all" className="bg-[#041E42]">All Stations</option>
              <option value="Station-A" className="bg-[#041E42]">Jamalpur</option>
              <option value="Station-B" className="bg-[#041E42]">Gaibandha</option>
              <option value="Station-C" className="bg-[#041E42]">Kurigram</option>
            </select>
          </div>

          <div className="flex items-center space-x-4 border-l border-white/10 pl-6">
            <Calendar className="w-4 h-4 text-accent" />
            <div className="flex items-center space-x-2">
              <label className="text-white/50 text-xs font-mono uppercase tracking-wider">From:</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="bg-white/5 border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-white/50 text-xs font-mono uppercase tracking-wider">To:</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="bg-white/5 border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="glass rounded-xl border border-white/5 overflow-hidden">
        <div className="p-5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <History className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-xl font-bold text-white">Forecast Records <span className="text-white/40 text-sm font-normal ml-2">({filteredRows.length} total)</span></h2>
          </div>
        </div>
        
        <div>
          {filteredRows.length === 0 ? (
            <div className="text-center py-16 text-white/50 flex flex-col items-center gap-3">
              <div className="p-4 bg-white/5 rounded-full mb-2">
                <Inbox className="w-8 h-8 text-white/30" />
              </div>
              <p className="text-lg">No forecast records found</p>
              <p className="text-sm">
                Try adjusting your filters, or run a new forecast from the ENSO or Water Level pages.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.01]">
                    <th className="text-white/50 text-[11px] font-bold uppercase tracking-wider px-6 py-4">Run Date</th>
                    <th className="text-white/50 text-[11px] font-bold uppercase tracking-wider px-6 py-4">Type</th>
                    <th className="text-white/50 text-[11px] font-bold uppercase tracking-wider px-6 py-4">Station</th>
                    <th className="text-white/50 text-[11px] font-bold uppercase tracking-wider px-6 py-4">Target Month</th>
                    <th className="text-white/50 text-[11px] font-bold uppercase tracking-wider px-6 py-4 text-center">Mode</th>
                    <th className="text-white/50 text-[11px] font-bold uppercase tracking-wider px-6 py-4 text-right">Nino3.4</th>
                    <th className="text-white/50 text-[11px] font-bold uppercase tracking-wider px-6 py-4 text-right">Water Level</th>
                    <th className="text-white/50 text-[11px] font-bold uppercase tracking-wider px-6 py-4 text-center">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRows.slice(0, 300).map((row, idx) => (
                    <tr key={`${row.recordId}-${idx}`} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 text-sm text-white/80 whitespace-nowrap">{formatDateTime(row.runDate)}</td>
                      <td className="px-6 py-4 text-sm text-white font-medium">{TYPE_LABELS[row.type]}</td>
                      <td className="px-6 py-4 text-sm text-white/80">{row.station_id ?? row.stationId ?? '—'}</td>
                      <td className="px-6 py-4 text-sm text-white/80 whitespace-nowrap">
                        {row.month ? new Date(row.month + '-01').toLocaleString('en-US', { month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="default" className="bg-white/10 hover:bg-white/20 text-white/70 border-0">{row.mode}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/80 text-right font-mono">{row.nino34 !== undefined ? row.nino34.toFixed(2) : '—'}</td>
                      <td className="px-6 py-4 text-sm text-white font-bold text-right font-mono">
                        {row.predicted_water_level_m !== undefined ? `${row.predicted_water_level_m.toFixed(2)}m` : '—'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.risk_label ? <Badge variant={row.risk_label}>{row.risk_label}</Badge> : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRows.length > 300 && (
                <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                  <p className="text-accent text-xs text-center">
                    Showing the first 300 of {filteredRows.length} matching rows. Export to CSV to see all data.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ForecastHistory;
