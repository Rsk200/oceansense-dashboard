import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFloodRisk, useAlerts, useAdvisory, useBootstrapForecast, useEnsoPredict, useWaterLevelForecast } from '../../hooks/queries';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Waves, AlertTriangle, TrendingUp, MapPin, ArrowRight, X, Info } from 'lucide-react';
import { getStationName, STATIONS, type StationId } from '../../types';
import LiveMonitorWidget from '../../components/dashboard/LiveMonitorWidget';

const STATION_IDS = Object.keys(STATIONS) as StationId[];

const RISK_CONFIG: Record<string, { color: string; bg: string }> = {
  RED:    { color: '#EA4343', bg: '#EA43431A' },
  YELLOW: { color: '#E8B208', bg: '#E8B2081A' },
  GREEN:  { color: '#21C45D', bg: '#21C45D1A' },
};

const RealTimeClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return <>{time.toLocaleTimeString()}</>;
};

const Overview = () => {
  const [globalSelectedMonth, setGlobalSelectedMonth] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'enso' | 'alerts' | 'stations' | 'horizon' | null>(null);
  
  const { data: floodRisk, isLoading: riskLoading } = useFloodRisk();
  const { data: alerts, isLoading: alertsLoading } = useAlerts();
  const { data: advisories, isLoading: advisoriesLoading } = useAdvisory();
  const { data: ensoData } = useEnsoPredict();
  const { isBootstrapping } = useBootstrapForecast();

  if (riskLoading || alertsLoading || advisoriesLoading || isBootstrapping) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-white/50 text-sm">{isBootstrapping ? 'Running initial flood forecast...' : 'Loading dashboard...'}</p>
      </div>
    );
  }

  const activeAlerts = alerts?.filter(a => a.risk_label === 'RED' || a.risk_label === 'YELLOW')?.length || 0;
  const highRiskStations = floodRisk?.filter(s => s.risk_label === 'RED' || s.risk_label === 'YELLOW')?.length || 0;
  
  // Get latest ENSO
  const d = new Date();
  const nowKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  const currentEnso = ensoData?.forecast?.find(f => f.month === nowKey)?.nino34 
    ?? ensoData?.forecast?.[0]?.nino34 
    ?? null;
  const ensoLabel = currentEnso !== null 
    ? `${currentEnso > 0 ? '+' : ''}${currentEnso.toFixed(2)}` 
    : 'N/A';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-white/70">Real-time flood risk monitoring and forecasts</p>
        </div>
        <div className="text-sm text-white/50 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 font-mono">
          Last updated: <RealTimeClock />
        </div>
      </div>

      {/* ── Live Monitor Widget ── */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#21C45D] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#21C45D]" />
          </span>
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Real-Time Flood Monitor
          </h2>
        </div>
        <LiveMonitorWidget 
          externalSelectedMonth={globalSelectedMonth} 
          onMonthSelect={setGlobalSelectedMonth} 
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={Waves}
          title="Current ENSO"
          value={ensoLabel}
          subtitle={currentEnso !== null ? (currentEnso > 0.5 ? 'El Niño' : currentEnso < -0.5 ? 'La Niña' : 'Neutral') : ''}
          color="bg-[#00C2FF]"
          onClick={() => setActiveModal('enso')}
        />
        <SummaryCard
          icon={AlertTriangle}
          title="Active Alerts"
          value={activeAlerts.toString()}
          subtitle="Red/Yellow status across stations"
          color="bg-[#EA4343]"
          onClick={() => setActiveModal('alerts')}
        />
        <SummaryCard
          icon={MapPin}
          title="High Risk Stations"
          value={highRiskStations.toString()}
          subtitle={`Out of ${STATION_IDS.length} total stations`}
          color="bg-[#E8B208]"
          onClick={() => setActiveModal('stations')}
        />
        <SummaryCard
          icon={TrendingUp}
          title="Forecast Horizon"
          value="12 Months"
          subtitle="Rolling AI prediction window"
          color="bg-[#21C45D]"
          onClick={() => setActiveModal('horizon')}
        />
      </div>

      {/* Regional Action Center */}
      <div className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Regional Action Center
          </h2>
          <div className="h-px flex-1 bg-white/[0.05]" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {STATION_IDS.map(stationId => (
            <StationActionCard 
              key={stationId} 
              stationId={stationId} 
              selectedMonth={globalSelectedMonth} 
            />
          ))}
        </div>
      </div>

      {/* ── Summary Drill-down Modal ── */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#030A26]/80 p-4 backdrop-blur-sm sm:p-8"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#041C3E] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/[0.05] px-6 py-4 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-[#00C2FF]" />
                  <h3 className="font-display text-lg font-bold text-white">
                    {activeModal === 'enso' && 'Current ENSO Details'}
                    {activeModal === 'alerts' && 'Active Flood Alerts'}
                    {activeModal === 'stations' && 'High Risk Stations Breakdown'}
                    {activeModal === 'horizon' && 'AI Forecast Horizon'}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6">
                {activeModal === 'enso' && (
                  <div className="space-y-4">
                    <p className="text-sm text-white/70 leading-relaxed">
                      The El Niño-Southern Oscillation (ENSO) is a recurring climate pattern involving changes in the temperature of waters in the central and eastern tropical Pacific Ocean.
                    </p>
                    <div className="bg-white/[0.03] p-4 rounded-lg border border-white/[0.05] space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#00C2FF]">La Niña ( &lt; -0.5 )</span>
                        <span className="text-white/50 text-right">Increases regional monsoon rainfall</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/70">Neutral</span>
                        <span className="text-white/50 text-right">Average rainfall conditions</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#EA4343]">El Niño ( &gt; +0.5 )</span>
                        <span className="text-white/50 text-right">Decreases regional monsoon rainfall</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'alerts' && (
                  <div className="space-y-4">
                    <p className="text-sm text-white/70 mb-4">
                      Total <strong>{activeAlerts}</strong> active RED and YELLOW alerts detected across the 12-month window.
                    </p>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {alerts?.filter(a => a.risk_label === 'RED' || a.risk_label === 'YELLOW').map((a, i) => {
                        const rc = RISK_CONFIG[a.risk_label];
                        return (
                          <div key={i} className="flex flex-col gap-2 p-3 bg-white/[0.02] border border-white/[0.05] rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-semibold text-white text-sm">{getStationName(a.station_id)}</div>
                                <div className="text-[11px] font-mono text-white/50">{a.target_month}</div>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-1 rounded" style={{ backgroundColor: rc.bg, color: rc.color }}>
                                {a.risk_label}
                              </span>
                            </div>
                            <div className="text-xs text-white/70 leading-relaxed border-t border-white/[0.05] pt-2 mt-1">
                              {a.message}
                            </div>
                          </div>
                        )
                      })}
                      {activeAlerts === 0 && (
                        <div className="text-center text-white/40 text-sm py-4">No active alerts found.</div>
                      )}
                    </div>
                  </div>
                )}

                {activeModal === 'stations' && (
                  <div className="space-y-4">
                    <p className="text-sm text-white/70 mb-4">
                      <strong>{highRiskStations}</strong> out of {STATION_IDS.length} stations are projected to face RED or YELLOW flood risks within the next 12 months.
                    </p>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {floodRisk?.filter(s => s.risk_label === 'RED' || s.risk_label === 'YELLOW').map((s, i) => {
                        const rc = RISK_CONFIG[s.risk_label];
                        return (
                          <div key={i} className="flex flex-col gap-2 p-3 bg-white/[0.02] border border-white/[0.05] rounded-lg">
                            <div className="flex justify-between items-center">
                              <div className="font-semibold text-white text-sm">{getStationName(s.station_id)}</div>
                              <span className="text-[10px] font-mono px-2 py-1 rounded" style={{ backgroundColor: rc.bg, color: rc.color }}>
                                {s.risk_label}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs text-white/50">
                              <span>Peak Forecast: {s.predicted_water_level_m?.toFixed(2)}m</span>
                              <span>Danger Lvl: {s.flood_threshold_m?.toFixed(2)}m</span>
                            </div>
                          </div>
                        )
                      })}
                      {highRiskStations === 0 && (
                        <div className="text-center text-white/40 text-sm py-4">All stations are currently in safe zones.</div>
                      )}
                    </div>
                  </div>
                )}

                {activeModal === 'horizon' && (
                  <div className="space-y-4">
                    <p className="text-sm text-white/70 leading-relaxed">
                      OceanSense utilizes an advanced <strong>Transformer-based AI architecture</strong> trained on decades of global satellite and regional hydrological data.
                    </p>
                    <p className="text-sm text-white/70 leading-relaxed">
                      The model provides a rolling <strong>12-month prediction window</strong>, meaning every month the forecast dynamically adjusts based on new real-time climate signals (like ENSO oscillations) and upstream river levels.
                    </p>
                    <div className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-lg border border-white/[0.05]">
                      <div className="w-8 h-8 rounded bg-[#21C45D]/20 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-[#21C45D]" />
                      </div>
                      <div className="text-xs text-white/60">
                        Accuracy improves closer to the target month. Long-term (9-12 month) predictions are heavily weighted on global ENSO trends.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Station Action Card (Dynamic by Month) ──
const StationActionCard = ({ stationId, selectedMonth }: { stationId: StationId; selectedMonth: string | null }) => {
  const { data: wlData } = useWaterLevelForecast({ station_id: stationId, mode: 'auto', forecast_year: 2026 });
  const { data: advisories } = useAdvisory();
  
  const d = new Date();
  const nowKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  const targetMonth = selectedMonth || nowKey;

  const stationForecasts = (wlData?.forecasts ?? [])
    .filter(f => f.station_id === stationId)
    .sort((a, b) => a.month.localeCompare(b.month));

  const monthData = stationForecasts.find(f => f.month === targetMonth) ?? stationForecasts[0];
  const advisory = advisories?.find(a => a.station_id === stationId);

  if (!monthData) {
    return (
      <div className="flex flex-col rounded-2xl border border-white/[0.05] bg-[#041C3E]/60 overflow-hidden h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const rk = monthData.risk_label;
  const rc = RISK_CONFIG[rk] || RISK_CONFIG.GREEN;

  // Smart Actions based on risk level for the targeted month
  const smartAdvisory = {
    headline: rk === 'RED' ? 'EVACUATE IMMEDIATELY' : rk === 'YELLOW' ? 'Prepare for possible flooding' : 'Conditions Stable',
    community_message: rk === 'GREEN' ? 'Water levels are stable and within safe limits.' : advisory?.community_message || 'Monitor water levels closely.',
    actions: rk === 'RED' ? [
      'Evacuate immediately using designated safe routes.',
      'Follow instructions from local emergency services.',
      'Do NOT attempt to cross flooded rivers or streams.',
      'Move to designated high-ground shelters.'
    ] : rk === 'YELLOW' ? [
      'Move livestock, seeds, dry food, and documents to higher ground.',
      'Charge mobile phones and share warnings through community groups.',
      'Prepare evacuation routes for vulnerable individuals.',
      'Avoid unnecessary river crossings during night travel.'
    ] : [
      'No immediate action required.',
      'Stay informed on regular weather updates.',
      'Maintain standard preparedness.'
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative flex flex-col rounded-2xl border bg-gradient-to-b from-[#041C3E]/60 to-[#030A26]/80 overflow-hidden backdrop-blur-sm transition-all duration-500`}
      style={{
        borderColor: selectedMonth ? rc.color + '40' : 'rgba(255,255,255,0.05)',
        boxShadow: selectedMonth && rk === 'RED' ? `0 0 30px ${rc.color}20` : 'none',
      }}
    >
      {/* Dynamic Glow Background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none transition-colors duration-700"
        style={{ background: `radial-gradient(circle at top right, ${rc.color}, transparent 60%)` }}
      />

      {/* Card Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/[0.05] transition-colors duration-500" style={{ background: rc.bg }}>
        <h3 className="font-display text-lg font-bold text-white tracking-wide">{getStationName(stationId)}</h3>
        <motion.span 
          key={rk} // forces animation on change
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-mono text-[9px] uppercase font-bold px-2.5 py-1 rounded-sm tracking-widest shadow-sm" 
          style={{ color: rc.color, background: 'rgba(0,0,0,0.25)', border: `1px solid ${rc.color}40` }}
        >
          {rk} RISK
        </motion.span>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-5 relative z-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-white/[0.02] border border-white/[0.03] p-3 transition-colors duration-500" style={{ borderLeft: `2px solid ${rc.color}60` }}>
            <div className="flex justify-between items-center">
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">Forecast Lvl</p>
              <span className="font-mono text-[8px] text-white/30">{targetMonth}</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <motion.span 
                key={monthData.predicted_water_level_m}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-mono text-xl font-semibold text-white"
              >
                {monthData.predicted_water_level_m?.toFixed(2)}
              </motion.span>
              <span className="text-xs text-white/40">m</span>
            </div>
          </div>
          <div className="rounded-lg bg-white/[0.02] border border-white/[0.03] p-3">
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">Danger Lvl</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-mono text-xl font-semibold text-white/60">
                {monthData.flood_threshold_m?.toFixed(2)}
              </span>
              <span className="text-xs text-white/30">m</span>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-white/[0.05]" />

        {/* Smart Advisory Section */}
        <motion.div 
          key={rk}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1"
        >
          <h4 className="font-semibold text-white/90 text-[13px] mb-2 flex items-center gap-2">
            {rk === 'GREEN' ? (
               <div className="w-2 h-2 rounded-full" style={{ background: rc.color }} />
            ) : (
               <AlertTriangle className={`w-4 h-4 ${rk === 'RED' ? 'animate-pulse' : ''}`} style={{ color: rc.color }} />
            )}
            {smartAdvisory.headline}
          </h4>
          <p className="text-white/50 text-[11px] leading-relaxed mb-4 min-h-[40px]">{smartAdvisory.community_message}</p>
          
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 transition-colors duration-500" style={{ background: rk === 'RED' ? 'rgba(234,67,67,0.05)' : '' }}>
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-3 flex items-center gap-1.5">
              <ArrowRight className="w-3 h-3 text-[#00C2FF]" />
              Required Actions
            </p>
            <ul className="flex flex-col gap-2.5">
              {smartAdvisory.actions.map((action: string, i: number) => (
                <li key={i} className="flex items-start gap-2.5 text-[11px] text-white/70 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 shadow-sm transition-colors duration-500" style={{ background: rc.color }} />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

interface SummaryCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  onClick: () => void;
}

const SummaryCard = ({ icon: Icon, title, value, subtitle, color, onClick }: SummaryCardProps) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-2xl border border-[#0072A2]/25 bg-[#041C3E] p-5 transition-all hover:border-[#00C2FF]/60 cursor-pointer shadow-lg hover:shadow-[#00C2FF]/10"
    >
      {/* Background Glow */}
      <div className={`absolute -right-6 -top-6 h-28 w-28 rounded-full blur-[40px] opacity-15 ${color} transition-opacity group-hover:opacity-30`} />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="font-mono text-[10px] uppercase tracking-widest text-white/50 group-hover:text-white/70 transition-colors">{title}</div>
        <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-white/40 group-hover:text-white group-hover:bg-white/[0.06] transition-all">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="font-mono text-3xl font-bold text-white tracking-tight">{value}</div>
        <div className="text-[10px] text-white/40 mt-1 font-medium tracking-wide">{subtitle}</div>
      </div>
    </motion.div>
  );
};

export default Overview;
