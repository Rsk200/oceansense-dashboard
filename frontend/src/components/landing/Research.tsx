import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { BookOpen, Cpu, Database, Goal, Radar, TrendingUp } from 'lucide-react';

const sections = [
  {
    icon: BookOpen,
    title: 'Problem Statement',
    content: 'Bangladesh faces severe flooding risks due to unique geographical location and climate patterns. Traditional methods lack accuracy and lead time.',
  },
  {
    icon: Radar,
    title: 'Methodology',
    content: 'Global ENSO prediction is combined with local discharge and climate features using XGBoost and LSTM for improved water level forecasting.',
  },
  {
    icon: Database,
    title: 'Datasets',
    content: 'Historical climate data from 1980 onward, including ENSO indices, water levels, and weather observations from multiple sources.',
  },
  {
    icon: Cpu,
    title: 'AI Models',
    content: 'An ensemble of machine learning models supports feature importance, sequence learning, and temporal pattern recognition.',
  },
  {
    icon: TrendingUp,
    title: 'Results',
    content: 'Improved flood prediction accuracy with advance warning capability for more effective community preparation.',
  },
  {
    icon: Goal,
    title: 'Future Scope',
    content: 'Real-time satellite data, additional river systems, and mobile alerts can extend the platform for wider impact.',
  },
];

const Research = () => {
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
      id="research-section"
      className="section-rule relative py-14"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      variants={sectionVariants}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={itemVariants}
          className="mb-8 text-center"
        >
          <div className="mb-2 flex items-center justify-center gap-4">
            <span className="h-px w-14 bg-gradient-to-r from-transparent to-accent/70" />
            <h2 className="text-2xl font-black text-white">Research</h2>
            <span className="h-px w-14 bg-gradient-to-l from-transparent to-accent/70" />
          </div>
          <p className="text-sm text-white/55">Comprehensive approach to flood early warning systems</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 gap-3 lg:grid-cols-2" variants={gridVariants}>
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                variants={itemVariants}
                className="panel-glow flex gap-4 rounded-lg border border-white/10 bg-white/[0.055] p-4 transition-all duration-300 hover:bg-white/[0.085]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/12">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="mb-1.5 text-sm font-black text-white">{section.title}</h3>
                  <p className="text-xs leading-5 text-white/58">{section.content}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Research;
