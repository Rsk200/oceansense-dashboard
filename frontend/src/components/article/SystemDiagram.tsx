import { motion } from 'framer-motion';

const helpers = [
  {
    badge: 'Helper 1',
    icon: '🌊',
    title: 'Watches the Ocean',
    description: 'Reads global sea surface temp, wind & pressure → predicts ENSO state',
    color: '#00C2FF',
    bg: 'rgba(0, 194, 255, 0.08)',
    border: 'rgba(0, 194, 255, 0.3)',
    output: 'ENSO Forecast',
    outputColor: '#00C2FF',
  },
  {
    badge: 'Helper 2',
    icon: '🌧️',
    title: 'Listens to the Rivers',
    description: 'Takes ENSO prediction + local rainfall & soil moisture → estimates river height',
    color: '#4FDBCC',
    bg: 'rgba(79, 219, 204, 0.08)',
    border: 'rgba(79, 219, 204, 0.3)',
    output: 'River Level Forecast',
    outputColor: '#4FDBCC',
  },
  {
    badge: 'Helper 3',
    icon: '🚨',
    title: 'Connects the Dots',
    description: 'Runs the full pipeline 12 months ahead. Raises a flood-risk flag the moment water crosses 22m.',
    color: '#F87171',
    bg: 'rgba(248, 113, 113, 0.09)',
    border: 'rgba(248, 113, 113, 0.35)',
    output: 'Flood Alert ⚠️',
    outputColor: '#F87171',
  },
];

export default function SystemDiagram() {
  return (
    <div className="w-full bg-[#041220] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            OceanSense Pipeline
          </span>
        </div>
        <span className="font-mono text-[10px] text-accent/60 font-bold">12-month lead</span>
      </div>

      <div className="p-4 flex flex-col gap-2">
        {helpers.map((h, i) => (
          <div key={i}>
            {/* Helper Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.45, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="rounded-xl overflow-hidden"
              style={{ border: `1px solid ${h.border}`, background: h.bg }}
            >
              {/* Top row */}
              <div className="px-4 pt-3.5 pb-2 flex items-start gap-3">
                <div className="text-2xl mt-0.5 shrink-0">{h.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ color: h.color, background: `${h.color}15`, border: `1px solid ${h.color}30` }}
                    >
                      {h.badge}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-white mb-1">{h.title}</div>
                  <p className="text-[11px] text-white/55 leading-snug">{h.description}</p>
                </div>
              </div>

              {/* Output chip */}
              <div className="px-4 pb-3 flex justify-end">
                <div
                  className="text-[10px] font-mono font-bold px-3 py-1 rounded-full"
                  style={{ color: h.outputColor, background: `${h.outputColor}15`, border: `1px solid ${h.outputColor}30` }}
                >
                  → {h.output}
                </div>
              </div>
            </motion.div>

            {/* Arrow between cards */}
            {i < helpers.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.3, duration: 0.3 }}
                className="flex items-center justify-center gap-2 py-1"
              >
                <div
                  className="h-px flex-1 ml-8"
                  style={{ background: `linear-gradient(to right, ${h.color}40, ${helpers[i + 1].color}40)` }}
                />
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider whitespace-nowrap">feeds into</span>
                </div>
                <div
                  className="h-px flex-1 mr-8"
                  style={{ background: `linear-gradient(to right, ${h.color}40, ${helpers[i + 1].color}40)` }}
                />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Threshold callout */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mx-4 mb-4 px-4 py-3 rounded-xl bg-danger/10 border border-danger/25 flex items-center gap-3"
      >
        <span className="text-lg shrink-0">⚠️</span>
        <div>
          <div className="text-xs font-bold text-danger mb-0.5">Danger Threshold</div>
          <div className="text-[11px] text-white/55 leading-snug">
            Water level ≥ <strong className="text-white/80">22 metres</strong> at Kurigram, Gaibandha, or Jamalpur triggers a flood-risk flag
          </div>
        </div>
      </motion.div>
    </div>
  );
}
