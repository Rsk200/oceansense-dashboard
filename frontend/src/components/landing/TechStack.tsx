/**
 * TechStack — explicit responsive grid (2 cols mobile → 3 cols sm → 5 cols lg → 10 cols xl)
 * Brand colors preserved per spec.
 */
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { SiFastapi, SiReact, SiTypescript, SiPytorch, SiSqlalchemy, SiLeaflet, SiRedis, SiTailwindcss } from 'react-icons/si';
import { Network, Brain } from 'lucide-react';

const technologies = [
  { name: 'FastAPI', category: 'Backend', color: '#009688', icon: SiFastapi },
  { name: 'React', category: 'Frontend', color: '#61DAFB', icon: SiReact },
  { name: 'TypeScript', category: 'Language', color: '#3178C6', icon: SiTypescript },
  { name: 'XGBoost', category: 'ML Model', color: '#06b6d4', icon: Network },
  { name: 'PyTorch', category: 'Deep Learning', color: '#EE4C2C', icon: SiPytorch },
  { name: 'SQLAlchemy', category: 'Database', color: '#D71F00', icon: SiSqlalchemy },
  { name: 'Leaflet', category: 'Maps', color: '#199900', icon: SiLeaflet },
  { name: 'Redis', category: 'Caching', color: '#DC382D', icon: SiRedis },
  { name: 'Tailwind', category: 'Styling', color: '#06B6D4', icon: SiTailwindcss },
  { name: 'LSTM', category: 'Forecasting', color: '#a78bfa', icon: Brain },
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
              className="group flex flex-col items-center gap-2.5 rounded-xl border border-white/[0.07] bg-[#041C3E]/50 p-3 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#0072A2]/40 hover:bg-[#041C3E]/80 hover:shadow-lg focus-within:border-[#00C2FF]/50"
              tabIndex={0}
            >
              {/* Logo badge in brand color */}
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                style={{ background: `${tech.color}15`, color: tech.color, boxShadow: `0 4px 20px ${tech.color}00` }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 4px 20px ${tech.color}40`)}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 4px 20px ${tech.color}00`)}
              >
                <tech.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white tracking-wide drop-shadow-sm">{tech.name}</div>
                <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-white/40 group-hover:text-white/60 transition-colors">
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
