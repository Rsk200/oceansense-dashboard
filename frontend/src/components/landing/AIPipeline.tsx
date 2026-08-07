/**
 * AIPipeline — redesigned with a strong visual connector line,
 * numbered steps, and user-facing copy (no engineering jargon).
 */
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { AlertTriangle, BrainCircuit, Globe2, Leaf, MessageSquareWarning, Waves } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: Globe2,
    title: 'Pacific Ocean Data',
    body: 'Niño 3.4 and ONI indices captured from global climate archives — the same signals NOAA uses to declare El Niño events.',
    color: '#38bdf8',
  },
  {
    num: '02',
    icon: Leaf,
    title: 'Local Environment',
    body: 'Monsoon rainfall, soil moisture, and river discharge observations from stations across the Brahmaputra basin.',
    color: '#22c55e',
  },
  {
    num: '03',
    icon: BrainCircuit,
    title: 'ENSO Forecast',
    body: 'A machine learning model predicts future ENSO conditions — months before they influence Bangladesh rainfall.',
    color: '#a78bfa',
  },
  {
    num: '04',
    icon: Waves,
    title: 'Water Level Forecast',
    body: 'An XGBoost + LSTM hybrid translates ENSO signals into station-level water level predictions with confidence bands.',
    color: '#06b6d4',
  },
  {
    num: '05',
    icon: AlertTriangle,
    title: 'Risk Classification',
    body: `Each station's predicted level is compared against validated flood thresholds — assigned Low, Moderate, or High risk.`,
    color: '#E8B208',
  },
  {
    num: '06',
    icon: MessageSquareWarning,
    title: 'Community Advisory',
    body: 'Plain-language guidance reaches officials and communities in time to mobilize resources before waters rise.',
    color: '#f97316',
  },
];

const AIPipeline = () => {
  const prefersReducedMotion = useReducedMotion();
  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.08 } },
  };
  const itemVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
  };

  return (
    <section id="pipeline" className="section-rule relative overflow-hidden py-16 lg:py-20">
      <div className="absolute inset-0 ocean-grid opacity-30" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mb-12 max-w-xl"
        >
          <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#00C2FF]/70">
            How it works
          </p>
          <h2 className="font-display text-3xl font-bold text-white lg:text-4xl">
            From Pacific signal to community action
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-white/50">
            Six steps — climate data in, actionable flood warnings out. Each step you see on screen corresponds directly to a decision a disaster-response official can act on.
          </p>
        </motion.div>

        {/* Pipeline steps */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={containerVariants}
          className="relative"
        >
          {/* Desktop connector line */}
          <div
            className="absolute left-[calc(8.333%+28px)] right-[calc(8.333%+28px)] top-[44px] hidden h-px xl:block"
            style={{
              background:
                'linear-gradient(90deg, #38bdf830, #22c55e30, #a78bfa30, #06b6d430, #E8B20830, #f9731630)',
            }}
            aria-hidden
          >
            {/* Arrow heads along line */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${i * (100 / 5)}%` }}
              >
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
                  <path d="M0 4h8M5 1l3 3-3 3" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.num} variants={itemVariants} className="relative xl:flex xl:flex-col xl:items-center">
                  {/* Step card */}
                  <div
                    className="group relative h-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#041C3E]/70 p-4 transition-all duration-200 hover:border-[#0072A2]/50 hover:shadow-[0_12px_48px_rgba(0,114,162,0.18)]"
                  >
                    {/* Color top line */}
                    <div
                      className="absolute inset-x-0 top-0 h-0.5"
                      style={{ background: `linear-gradient(90deg, transparent, ${step.color}80, transparent)` }}
                    />
                    {/* Number + Icon row */}
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: `${step.color}18` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: step.color }} />
                      </div>
                      <span className="font-mono text-xl font-semibold tabular-nums text-white/12">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="mb-2 font-display text-[14px] font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="text-xs leading-5 text-white/48">{step.body}</p>
                  </div>

                  {/* Mobile vertical connector (between cards on small screens) */}
                  <div className="mx-auto h-4 w-px bg-white/10 xl:hidden" aria-hidden />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* User-facing note — no engineering jargon */}
        <motion.p
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 text-center font-mono text-xs text-white/28 tabular-nums"
        >
          Data refreshes every 8 s · Forecasts generated on demand · Risk thresholds validated against 2000–2024 historical floods
        </motion.p>
      </div>
    </section>
  );
};

export default AIPipeline;
