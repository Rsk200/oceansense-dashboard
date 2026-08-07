/**
 * TechStack — explicit responsive grid (2 cols mobile → 3 cols sm → 5 cols lg → 10 cols xl)
 * Brand colors preserved per spec.
 */
import { motion, useReducedMotion, type Variants } from 'framer-motion';

const technologies = [
  { name: 'FastAPI', category: 'Backend', color: '#14b8a6', initial: 'FA' },
  { name: 'React', category: 'Frontend', color: '#38bdf8', initial: 'Re' },
  { name: 'TypeScript', category: 'Language', color: '#60a5fa', initial: 'TS' },
  { name: 'XGBoost', category: 'ML Model', color: '#06b6d4', initial: 'XG' },
  { name: 'PyTorch', category: 'Deep Learning', color: '#f97316', initial: 'PT' },
  { name: 'SQLAlchemy', category: 'Database', color: '#f87171', initial: 'SA' },
  { name: 'Leaflet', category: 'Maps', color: '#84cc16', initial: 'LF' },
  { name: 'Redis', category: 'Caching', color: '#ef4444', initial: 'RS' },
  { name: 'Tailwind', category: 'Styling', color: '#22d3ee', initial: 'TW' },
  { name: 'LSTM', category: 'Forecasting', color: '#a78bfa', initial: 'LS' },
];

const TechStack = () => {
  const prefersReducedMotion = useReducedMotion();
  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.06 } },
  };
  const itemVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section id="tech" className="section-rule relative py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header — compact, not centered */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-1 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#00C2FF]/70">
              Built with
            </p>
            <h2 className="font-display text-2xl font-bold text-white lg:text-3xl">Technology Stack</h2>
          </div>
          <p className="text-sm text-white/40 sm:text-right">
            Production-grade infrastructure,<br className="hidden sm:block" /> open-source throughout.
          </p>
        </motion.div>

        {/* Explicit 2→3→5→10 grid — no accidental flex-wrap */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={containerVariants}
          className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10"
        >
          {technologies.map((tech) => (
            <motion.div
              key={tech.name}
              variants={itemVariants}
              className="group flex flex-col items-center gap-2 rounded-xl border border-white/[0.07] bg-[#041C3E]/50 p-3 text-center transition-all duration-200 hover:border-[#0072A2]/40 hover:bg-[#041C3E]/80 focus-within:border-[#00C2FF]/50"
              tabIndex={0}
            >
              {/* Monogram badge in brand color */}
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-xs font-bold transition-transform duration-200 group-hover:scale-105"
                style={{ background: `${tech.color}18`, color: tech.color }}
              >
                {tech.initial}
              </div>
              <div>
                <div className="text-[11px] font-semibold text-white">{tech.name}</div>
                <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wide text-white/30">
                  {tech.category}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
