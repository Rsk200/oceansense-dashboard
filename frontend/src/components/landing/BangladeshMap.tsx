/**
 * BangladeshMap.tsx
 *
 * Real Bangladesh boundary from Natural Earth 1:10m (ISO_A3='BGD'), 2280 vertices.
 * Stations projected via d3.geoMercator().fitSize() — NOT manually authored coords.
 * Risk is 100% data-driven via getRiskLevel(waterLevel, thresholds).
 * Live simulation via setInterval; swap for WebSocket body without touching JSX.
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { geoMercator, geoPath } from 'd3-geo';
import bangladeshRaw from '../../assets/bangladesh.geojson?raw';
import { useFloodRisk } from '../../hooks/queries';

/* ─────────────────────────────────────────────────────────
   1. GeoJSON — use exactly what we fetched from Natural Earth
──────────────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BANGLADESH_GEOJSON: any = JSON.parse(bangladeshRaw);

/* ─────────────────────────────────────────────────────────
   2. Station definitions — real coordinates, real thresholds
──────────────────────────────────────────────────────────── */
interface Station {
  id: string;
  label: string;
  location: string;
  lat: number;
  lon: number;
  dangerThreshold: number; // RED above this
  warningThreshold: number; // YELLOW above this
}

const STATIONS: Station[] = [
  { id: 'Station-A', label: 'Jamalpur', location: 'Jamalpur',  lat: 24.9375, lon: 89.9370, dangerThreshold: 19.05, warningThreshold: 17.05 },
  { id: 'Station-B', label: 'Gaibandha', location: 'Gaibandha', lat: 25.3288, lon: 89.5286, dangerThreshold: 19.35, warningThreshold: 17.35 },
  { id: 'Station-C', label: 'Kurigram', location: 'Kurigram',  lat: 25.8054, lon: 89.6362, dangerThreshold: 23.25, warningThreshold: 21.25 },
];

/* ─────────────────────────────────────────────────────────
   3. THE ONE RISK FUNCTION — every badge / color / glow
      derives from here, never from a stored field.
──────────────────────────────────────────────────────────── */
interface RiskInfo { label: string; color: string; glow: string; bg: string; border: string; pulseSeconds: number }

function getRiskLevel(waterLevel: number, warningThreshold: number, dangerThreshold: number): RiskInfo {
  if (waterLevel >= dangerThreshold)  return { label: 'High Risk', color: '#ef4444', glow: 'rgba(239,68,68,0.45)',  bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.35)',  pulseSeconds: 1.1 };
  if (waterLevel >= warningThreshold) return { label: 'Moderate',  color: '#eab308', glow: 'rgba(234,179,8,0.45)', bg: 'rgba(234,179,8,0.10)', border: 'rgba(234,179,8,0.35)', pulseSeconds: 1.8 };
  return                                       { label: 'Low Risk',  color: '#22c55e', glow: 'rgba(34,197,94,0.40)', bg: 'rgba(34,197,94,0.10)',  border: 'rgba(34,197,94,0.30)',  pulseSeconds: 2.8 };
}

/* ─────────────────────────────────────────────────────────
   4. Live station state
──────────────────────────────────────────────────────────── */
interface LiveStation extends Station {
  waterLevel: number;
  sparkline: number[];
  updatedAt: Date;
  px: number; // projected x
  py: number; // projected y
}

const SPARKLINE_LEN = 20;

function initSparkline(base: number, s: Station): number[] {
  const ri = getRiskLevel(base, s.warningThreshold, s.dangerThreshold);
  const drift = ri.label === 'High Risk' ? 0.05 : ri.label === 'Moderate' ? 0.01 : -0.01;
  const pts: number[] = [];
  let v = base - drift * SPARKLINE_LEN;
  for (let i = 0; i < SPARKLINE_LEN; i++) {
    v += drift + (Math.random() - 0.5) * 0.18;
    pts.push(+v.toFixed(3));
  }
  return pts;
}

/* ─────────────────────────────────────────────────────────
   5. Sparkline component
──────────────────────────────────────────────────────────── */
function Sparkline({ values, color }: { values: number[]; color: string }) {
  const W = 88, H = 26, pad = 2;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const rng = max - min || 1;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (W - pad * 2);
    const y = pad + (1 - (v - min) / rng) * (H - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const last = pts[pts.length - 1].split(',');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W, height: H }}>
      <defs>
        <linearGradient id={`sg${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={`${pts[0]} ${pts.join(' ')} ${W - pad},${H} ${pad},${H}`} fill={`url(#sg${color.replace('#', '')})`} />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={color} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   6. Elapsed time hook
──────────────────────────────────────────────────────────── */
function useElapsed(date: Date) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick(n => n + 1), 30000);
    return () => clearInterval(id);
  }, []);
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  return mins < 1 ? 'just now' : `${mins} min ago`;
}

/* ─────────────────────────────────────────────────────────
   7. Station card
──────────────────────────────────────────────────────────── */
function StationCard({ s, selected, onSelect }: { s: LiveStation; selected: boolean; onSelect: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  // Compute risk LIVE from current water level — no stored badge
  const ri = getRiskLevel(s.waterLevel, s.warningThreshold, s.dangerThreshold);
  const elapsed = useElapsed(s.updatedAt);
  const prevWl = useRef(s.waterLevel);
  useEffect(() => { prevWl.current = s.waterLevel; }, [s.waterLevel]);

  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ scale: 1.02, backgroundColor: selected ? ri.bg : 'rgba(255,255,255,0.08)' }}
      className="rounded-xl p-4 cursor-pointer relative overflow-hidden transition-all duration-300 backdrop-blur-md"
      style={{
        background: selected ? ri.bg : 'rgba(255,255,255,0.03)',
        border: `1px solid ${selected ? ri.color + '80' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: selected ? `0 0 20px 0px ${ri.glow}` : '0 4px 20px -2px rgba(0,0,0,0.2)',
      }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl border"
        style={{ borderColor: ri.color, boxShadow: `inset 0 0 20px ${ri.glow}` }}
        animate={prefersReducedMotion ? { opacity: selected ? 0.3 : 0.1 } : { opacity: [0.05, selected ? 0.4 : 0.15, 0.05] }}
        transition={{ duration: ri.pulseSeconds, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-lg"
        style={{ background: `linear-gradient(90deg,transparent,${ri.color},transparent)`, opacity: selected ? 1 : 0.5 }} />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-white text-[15px] font-bold tracking-wide">{s.label}</span>
          <span className="text-white/40 text-xs ml-1 font-mono uppercase tracking-widest">{s.location}</span>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ml-2 backdrop-blur-md"
          style={{ background: ri.bg, color: ri.color, borderColor: ri.border }}>
          <motion.span className="w-1.5 h-1.5 rounded-full block" style={{ background: ri.color }}
            animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: ri.pulseSeconds, repeat: Infinity }} />
          {ri.label}
        </span>
      </div>

      {/* Water level + sparkline */}
      <div className="flex items-end justify-between gap-2">
        <div>
          <motion.div
            key={s.waterLevel.toFixed(2)}
            initial={{ y: prevWl.current < s.waterLevel ? 5 : -5, opacity: 0.3 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-bold text-white leading-none"
          >
            {s.waterLevel.toFixed(2)}<span className="text-white/40 text-xs ml-0.5">m</span>
          </motion.div>
          <div className="text-white/40 text-[10px] mt-0.5">Water Level</div>
          <div className="text-white/25 text-[10px] mt-0.5">Updated {elapsed}</div>
        </div>
        <Sparkline values={s.sparkline} color={ri.color} />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   8. Map constants
──────────────────────────────────────────────────────────── */
const VW = 540, VH = 460;
const LABEL_MIN_DIST = 42; // px — if markers closer than this, use leader line

/* ─────────────────────────────────────────────────────────
   9. Label collision helper: offset text if too close
──────────────────────────────────────────────────────────── */
function computeLabelOffsets(stations: LiveStation[]): { lx: number; ly: number; leaderTo: { x: number; y: number } | null }[] {
  return stations.map((s, i) => {
    let lx = s.px + 14;
    let ly = s.py - 8;
    let leaderTo: { x: number; y: number } | null = null;

    for (let j = 0; j < stations.length; j++) {
      if (i === j) continue;
      const other = stations[j];
      const dx = s.px - other.px;
      const dy = s.py - other.py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < LABEL_MIN_DIST) {
        // Push label away from the other marker
        const angle = Math.atan2(dy, dx);
        const pushDist = 36 + (LABEL_MIN_DIST - dist);
        leaderTo = { x: s.px, y: s.py };
        lx = s.px + Math.cos(angle) * pushDist + 4;
        ly = s.py + Math.sin(angle) * pushDist;
      }
    }
    return { lx, ly, leaderTo };
  });
}

/* ─────────────────────────────────────────────────────────
   10. MapCanvas — d3-geo projection + rendering
──────────────────────────────────────────────────────────── */
function MapCanvas({ stations, selected, onSelect, zoom, onZoom }: {
  stations: LiveStation[];
  selected: string | null;
  onSelect: (id: string) => void;
  zoom: number;
  onZoom: (d: number) => void;
}) {
  const [pathD, setPathD] = useState('');

  // Recompute projection whenever zoom changes
  useEffect(() => {
    const padding = 24 / zoom;
    const w = VW - padding * 2;
    const h = VH - padding * 2;
    const proj = geoMercator().fitSize([w, h], BANGLADESH_GEOJSON);
    // Apply zoom scale around center
    const t = proj.translate();
    const sc = proj.scale();
    proj.scale(sc * zoom).translate([
      t[0] + (VW / 2 - t[0]) * (zoom - 1),
      t[1] + (VH / 2 - t[1]) * (zoom - 1),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pg = geoPath(proj as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setPathD(pg(BANGLADESH_GEOJSON as any) ?? '');

    // Update projected px/py on all stations
    stations.forEach(s => {
      const pt = proj([s.lon, s.lat]);
      if (pt) { s.px = pt[0]; s.py = pt[1]; }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, stations.length]);

  const labelOffsets = useMemo(() => computeLabelOffsets(stations), [stations]);

  return (
    <div className="relative w-full h-full rounded-2xl border border-white/5 bg-gradient-to-br from-[#0a1128]/95 to-[#030a18]/95 overflow-hidden shadow-2xl backdrop-blur-xl">

      {/* Grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        <defs>
          <pattern id="mapgrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M30 0L0 0 0 30" fill="none" stroke="rgba(0,194,255,0.035)" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapgrid)" />
      </svg>

      {/* Main SVG */}
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full h-full" style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="bdGrad" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(0,194,255,0.12)" />
            <stop offset="100%" stopColor="rgba(0,60,140,0.03)" />
          </radialGradient>
          {/* Glow filters per risk */}
          {['#22c55e','#eab308','#ef4444'].map(c => (
            <filter key={c} id={`mg${c.replace('#','')}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feFlood floodColor={c} floodOpacity="0.55" result="col" />
              <feComposite in="col" in2="blur" operator="in" result="glow" />
              <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          ))}
        </defs>

        {/* Bangladesh boundary — from Natural Earth, 2280 real vertices */}
        {pathD && (
          <g style={{ filter: 'drop-shadow(0 0 15px rgba(0,194,255,0.25)) drop-shadow(0 0 40px rgba(0,194,255,0.15))' }}>
            <path d={pathD} fill="url(#bdGrad)" stroke="rgba(0,194,255,0.7)" strokeWidth="1.5" strokeLinejoin="round" />
            <path d={pathD} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeLinejoin="round" />
            <path d={pathD} fill="none" stroke="rgba(0,194,255,0.1)" strokeWidth="8" strokeLinejoin="round" />
          </g>
        )}

        {/* Station markers */}
        {stations.map((s, idx) => {
          const ri = getRiskLevel(s.waterLevel, s.warningThreshold, s.dangerThreshold);
          const isSel = selected === s.id;
          const { lx, ly, leaderTo } = labelOffsets[idx] ?? { lx: s.px + 14, ly: s.py - 8, leaderTo: null };

          return (
            <g key={s.id} onClick={() => onSelect(s.id)} style={{ cursor: 'pointer' }}>
              {/* Radar Ping */}
              <motion.circle cx={s.px} cy={s.py}
                fill="none" stroke={ri.color} strokeWidth={1}
                initial={{ r: 5, opacity: 0.8 }}
                animate={{ r: isSel ? 45 : 35, opacity: 0 }}
                transition={{ duration: ri.pulseSeconds, repeat: Infinity, delay: idx * 0.3 }}
              />
              {/* Static Glow */}
              <circle cx={s.px} cy={s.py}
                r={isSel ? 18 : 14}
                fill={ri.color} opacity={0.15}
              />
              {/* Outer ring */}
              <circle cx={s.px} cy={s.py} r={isSel ? 11 : 8}
                fill="none" stroke={ri.color} strokeWidth={isSel ? 2 : 1.2} opacity={0.6} />
              {/* Core dot */}
              <circle cx={s.px} cy={s.py} r={5}
                fill={ri.color}
                filter={`url(#mg${ri.color.replace('#','')})`}
              />

              {/* Leader line if labels would collide */}
              {leaderTo && (
                <line
                  x1={leaderTo.x} y1={leaderTo.y}
                  x2={lx - 2} y2={ly}
                  stroke={ri.color} strokeWidth="0.7" strokeOpacity="0.5" strokeDasharray="2 2"
                />
              )}

              {/* Label pill */}
              <g transform={`translate(${lx}, ${ly})`}>
                <rect x="-3" y="-10" width={s.label.length * 5.5 + 8} height={leaderTo ? 22 : 22} rx="3"
                  fill="rgba(3,10,36,0.82)" />
                <text y="0" fill="white" fontSize="8" fontWeight="700" letterSpacing="0.4">{s.label}</text>
                <text y="10" fill="rgba(255,255,255,0.45)" fontSize="6.5">{s.location}</text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1">
        {[{ s: '+', d: 0.18 }, { s: '−', d: -0.18 }].map(({ s, d }) => (
          <button key={s} onClick={() => onZoom(d)}
            className="w-8 h-8 rounded-lg text-white/60 text-base font-bold flex items-center justify-center border border-white/10 hover:border-cyan-400/50 hover:text-cyan-400 transition-all"
            style={{ background: 'rgba(4,14,48,0.9)', backdropFilter: 'blur(6px)' }}>
            {s}
          </button>
        ))}
      </div>

      {/* Compass */}
      <div className="absolute bottom-3 right-3 z-20 w-9 h-9 rounded-xl border border-cyan-400/25 flex items-center justify-center"
        style={{ background: 'rgba(0,194,255,0.08)', backdropFilter: 'blur(6px)' }}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <circle cx="12" cy="12" r="9.5" stroke="rgba(0,194,255,0.3)" strokeWidth="1" />
          <polygon points="12,4 13.5,11 12,9.5 10.5,11" fill="#00c2ff" />
          <polygon points="12,20 13.5,13 12,14.5 10.5,13" fill="rgba(255,255,255,0.25)" />
          <line x1="12" y1="4" x2="12" y2="20" stroke="rgba(0,194,255,0.15)" strokeWidth="0.8" />
          <line x1="4" y1="12" x2="20" y2="12" stroke="rgba(0,194,255,0.15)" strokeWidth="0.8" />
        </svg>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-20 rounded-xl px-3.5 py-3 border border-white/8"
        style={{ background: 'rgba(4,10,38,0.90)', backdropFilter: 'blur(8px)' }}>
        <p className="text-white/50 text-[9px] font-semibold uppercase tracking-widest mb-2">Risk Levels</p>
        {[
          { label: 'Low Risk',  color: '#22c55e' },
          { label: 'Moderate', color: '#eab308' },
          { label: 'High Risk', color: '#ef4444' },
        ].map(r => (
          <div key={r.label} className="flex items-center gap-2 mb-1 last:mb-0">
            <span className="w-2 h-2 rounded-full" style={{ background: r.color, boxShadow: `0 0 5px ${r.color}` }} />
            <span className="text-white/55 text-[10px]">{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   11. Root component
──────────────────────────────────────────────────────────── */
const BangladeshMap = () => {
  const prefersReducedMotion = useReducedMotion();
  const { data: floodRisk } = useFloodRisk();
  const [selected, setSelected] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1.0);

  // Build initial station state using real coordinates + sensible initial water levels
  const [stations, setStations] = useState<LiveStation[]>(() =>
    STATIONS.map(cfg => {
      const live = floodRisk?.find(r => r.station_id === cfg.id);
      const wl = live?.predicted_water_level_m ?? (cfg.warningThreshold - 0.3 + Math.random() * 1.2);
      return {
        ...cfg,
        waterLevel: +wl.toFixed(3),
        sparkline: initSparkline(wl, cfg),
        updatedAt: new Date(),
        px: 0,
        py: 0,
      };
    })
  );

  // Sync from API when data arrives
  useEffect(() => {
    if (!floodRisk) return;
    setStations(prev => prev.map(s => {
      const live = floodRisk.find(r => r.station_id === s.id);
      if (!live?.predicted_water_level_m) return s;
      const wl = live.predicted_water_level_m;
      return { ...s, waterLevel: +wl.toFixed(3), sparkline: [...s.sparkline.slice(1), +wl.toFixed(3)], updatedAt: new Date() };
    }));
  }, [floodRisk]);

  // Live simulation every 8s — replace body with WebSocket handler to go fully real
  useEffect(() => {
    const id = setInterval(() => {
      setStations(prev => prev.map(s => {
        const ri = getRiskLevel(s.waterLevel, s.warningThreshold, s.dangerThreshold);
        const drift = ri.label === 'High Risk' ? -0.04 : ri.label === 'Moderate' ? 0.015 : -0.005;
        const delta = drift + (Math.random() - 0.5) * 0.16;
        const wl = +(s.waterLevel + delta).toFixed(3);
        return { ...s, waterLevel: wl, sparkline: [...s.sparkline.slice(1), wl], updatedAt: new Date() };
      }));
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const handleZoom = useCallback((d: number) => setZoom(z => Math.min(2.8, Math.max(0.6, z + d))), []);
  const toggleSelect = useCallback((id: string) => setSelected(p => p === id ? null : id), []);
  const sectionVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  };
  const itemVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.section
      id="map"
      className="section-rule py-16 lg:py-20 relative overflow-hidden"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      variants={sectionVariants}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(ellipse, rgba(0,194,255,0.8) 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div variants={itemVariants} className="mb-10">
          <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#00C2FF]/70">
            Signature element · Live data
          </p>
          <h2 className="font-display text-3xl font-bold text-white lg:text-4xl">
            Bangladesh Flood Risk Map
          </h2>
          <p className="mt-2 text-[15px] text-white/50">
            Three stations, live water levels, updating every 8 seconds. Risk colors — green, yellow, red — mean exactly what you think.
          </p>
        </motion.div>

        {/* Main panel */}
        <motion.div
          variants={itemVariants}
          className="panel-glow rounded-lg border border-white/10 overflow-hidden flex flex-col lg:flex-row"
          style={{ background: 'rgba(5,12,42,0.94)', backdropFilter: 'blur(16px)', minHeight: 420 }}
        >
          {/* Map */}
          <div className="relative flex-1 min-h-[320px] lg:min-h-0">
            <MapCanvas stations={stations} selected={selected} onSelect={toggleSelect} zoom={zoom} onZoom={handleZoom} />
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-white/8" />

          {/* Cards */}
          <div className="flex flex-col gap-3 p-4 lg:w-72 xl:w-80 justify-center" style={{ background: 'rgba(4,10,38,0.6)' }}>
            {stations.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: i * 0.07 }}>
                <StationCard s={s} selected={selected === s.id} onSelect={() => toggleSelect(s.id)} />
              </motion.div>
            ))}

            {/* Live dot */}
            <div className="flex items-center gap-2 px-1 mt-0.5">
              <motion.span className="w-1.5 h-1.5 rounded-full bg-cyan-400" animate={{ opacity: [1, 0.15, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
              <span className="text-white/35 text-[10px]">Live - auto-updates every 8 s</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default BangladeshMap;
