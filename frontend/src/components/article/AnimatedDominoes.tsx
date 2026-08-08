import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    label: 'ENSO Shift',
    description: 'Pacific Ocean warms or cools',
    color: '#00C2FF',
    glow: 'rgba(0, 194, 255, 0.3)',
    icon: '🌊',
  },
  {
    number: '02',
    label: 'Wind & Pressure',
    description: 'Atmospheric patterns shift across Asia',
    color: '#4FDBCC',
    glow: 'rgba(79, 219, 204, 0.3)',
    icon: '💨',
  },
  {
    number: '03',
    label: 'Rainfall',
    description: 'Monsoon intensity changes over the Himalayas',
    color: '#7B8FFF',
    glow: 'rgba(123, 143, 255, 0.3)',
    icon: '🌧️',
  },
  {
    number: '04',
    label: 'River Flood',
    description: 'Brahmaputra rises in Bangladesh',
    color: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.3)',
    icon: '🏔️',
  },
];

export default function AnimatedDominoes() {
  return (
    <div className="w-full bg-[#041E42] rounded-2xl border border-white/10 shadow-2xl p-6 md:p-8 relative overflow-hidden">
      {/* BG Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,194,255,0.08),transparent_60%)] pointer-events-none" />

      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-6 font-bold">Chain Reaction</p>

      <div className="flex flex-col gap-0">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col">
            {/* Step Card */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-center gap-4 group"
            >
              {/* Left: Number + connector */}
              <div className="flex flex-col items-center shrink-0 w-10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: i * 0.15 + 0.1 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold border-2 transition-all duration-300 group-hover:scale-110 shrink-0"
                  style={{
                    borderColor: step.color,
                    color: step.color,
                    boxShadow: `0 0 16px ${step.glow}`,
                    backgroundColor: `${step.glow}`,
                  }}
                >
                  {step.number}
                </motion.div>
              </div>

              {/* Right: Card */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 + 0.2 }}
                className="flex-1 rounded-xl px-4 py-3 border transition-all duration-300 group-hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)`,
                  borderColor: `${step.color}30`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{step.icon}</span>
                  <div>
                    <div className="font-bold text-sm text-white leading-none mb-1">{step.label}</div>
                    <div className="text-xs text-white/50 leading-snug">{step.description}</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Connector Arrow */}
            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                whileInView={{ opacity: 1, scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.15 + 0.35 }}
                className="flex flex-col items-center origin-top ml-5 py-1"
              >
                <div className="w-px h-5 bg-gradient-to-b from-white/20 to-white/5" />
                <svg width="10" height="6" viewBox="0 0 10 6" className="opacity-40">
                  <path d="M0 0 L5 6 L10 0" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom tag */}
      <div className="mt-6 pt-5 border-t border-white/5 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">8,000 km connection</span>
      </div>
    </div>
  );
}
