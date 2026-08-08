import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    emoji: '🌊',
    title: 'Pacific Ocean',
    subtitle: 'ENSO Shift',
    detail: 'Sea surface temperature rises (El Niño) or falls (La Niña)',
    color: '#00C2FF',
    bg: 'rgba(0, 194, 255, 0.08)',
    border: 'rgba(0, 194, 255, 0.25)',
  },
  {
    number: '02',
    emoji: '🌬️',
    title: 'Atmosphere',
    subtitle: 'Wind & Pressure',
    detail: 'Walker Circulation weakens — jet streams shift across Asia',
    color: '#4FDBCC',
    bg: 'rgba(79, 219, 204, 0.08)',
    border: 'rgba(79, 219, 204, 0.25)',
  },
  {
    number: '03',
    emoji: '⛈️',
    title: 'Himalayas',
    subtitle: 'Monsoon Rainfall',
    detail: 'Heavy or weak rainfall fills the Brahmaputra basin',
    color: '#A78BFA',
    bg: 'rgba(167, 139, 250, 0.08)',
    border: 'rgba(167, 139, 250, 0.25)',
  },
  {
    number: '04',
    emoji: '🌊',
    title: 'Bangladesh',
    subtitle: 'River Floods',
    detail: 'Water level crosses 22m — 18 million people at risk',
    color: '#F87171',
    bg: 'rgba(248, 113, 113, 0.08)',
    border: 'rgba(248, 113, 113, 0.35)',
  },
];

export default function AnimatedDominoes() {
  return (
    <div className="w-full bg-[#041220] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2 bg-white/[0.02]">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
          Chain Reaction · 8,000 km
        </span>
      </div>

      {/* Steps */}
      <div className="p-4 flex flex-col gap-2">
        {steps.map((step, i) => (
          <div key={i}>
            {/* Step card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{
                duration: 0.5,
                delay: i * 0.12,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="rounded-xl p-3.5 flex items-center gap-3.5 group transition-all duration-300 cursor-default"
              style={{ background: step.bg, border: `1px solid ${step.border}` }}
            >
              {/* Number badge */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{
                  color: step.color,
                  background: `${step.color}15`,
                  border: `1px solid ${step.color}40`,
                  boxShadow: `0 0 12px ${step.color}25`,
                }}
              >
                {step.number}
              </div>

              {/* Emoji */}
              <div className="text-2xl shrink-0">{step.emoji}</div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span
                    className="font-bold text-sm leading-none"
                    style={{ color: step.color }}
                  >
                    {step.subtitle}
                  </span>
                  <span className="text-white/30 text-[10px] font-mono uppercase tracking-wider">
                    {step.title}
                  </span>
                </div>
                <p className="text-[11px] text-white/55 mt-1 leading-snug">{step.detail}</p>
              </div>
            </motion.div>

            {/* Animated Arrow Connector */}
            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                whileInView={{ opacity: 1, scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.12 + 0.3, ease: 'easeOut' }}
                className="origin-top flex flex-col items-center py-0.5 ml-[1.375rem]"
              >
                {/* Vertical line */}
                <div
                  className="w-px h-5"
                  style={{
                    background: `linear-gradient(to bottom, ${steps[i].color}60, ${steps[i + 1].color}40)`,
                  }}
                />
                {/* Arrowhead */}
                <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
                  <path
                    d="M0 0 L4 5 L8 0"
                    stroke={steps[i + 1].color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.6"
                  />
                </svg>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
        <span className="font-mono text-[9px] text-white/25 uppercase tracking-wider">
          Source: Mohsin et al., 2025
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-white/30 font-mono uppercase tracking-wider">Lead time</span>
          <span className="text-xs font-bold text-accent font-mono">12 months</span>
        </div>
      </div>
    </div>
  );
}
