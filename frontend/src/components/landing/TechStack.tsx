import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Bot, Braces, Brain, ChartLine, Database, Flame, Layers3, Map, Server, Wind } from 'lucide-react';

const technologies = [
  { icon: Server, name: 'FastAPI', category: 'Backend', color: '#14b8a6' },
  { icon: Braces, name: 'React', category: 'Frontend', color: '#38bdf8' },
  { icon: Layers3, name: 'TypeScript', category: 'Language', color: '#60a5fa' },
  { icon: ChartLine, name: 'XGBoost', category: 'ML', color: '#06b6d4' },
  { icon: Brain, name: 'PyTorch', category: 'Deep Learning', color: '#f97316' },
  { icon: Database, name: 'SQLAlchemy', category: 'Database', color: '#f87171' },
  { icon: Map, name: 'Leaflet', category: 'Maps', color: '#84cc16' },
  { icon: Flame, name: 'Redis', category: 'Caching', color: '#ef4444' },
  { icon: Wind, name: 'Tailwind CSS', category: 'Styling', color: '#22d3ee' },
  { icon: Bot, name: 'LSTM', category: 'Forecasting', color: '#a78bfa' },
];

const TechStack = () => {
  const prefersReducedMotion = useReducedMotion();
  const sectionVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  };
  const gridVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.08 } },
  };
  const itemVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.section
      id="tech"
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
            <h2 className="text-2xl font-black text-white">Technology Stack</h2>
            <span className="h-px w-14 bg-gradient-to-l from-transparent to-accent/70" />
          </div>
          <p className="text-sm text-white/55">Built with modern technologies for performance and reliability</p>
        </motion.div>

        <motion.div className="grid grid-cols-2 gap-3 md:grid-cols-5 lg:grid-cols-10" variants={gridVariants}>
          {technologies.map((tech) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                variants={itemVariants}
                className="panel-glow rounded-lg border border-white/10 bg-white/[0.055] p-3 text-center transition-all duration-200 ease-out hover:-translate-y-1 hover:border-sky-400/55 hover:bg-white/[0.09] hover:shadow-[0_20px_70px_rgba(56,189,248,0.16)]"
              >
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-md" style={{ background: `${tech.color}22` }}>
                  <Icon className="h-4 w-4" style={{ color: tech.color }} />
                </div>
                <div className="text-xs font-black text-white">{tech.name}</div>
                <div className="mt-1 text-[10px] text-white/45">{tech.category}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TechStack;
