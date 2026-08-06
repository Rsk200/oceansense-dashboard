import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { AlertTriangle, BrainCircuit, DatabaseZap, Globe, Sprout, Users, Waves } from 'lucide-react';

const pipelineSteps = [
  { icon: Globe, title: 'Global Climate Data', description: 'Historical ENSO indices and climate patterns.', color: '#38bdf8' },
  { icon: Sprout, title: 'Local Climate Factors', description: 'Rainfall, soil moisture, and station variables.', color: '#22c55e' },
  { icon: AlertTriangle, title: 'Flood Risk Analysis', description: 'Risk classification and threshold analysis.', color: '#f59e0b' },
  { icon: BrainCircuit, title: 'ENSO Prediction', description: 'Machine learning-based ENSO forecasting.', color: '#d946ef' },
  { icon: Waves, title: 'Water Level Forecast', description: 'Hybrid XGBoost and LSTM model predictions.', color: '#06b6d4' },
  { icon: Users, title: 'Community Advisory', description: 'Actionable guidance for officials and communities.', color: '#facc15' },
];

const AIPipeline = () => {
  const prefersReducedMotion = useReducedMotion();
  const sectionVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  };
  const gridVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.09 } },
  };
  const itemVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.section
      id="pipeline"
      className="section-rule relative overflow-hidden py-14"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      variants={sectionVariants}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="absolute inset-0 ocean-grid opacity-40" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={itemVariants}
          className="mb-9 text-center"
        >
          <div className="mb-2 flex items-center justify-center gap-4">
            <span className="h-px w-14 bg-gradient-to-r from-transparent to-accent/70" />
            <h2 className="text-2xl font-black text-white">AI Pipeline</h2>
            <span className="h-px w-14 bg-gradient-to-l from-transparent to-accent/70" />
          </div>
          <p className="text-sm text-white/55">From global climate data to community action</p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[8%] right-[8%] top-[46px] hidden h-px bg-gradient-to-r from-cyan-400/30 via-emerald-300/30 to-amber-300/30 xl:block" />

          <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" variants={gridVariants}>
            {pipelineSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  variants={itemVariants}
                  className="relative"
                >
                  <div className="panel-glow group relative h-full min-h-[168px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] p-4 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-sky-400/55 hover:bg-white/[0.095] hover:shadow-[0_20px_70px_rgba(56,189,248,0.16)]"
                    style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 rgba(0,0,0,0)` }}
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-0.5 opacity-80"
                      style={{ background: `linear-gradient(90deg, transparent, ${step.color}, transparent)` }}
                    />
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-200 ease-out group-hover:scale-[1.04] group-hover:shadow-[0_0_34px_rgba(56,189,248,0.32)]"
                      style={{ background: `${step.color}22`, boxShadow: `0 0 26px ${step.color}22` }}
                    >
                      <Icon className="h-6 w-6 transition-transform duration-200 ease-out group-hover:scale-[1.08]" style={{ color: step.color }} />
                    </div>
                    <div className="mb-2 text-[10px] font-black text-white/30">0{index + 1}</div>
                    <h3 className="mb-2 text-sm font-black text-white">{step.title}</h3>
                    <p className="text-xs leading-5 text-white/55">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="mx-auto mt-8 flex max-w-3xl flex-col items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/[0.045] px-5 py-4 text-center sm:flex-row sm:text-left"
        >
          <DatabaseZap className="h-6 w-6 shrink-0 text-accent" />
          <p className="text-sm leading-6 text-white/62">
            The pipeline connects climate ingestion, model inference, station risk analysis, and advisory output without changing the dashboard data contracts.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AIPipeline;
