/**
 * LiveMonitorWidget v2 — Date-aware, user-friendly, real-time flood forecast panel.
 *
 * Layout:
 *  ┌─────────────────────────────────────────────────────────────────┐
 *  │  TODAY: Aug 2026          ENSO: +0.34 (Neutral)    [Live ●]    │
 *  ├─────────────┬───────────────────────────┬───────────────────────┤
 *  │  THIS MONTH │  12-MONTH RISK TIMELINE   │  PEAK FLOOD ALERT     │
 *  │  big station│  Jan Feb Mar...Dec         │  Month / Station      │
 *  │  readout    │  colored risk blocks       │  How many months away │
 *  └─────────────┴───────────────────────────┴───────────────────────┘
 *
 * All data from real API. Current month is auto-detected from system date.
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  useFloodRisk,
  useEnsoPredict,
  useWaterLevelForecast,
} from '../../hooks/queries';
import { STATIONS, type StationId } from '../../types';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  CalendarDays,
  Clock,
  ChevronDown,
  Maximize2,
  X,
} from 'lucide-react';
import LineChart from '../../components/common/LineChart';

/* ── Constants ─────────────────────────────────────────────────── */
const STATION_IDS = Object.keys(STATIONS) as StationId[];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const RISK = {
  RED:    { color: '#EA4343', bg: '#EA43431A', border: '#EA434340', label: 'HIGH RISK',    short: 'HIGH' },
  YELLOW: { color: '#E8B208', bg: '#E8B2081A', border: '#E8B20840', label: 'MODERATE',     short: 'MOD'  },
  GREEN:  { color: '#21C45D', bg: '#21C45D1A', border: '#21C45D40', label: 'LOW RISK',     short: 'LOW'  },
} as const;
type RiskKey = keyof typeof RISK;

/* ── Helpers ───────────────────────────────────────────────────── */
function currentMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key: string): string {
  const [, mm] = key.split('-');
  return MONTH_NAMES[parseInt(mm, 10) - 1] ?? key;
}

function monthsFromNow(key: string): number {
  const now = new Date();
  const [y, m] = key.split('-').map(Number);
  return (y - now.getFullYear()) * 12 + (m - (now.getMonth() + 1));
}

function buildPath(vals: number[], W: number, H: number, pad = 4): string {
  if (vals.length < 2) return '';
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const rng = hi - lo || 1;
  return vals
    .map((v, i) => {
      const x = (i / (vals.length - 1)) * W;
      const y = H - pad - ((v - lo) / rng) * (H - pad * 2);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

/* ── Sub-components ────────────────────────────────────────────── */

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const currentValRef = useRef(displayValue);

  useEffect(() => {
    const start = currentValRef.current;
    const end = value;
    if (start === end) return;
    
    const duration = 600;
    let frame: number;
    const startTime = performance.now();
    
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      
      setDisplayValue(current);
      currentValRef.current = current;
      
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{displayValue.toFixed(2)}</>;
};

// Animated fill bar
const FillBar = ({ pct, color }: { pct: number; color: string }) => (
  <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
    <motion.div
      className="h-full rounded-full"
      style={{ background: color }}
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(pct, 1) * 100}%` }}
      transition={{ duration: 1, ease: 'easeOut' }}
    />
  </div>
);

// ENSO phase chip
const EnsoChip = ({ val }: { val: number | null }) => {
  if (val === null) return <span className="font-mono text-xs text-white/30">Calculating…</span>;
  const phase = val > 0.5 ? 'El Niño' : val < -0.5 ? 'La Niña' : 'Neutral';
  const color = val > 0.5 ? '#EA4343' : val < -0.5 ? '#00C2FF' : '#21C45D';
  const Icon = val > 0.5 ? TrendingUp : val < -0.5 ? TrendingDown : Minus;
  const impact = val > 0.5
    ? 'Warmer Pacific → heavier Bangladesh monsoon'
    : val < -0.5
    ? 'Cooler Pacific → lighter monsoon, drought risk'
    : 'Normal Pacific → average monsoon expected';
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5" style={{ color }}>
        <Icon className="h-3.5 w-3.5" />
        <span className="font-mono text-xs font-semibold tabular-nums">
          {val > 0 ? '+' : ''}{val.toFixed(2)} · {phase}
        </span>
      </div>
      <p className="text-[10px] leading-4 text-white/35">{impact}</p>
    </div>
  );
};

// 12-month risk timeline strip
const RiskTimeline = ({
  months,
  currentMonth,
  selectedMonth,
  onSelectMonth,
}: {
  months: { key: string; risk: RiskKey }[];
  currentMonth: string;
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
}) => (
  <div className="flex w-full gap-0.5">
    {months.map(({ key, risk }) => {
      const rc = RISK[risk];
      const isCurrent = key === currentMonth;
      const isSelected = key === selectedMonth;
      const isPast = key < currentMonth;
      return (
        <button
          key={key}
          onClick={() => onSelectMonth(key)}
          className="group relative flex flex-1 flex-col items-center gap-0.5 focus-visible:outline focus-visible:outline-[#00C2FF]"
        >
          <div
            className={`h-7 w-full rounded-sm transition-all duration-200 ${isSelected ? 'ring-2 ring-white/80 ring-offset-1 ring-offset-[#030A26] scale-105 z-10' : 'hover:scale-105 hover:z-10'} ${isPast && !isSelected && !isCurrent ? 'opacity-30 grayscale' : ''}`}
            style={{ background: isSelected || isCurrent ? rc.color : rc.bg, border: `1px solid ${rc.border}` }}
            title={`${monthLabel(key)} – ${rc.label}${isPast ? ' (Past)' : ''}`}
          />
          <span className={`text-[8px] font-mono tabular-nums ${isSelected || isCurrent ? 'text-white' : 'text-white/25 group-hover:text-white/60'}`}>
            {monthLabel(key)}
          </span>
          {isCurrent && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] font-bold text-white/70">
              ▼ NOW
            </div>
          )}
        </button>
      );
    })}
  </div>
);

/* ── Main Widget ───────────────────────────────────────────────── */
interface LiveMonitorWidgetProps {
  externalSelectedMonth?: string | null;
  onMonthSelect?: (month: string | null) => void;
}

const LiveMonitorWidget = ({ externalSelectedMonth, onMonthSelect }: LiveMonitorWidgetProps = {}) => {
  const [activeStation, setActiveStation] = useState(0);
  const [internalMonth, setInternalMonth] = useState<string | null>(null);
  
  const selectedMonth = externalSelectedMonth !== undefined ? externalSelectedMonth : internalMonth;
  const handleSelectMonth = (m: string | null) => {
    if (onMonthSelect) onMonthSelect(m);
    else setInternalMonth(m);
  };

  const [clock, setClock] = useState(new Date());
  const [isPaused, setIsPaused] = useState(false);
  const [zoomedChart, setZoomedChart] = useState<'water' | 'enso' | null>(null);
  const nowKey = currentMonthKey();

  // Auto-cycle + Clock
  useEffect(() => {
    let tickCount = 0;
    const t = setInterval(() => {
      setClock(new Date());
      if (!isPaused) {
        tickCount++;
        if (tickCount >= 5) {
          tickCount = 0;
          setActiveStation(prev => (prev + 1) % STATION_IDS.length);
        }
      }
    }, 1000);
    return () => clearInterval(t);
  }, [isPaused]);

  const stationId = STATION_IDS[activeStation];

  // Data hooks
  const { data: floodRisk, isLoading: riskLoading } = useFloodRisk();
  const { data: ensoData } = useEnsoPredict();
  const { data: wlData, isLoading: wlLoading } = useWaterLevelForecast({
    station_id: stationId,
    mode: 'auto',
    forecast_year: 2026,
  });

  const activeMonthKey = selectedMonth ?? nowKey;

  // All months for this station (sorted)
  const stationForecasts = (wlData?.forecasts ?? [])
    .filter(f => f.station_id === stationId)
    .sort((a, b) => a.month.localeCompare(b.month));

  // Active month's specific forecast
  const activeMonthForecast = stationForecasts.find(f => f.month === activeMonthKey)
    ?? stationForecasts[0];

  /* Derived values for the left column (based on active month) */
  const riskKey = (activeMonthForecast?.risk_label ?? 'GREEN') as RiskKey;
  const rc = RISK[riskKey];

  const waterLevel = activeMonthForecast?.predicted_water_level_m ?? null;
  const threshold  = activeMonthForecast?.flood_threshold_m ?? 1;
  const fillPct    = waterLevel !== null ? waterLevel / threshold : 0;

  // Current month ENSO value
  const ensoNow = ensoData?.forecast?.find(f => f.month === nowKey)?.nino34
    ?? ensoData?.forecast?.[0]?.nino34
    ?? null;

  // 12-month timeline data
  const timelineMonths = stationForecasts.map(f => ({
    key: f.month,
    risk: f.risk_label as RiskKey,
  }));

  // Peak risk month (highest risk, then earliest)
  const peakMonth = [...stationForecasts].sort((a, b) => {
    const order: Record<string, number> = { RED: 0, YELLOW: 1, GREEN: 2 };
    return (order[a.risk_label] ?? 2) - (order[b.risk_label] ?? 2) || a.month.localeCompare(b.month);
  })[0];

  const peakRc = peakMonth ? RISK[peakMonth.risk_label as RiskKey] : null;
  const peakMonthsAway = peakMonth ? monthsFromNow(peakMonth.month) : null;

  // Spark values
  const wlSpark = stationForecasts.map(f => f.predicted_water_level_m);
  const ensoSpark = (ensoData?.forecast ?? [])
    .filter(f => f.month.startsWith('2026'))
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(f => f.nino34);

  const isLoading = riskLoading || wlLoading;

  return (
    <div 
      className="overflow-hidden rounded-2xl border border-[#0072A2]/25 bg-gradient-to-b from-[#041C3E] to-[#030A26]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >

      {/* ── Top status bar ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-white/[0.06] bg-[#030A26]/60 px-5 py-2.5">
        {/* Date */}
        <div className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 text-[#00C2FF]/50" />
          <span className="font-mono text-[11px] font-semibold text-white/60 tabular-nums">
            {clock.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
          </span>
          <span className="font-mono text-[11px] text-white/30 tabular-nums">
            {clock.toLocaleTimeString('en-GB')}
          </span>
        </div>

        {/* ENSO status */}
        <EnsoChip val={ensoNow} />

        {/* Live badge */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            {!isPaused && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#21C45D] opacity-60" />}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${isPaused ? 'bg-[#E8B208]' : 'bg-[#21C45D]'}`} />
          </span>
          <span className={`font-mono text-[10px] font-semibold uppercase tracking-widest ${isPaused ? 'text-[#E8B208]/80' : 'text-[#21C45D]/80'}`}>
            {isPaused ? 'Auto-cycle Paused' : 'Live · updates every 5s'}
          </span>
        </div>
      </div>

      {/* ── Station tabs ───────────────────────────────────────── */}
      <div className="flex border-b border-white/[0.06]">
        {STATION_IDS.map((sid, i) => {
          const sr = floodRisk?.find(r => r.station_id === sid);
          const rk = (sr?.risk_label ?? 'GREEN') as RiskKey;
          const isActive = i === activeStation;
          return (
            <button
              key={sid}
              onClick={() => setActiveStation(i)}
              className={`flex flex-1 flex-col items-center gap-0.5 border-b-2 py-2.5 text-center transition-all duration-200 focus-visible:outline focus-visible:outline-[#00C2FF] ${
                isActive
                  ? 'border-[#00C2FF] bg-[#041C3E]/60'
                  : 'border-transparent hover:border-white/20 hover:bg-white/[0.03]'
              }`}
            >
              <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-white/45'}`}>
                {STATIONS[sid].name}
              </span>
              <span
                className="rounded-sm px-1.5 py-px font-mono text-[9px] font-bold tracking-wider"
                style={{ color: RISK[rk].color, background: RISK[rk].bg }}
              >
                {RISK[rk].short}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Main 3-column body ─────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stationId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 divide-y divide-white/[0.05] md:grid-cols-[240px_1fr_200px] md:divide-x md:divide-y-0"
        >

          {/* ── Col 1: SELECTED MONTH readout ──────────────────────── */}
          <div className="flex flex-col gap-4 p-5">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
                Prediction · {activeMonthKey} {activeMonthKey === nowKey ? '(Now)' : ''}
              </p>
              <h3 className="mt-0.5 font-display text-sm font-bold text-white">
                {STATIONS[stationId].name} Station
              </h3>
            </div>

            {/* Big water level */}
            <div>
              <div className="font-mono text-5xl font-semibold leading-none tabular-nums text-white">
                {isLoading
                  ? <span className="text-2xl text-white/30 animate-pulse">Loading…</span>
                  : activeMonthForecast
                    ? <AnimatedNumber value={activeMonthForecast.predicted_water_level_m} />
                    : waterLevel !== null ? <AnimatedNumber value={waterLevel} /> : '—'
                }
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="font-mono text-xs text-white/35">metres</span>
                <span className="font-mono text-xs text-white/20">·</span>
                <span className="font-mono text-xs text-white/35">
                  threshold {threshold.toFixed(2)} m
                </span>
              </div>
            </div>

            {/* Risk badge */}
            <div
              className="inline-flex w-fit items-center gap-2 rounded-md px-3 py-1.5"
              style={{ background: rc.bg, border: `1px solid ${rc.border}` }}
            >
              {riskKey === 'RED' && <AlertTriangle className="h-3.5 w-3.5" style={{ color: rc.color }} />}
              <span className="font-mono text-xs font-bold tracking-wider" style={{ color: rc.color }}>
                {rc.label}
              </span>
            </div>

            {/* Fill bar */}
            <div className="space-y-1">
              <FillBar pct={fillPct} color={rc.color} />
              <div className="flex justify-between font-mono text-[9px] text-white/25 tabular-nums">
                <span>0</span>
                <span style={{ color: rc.color }}>{(fillPct * 100).toFixed(0)}% of flood level</span>
                <span>{threshold.toFixed(1)} m</span>
              </div>
            </div>

            {/* Water level mini-chart */}
            {wlSpark.length > 1 && (
              <div className="group/chart relative rounded-lg border border-white/[0.06] bg-white/[0.03] p-3 transition-colors hover:border-white/[0.15]">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-white/25">
                    Year forecast · {stationForecasts[0]?.month} → {stationForecasts[stationForecasts.length - 1]?.month}
                  </p>
                  <button
                    onClick={() => setZoomedChart('water')}
                    className="flex h-5 w-5 items-center justify-center rounded bg-white/[0.05] text-white/40 opacity-0 transition-all hover:bg-white/[0.1] hover:text-white group-hover/chart:opacity-100"
                    title="View detailed chart"
                  >
                    <Maximize2 className="h-3 w-3" />
                  </button>
                </div>
                <svg width="100%" height="48" viewBox="0 0 200 48" preserveAspectRatio="none">
                  {/* Threshold line */}
                  {stationForecasts.length > 0 && (() => {
                    const lo = Math.min(...wlSpark), hi = Math.max(...wlSpark, threshold);
                    const rng = hi - lo || 1;
                    const ty = 48 - 4 - ((threshold - lo) / rng) * (48 - 8);
                    return <line x1="0" y1={ty} x2="200" y2={ty} stroke="rgba(234,67,67,0.4)" strokeDasharray="3 2" strokeWidth="1" />;
                  })()}
                  <path d={buildPath(wlSpark, 200, 48)} fill="none" stroke={rc.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Selected month dot */}
                  {(() => {
                    const idx = stationForecasts.findIndex(f => f.month === activeMonthKey);
                    if (idx < 0 || wlSpark.length < 2) return null;
                    const lo = Math.min(...wlSpark), hi = Math.max(...wlSpark);
                    const rng = hi - lo || 1;
                    const x = (idx / (wlSpark.length - 1)) * 200;
                    const y = 48 - 4 - ((wlSpark[idx] - lo) / rng) * (48 - 8);
                    return <circle cx={x} cy={y} r="3.5" fill={rc.color} style={{ filter: `drop-shadow(0 0 4px ${rc.color})` }} />;
                  })()}
                  {/* Hover Tooltips */}
                  {wlSpark.map((v, i) => (
                    <rect 
                      key={i} x={(i / (wlSpark.length - 1)) * 200 - 5} y="0" width="10" height="48" fill="transparent" 
                      className="cursor-crosshair"
                      title={`${stationForecasts[i]?.month}: ${v.toFixed(2)}m`}
                    />
                  ))}
                </svg>
                <div className="mt-1 flex justify-between font-mono text-[8px] text-white/20 tabular-nums">
                  <span>Jan</span>
                  <span className="text-white/40">▲ {activeMonthKey === nowKey ? 'now' : 'selected'}</span>
                  <span>Dec</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Col 2: 12-month risk timeline ──────────────────── */}
          <div className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
                  12-Month Flood Risk Timeline
                </p>
                <p className="mt-0.5 text-xs text-white/50">
                  Each block = one month's predicted risk level
                </p>
              </div>
              <div className="flex items-center gap-3">
                {(['LOW RISK', 'MODERATE', 'HIGH RISK'] as const).map((label) => {
                  const rk2 = label === 'LOW RISK' ? 'GREEN' : label === 'MODERATE' ? 'YELLOW' : 'RED';
                  return (
                    <div key={label} className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-sm" style={{ background: RISK[rk2].color }} />
                      <span className="font-mono text-[9px] text-white/35">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline blocks */}
            {timelineMonths.length > 0 ? (
              <div className="mt-2">
                <RiskTimeline 
                  months={timelineMonths} 
                  currentMonth={nowKey} 
                  selectedMonth={activeMonthKey}
                  onSelectMonth={handleSelectMonth} 
                />
              </div>
            ) : (
              <div className="flex h-20 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03]">
                <span className="font-mono text-xs text-white/30 animate-pulse">Loading forecast…</span>
              </div>
            )}

            {/* ENSO trend for the year */}
            {ensoSpark.length > 1 && (
              <div className="group/enso relative rounded-lg border border-white/[0.06] bg-white/[0.03] p-3 transition-colors hover:border-white/[0.15]">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-white/25">
                    ENSO signal · 2026 trend (Niño 3.4 index)
                  </p>
                  <button
                    onClick={() => setZoomedChart('enso')}
                    className="flex h-5 w-5 items-center justify-center rounded bg-white/[0.05] text-white/40 opacity-0 transition-all hover:bg-white/[0.1] hover:text-white group-hover/enso:opacity-100"
                    title="View detailed ENSO chart"
                  >
                    <Maximize2 className="h-3 w-3" />
                  </button>
                </div>
                <svg width="100%" height="40" viewBox="0 0 200 40" preserveAspectRatio="none">
                  {/* Zero line */}
                  <line x1="0" y1="20" x2="200" y2="20" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 2" strokeWidth="1" />
                  {/* +0.5 El Niño line */}
                  <line x1="0" y1="10" x2="200" y2="10" stroke="rgba(234,67,67,0.2)" strokeDasharray="2 3" strokeWidth="1" />
                  {/* -0.5 La Niña line */}
                  <line x1="0" y1="30" x2="200" y2="30" stroke="rgba(0,194,255,0.2)" strokeDasharray="2 3" strokeWidth="1" />
                  <path
                    d={buildPath(ensoSpark, 200, 40)}
                    fill="none"
                    stroke={ensoNow !== null ? (ensoNow > 0.5 ? '#EA4343' : ensoNow < -0.5 ? '#00C2FF' : '#21C45D') : '#00C2FF'}
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  />
                  {/* Hover Tooltips */}
                  {ensoSpark.map((v, i) => {
                    const sortedForecasts = ensoData?.forecast?.filter(f => f.month.startsWith('2026'))?.sort((a,b) => a.month.localeCompare(b.month));
                    return (
                      <rect 
                        key={i} x={(i / (ensoSpark.length - 1)) * 200 - 5} y="0" width="10" height="40" fill="transparent" 
                        className="cursor-crosshair"
                        title={`${sortedForecasts?.[i]?.month}: ${v > 0 ? '+' : ''}${v.toFixed(2)}`}
                      />
                    );
                  })}
                </svg>
                <div className="mt-1 flex justify-between font-mono text-[8px] text-white/20 tabular-nums">
                  <span className="text-[#00C2FF]/50">La Niña &lt; −0.5</span>
                  <span>Neutral</span>
                  <span className="text-[#EA4343]/50">El Niño &gt; +0.5</span>
                </div>
              </div>
            )}

            {/* Scenario Link */}
            <Link 
              to="/dashboard/manual"
              className="group flex items-center justify-between rounded-lg border border-[#00C2FF]/30 bg-[#00C2FF]/10 px-3 py-2.5 transition-colors hover:bg-[#00C2FF]/20"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[10px] font-bold text-[#00C2FF]">Run Custom Scenario</span>
                <span className="text-[9px] text-white/50">Simulate different ENSO conditions</span>
              </div>
              <TrendingUp className="h-4 w-4 text-[#00C2FF] transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Causal chain note */}
            <div className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.03] px-3 py-2.5">
              <div className="flex items-center gap-1.5 font-mono text-[9px] text-white/30">
                <span className="text-[#00C2FF]/50">Pacific ENSO</span>
                <span>→</span>
                <span>Monsoon rainfall</span>
                <span>→</span>
                <span>River water level</span>
                <span>→</span>
                <span>Flood threshold</span>
                <span>→</span>
                <span style={{ color: rc.color }}>{rc.label}</span>
              </div>
            </div>
          </div>

          {/* ── Col 3: Peak alert ──────────────────────────────── */}
          <div className="flex flex-col gap-4 p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
              Peak Flood Month
            </p>

            {peakMonth && peakRc ? (
              <div className="flex flex-col gap-3">
                {/* Month */}
                <div
                  className="flex flex-col items-center justify-center rounded-xl py-5 text-center"
                  style={{ background: peakRc.bg, border: `1px solid ${peakRc.border}` }}
                >
                  <span className="font-mono text-4xl font-bold tabular-nums" style={{ color: peakRc.color }}>
                    {monthLabel(peakMonth.month)}
                  </span>
                  <span className="mt-0.5 font-mono text-xs text-white/40 tabular-nums">
                    {peakMonth.month}
                  </span>
                  <div
                    className="mt-2 rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider"
                    style={{ color: peakRc.color, background: 'rgba(0,0,0,0.2)' }}
                  >
                    {peakRc.label}
                  </div>
                </div>

                {/* Countdown */}
                <div className="flex flex-col gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
                  <div className="flex items-center gap-1.5 text-white/40">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="font-mono text-[9px] uppercase tracking-widest">Time until peak</span>
                  </div>
                  {peakMonthsAway !== null && peakMonthsAway >= 0 ? (
                    <div className="flex items-end gap-1">
                      <span className="font-mono text-2xl font-bold tabular-nums text-white">{peakMonthsAway}</span>
                      <span className="mb-0.5 font-mono text-xs text-white/35">month{peakMonthsAway !== 1 ? 's' : ''} away</span>
                    </div>
                  ) : (
                    <span className="font-mono text-xs text-white/30">Peak month has passed</span>
                  )}
                </div>

                {/* Peak water level */}
                {peakMonth.predicted_water_level_m && (
                  <div className="flex flex-col gap-1 rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">
                      Predicted water level
                    </span>
                    <div className="flex items-end gap-1">
                      <span className="font-mono text-xl font-bold tabular-nums" style={{ color: peakRc.color }}>
                        {peakMonth.predicted_water_level_m.toFixed(2)}
                      </span>
                      <span className="mb-0.5 font-mono text-xs text-white/35">m</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(peakMonth.predicted_water_level_m / peakMonth.flood_threshold_m, 1) * 100}%`,
                          background: peakRc.color,
                        }}
                      />
                    </div>
                    <span className="font-mono text-[9px] text-white/25 tabular-nums">
                      / {peakMonth.flood_threshold_m.toFixed(2)} m threshold
                    </span>
                  </div>
                )}

                {/* Recommended action */}
                <div
                  className="flex items-start gap-2 rounded-lg p-3"
                  style={{ background: peakRc.bg, border: `1px solid ${peakRc.border}` }}
                >
                  <ChevronDown className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: peakRc.color }} />
                  <p className="text-[10px] leading-4 text-white/55">
                    {peakMonth.risk_label === 'RED'
                      ? 'High flood risk predicted. Prepare evacuation plans and pre-position emergency resources now.'
                      : peakMonth.risk_label === 'YELLOW'
                      ? 'Moderate risk ahead. Monitor water levels closely and brief local response teams.'
                      : 'Low risk forecast. Continue routine monitoring through the season.'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
                <span className="font-mono text-xs text-white/25 animate-pulse">Analyzing forecast…</span>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Zoom Chart Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {zoomedChart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#030A26]/80 p-4 backdrop-blur-sm sm:p-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#041C3E] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/[0.05] px-6 py-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    {zoomedChart === 'water' ? `${STATIONS[stationId].name} Water Level Forecast` : 'ENSO Signal Trend (Niño 3.4)'}
                  </h3>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                    {zoomedChart === 'water' ? 'Predicted Water Levels vs Flood Threshold' : '12-Month Climate Projection'}
                  </p>
                </div>
                <button
                  onClick={() => setZoomedChart(null)}
                  className="rounded p-2 text-white/50 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 flex-1 min-h-[400px]">
                {zoomedChart === 'water' ? (
                  <LineChart
                    data={stationForecasts.map(f => ({
                      month: monthLabel(f.month),
                      waterLevel: Number(f.predicted_water_level_m.toFixed(2)),
                      threshold: Number(f.flood_threshold_m.toFixed(2)),
                    }))}
                    lines={[
                      {
                        dataKey: 'waterLevel',
                        stroke: rc.color,
                        name: 'Predicted Water Level (m)',
                      },
                      {
                        dataKey: 'threshold',
                        stroke: '#EA4343',
                        name: 'Flood Threshold (m)',
                      },
                    ]}
                    xAxisDataKey="month"
                    height={400}
                  />
                ) : (
                  <LineChart
                    data={(ensoData?.forecast ?? [])
                      .filter(f => f.month.startsWith('2026'))
                      .sort((a, b) => a.month.localeCompare(b.month))
                      .map(f => ({
                        month: monthLabel(f.month),
                        enso: Number(f.nino34.toFixed(2)),
                      }))}
                    lines={[
                      {
                        dataKey: 'enso',
                        stroke: '#00C2FF',
                        name: 'Niño 3.4 Index',
                      }
                    ]}
                    xAxisDataKey="month"
                    height={400}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveMonitorWidget;
