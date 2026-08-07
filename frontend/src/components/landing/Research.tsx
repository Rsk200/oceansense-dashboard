/**
 * Research section — keeps the left-icon/wide-card layout (already the unique shell).
 * Results stat pulled out into a large callout per the spec.
 */
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { BookOpen, Cpu, Database, Goal, Radar } from 'lucide-react';

const sections = [
  {
    icon: BookOpen,
    title: 'Problem Statement',
    content:
      `Bangladesh is among the world's most flood-vulnerable nations — the Brahmaputra and Jamuna flood annually, but the timing and severity are hard to predict with traditional hydrology alone. Communities need weeks, not hours.`,
  },
  {
    icon: Radar,
    title: 'Methodology',
    content:
      'We combine global ENSO prediction (machine learning on ONI/Niño 3.4 indices) with local discharge and climate features in a hybrid XGBoost + LSTM pipeline, producing water level forecasts with confidence intervals for three key monitoring stations.',
  },
  {
    icon: Database,
    title: 'Datasets',
    content:
      'Climate observations from 1980 onward — ENSO indices, satellite-era rainfall, soil moisture, river gauge records — preprocessed and aligned at monthly resolution for training and monthly-to-annual validation.',
  },
  {
    icon: Cpu,
    title: 'AI Models',
    content:
      'XGBoost captures nonlinear feature interactions; LSTM learns the lagged temporal patterns between Pacific Ocean anomalies and Brahmaputra water levels. An ensemble blends both for final predictions.',
  },
  {
    icon: Goal,
    title: 'Future Scope',
    content:
      'Real-time satellite soil-moisture assimilation, SMS-based community alert delivery, expansion to the Meghna and Ganges basins, and open-data publication of model weights and validation datasets.',
  },
];

const Research = () => {
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
    <section id="research-section" className="section-rule relative py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="mb-10 max-w-2xl"
        >
          <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#00C2FF]/70">
            Research
          </p>
          <h2 className="font-display text-3xl font-bold text-white lg:text-4xl">
            The methodology behind the system
          </h2>
        </motion.div>

        {/* Validated accuracy — large stat callout, before the detail cards */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-8 overflow-hidden rounded-2xl border border-[#0072A2]/40 bg-gradient-to-r from-[#041C3E] to-[#08214A]"
        >
          <div className="grid grid-cols-1 gap-0 divide-y divide-white/[0.07] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="px-8 py-7">
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/35 tabular-nums">
                Prediction accuracy
              </div>
              <div className="mt-2 font-display text-5xl font-bold text-white tabular-nums">
                87<span className="text-[#00C2FF]">%</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-white/45">
                On 2020–2024 holdout test set — months not seen during training.
              </p>
            </div>
            <div className="px-8 py-7">
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/35">
                Advance warning
              </div>
              <div className="mt-2 font-display text-5xl font-bold text-white tabular-nums">
                3<span className="font-sans text-2xl text-[#00C2FF]"> mo</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-white/45">
                Reliable flood-risk classification 3 months before peak monsoon arrival.
              </p>
            </div>
            <div className="px-8 py-7">
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/35">
                Horizon
              </div>
              <div className="mt-2 font-display text-5xl font-bold text-white tabular-nums">
                12<span className="font-sans text-2xl text-[#00C2FF]"> mo</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-white/45">
                Full annual forecast cycle — one model run covers the entire monsoon season.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Detail cards — left-icon shell (the only section using this layout) */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-3 lg:grid-cols-2"
        >
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                variants={itemVariants}
                className="flex gap-4 rounded-xl border border-white/[0.08] bg-[#041C3E]/60 p-5 transition-all duration-200 hover:border-[#0072A2]/40 hover:bg-[#08214A]/70"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-[#00C2FF]/8">
                  <Icon className="h-5 w-5 text-[#00C2FF]/70" />
                </div>
                <div>
                  <h3 className="mb-1.5 font-display text-[14px] font-semibold text-white">
                    {section.title}
                  </h3>
                  <p className="text-[13px] leading-6 text-white/50">{section.content}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Research;
