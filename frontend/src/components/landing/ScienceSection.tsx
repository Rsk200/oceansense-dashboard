/**
 * ScienceSection replaces ResearchHighlights + Capabilities.
 * Left column: "The Science" — 3 methodology cards with varying widths (asymmetric grid).
 * Right column: "What You Get" — 3 product capabilities in a vertical list with icons.
 */
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Activity, CloudRain, Globe2, LayoutDashboard, ShieldAlert, TrendingUp } from 'lucide-react';

const scienceItems = [
  {
    icon: Globe2,
    eyebrow: 'Step 01 · ENSO Signal',
    title: 'Pacific Ocean drives Bangladesh floods',
    body: 'El Niño–Southern Oscillation patterns emerge in the Pacific months before they alter Bangladesh monsoon rainfall. We ingest historical ONI and Niño 3.4 indices from 1980 onward to capture these signals before they arrive.',
    wide: true,
  },
  {
    icon: CloudRain,
    eyebrow: 'Step 02 · Local Climate',
    title: 'Ground-truth with local data',
    body: 'Rainfall anomalies, soil moisture, and river discharge observations from three Brahmaputra basin stations anchor the global signal in local hydrological reality.',
    wide: false,
  },
  {
    icon: TrendingUp,
    eyebrow: 'Step 03 · Hybrid Model',
    title: 'XGBoost + LSTM ensemble',
    body: 'A hybrid model combines XGBoost feature importance with LSTM sequence learning — matching the pattern of how ENSO signals slowly translate into water level change over weeks and months.',
    wide: false,
  },
];

const productItems = [
  {
    icon: ShieldAlert,
    title: 'Months-ahead flood alerts',
    body: 'Get risk classifications — Low, Moderate, High — up to 12 months before peak monsoon, giving officials time to pre-position resources.',
    iconColor: '#EA4343',
  },
  {
    icon: Activity,
    title: 'Live station monitoring',
    body: 'Real-time water level readouts from Jamalpur, Gaibandha, and Kurigram, updated every 8 seconds with trend indicators.',
    iconColor: '#00C2FF',
  },
  {
    icon: LayoutDashboard,
    title: 'Actionable community advisories',
    body: 'Plain-language guidance for disaster response officials and community leaders — not just a number, but what to do with it.',
    iconColor: '#E8B208',
  },
];

const ScienceSection = () => {
  const prefersReducedMotion = useReducedMotion();
  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.1 } },
  };
  const itemVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section id="research" className="section-rule relative py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? 'show' : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px] lg:gap-16"
        >
          {/* Left — The Science */}
          <motion.div variants={itemVariants}>
            <div className="mb-8">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00C2FF]/70">
                The Science
              </p>
              <h2 className="font-display text-3xl font-bold text-white lg:text-4xl">
                Why ENSO predicts<br className="hidden lg:block" /> Bangladesh floods
              </h2>
            </div>

            {/* Asymmetric card grid — wide + narrow */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {scienceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className={`group relative overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-b from-[#08214A]/80 to-[#041C3E]/60 p-5 transition-all duration-300 hover:border-[#0072A2]/50 hover:shadow-[0_8px_40px_rgba(0,114,162,0.15)] ${item.wide ? 'sm:col-span-2' : ''}`}
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00C2FF]/20 to-transparent" />
                    <div className="mb-3 flex items-center gap-2">
                      <Icon className="h-4 w-4 text-[#00C2FF]/60" />
                      <span className="font-mono text-[10px] font-medium tracking-widest text-white/30 uppercase">
                        {item.eyebrow}
                      </span>
                    </div>
                    <h3 className="mb-2 font-display text-base font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-6 text-white/50">{item.body}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right — What You Get */}
          <motion.div variants={itemVariants}>
            <div className="mb-8">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00C2FF]/70">
                What You Get
              </p>
              <h2 className="font-display text-3xl font-bold text-white lg:text-4xl">
                Built for flood response, not for show
              </h2>
            </div>

            {/* Vertical list — structurally different from left grid */}
            <div className="flex flex-col gap-0">
              {productItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className={`group flex gap-4 py-5 ${i > 0 ? 'border-t border-white/[0.07]' : ''}`}
                  >
                    <div
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${item.iconColor}18` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: item.iconColor }} />
                    </div>
                    <div>
                      <h3 className="mb-1 font-display text-[15px] font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-6 text-white/50">{item.body}</p>
                    </div>
                  </div>
                );
              })}

              {/* Accuracy callout — the number that matters most */}
              <div className="mt-4 overflow-hidden rounded-xl border border-[#0072A2]/40 bg-[#041C3E]">
                <div className="border-b border-white/[0.07] px-4 py-2">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#00C2FF]/60">
                    Validation · 2020–2024 holdout
                  </p>
                </div>
                <div className="flex items-center gap-6 px-4 py-4">
                  <div>
                    <div className="font-display text-4xl font-bold text-white tabular-nums">87%</div>
                    <div className="mt-0.5 text-xs text-white/40">Prediction accuracy</div>
                  </div>
                  <div className="border-l border-white/10 pl-6">
                    <div className="font-display text-4xl font-bold text-white tabular-nums">3 mo</div>
                    <div className="mt-0.5 text-xs text-white/40">Advance warning</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ScienceSection;
