import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Database, MapPin, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import GlobeAnimation from './GlobeAnimation';
import { useCountUp } from '../../hooks/useCountUp';

const stats = [
  { icon: CalendarDays, label: 'Data Period', type: 'range', start: 1980, end: 2024, detail: 'Global climate data' },
  { icon: MapPin, label: 'Focus Region', type: 'region', count: 1, value: 'Bangladesh', detail: 'Brahmaputra basin' },
  { icon: Database, label: 'Models', type: 'single', end: 12, suffix: '+', detail: 'AI/ML models' },
] as const;

const StatCard = ({ stat, index }: { stat: (typeof stats)[number]; index: number }) => {
  const firstTarget = stat.type === 'range' ? stat.start : stat.type === 'region' ? stat.count : stat.end;
  const secondTarget = stat.type === 'range' ? stat.end : stat.type === 'region' ? stat.count : stat.end;
  const first = useCountUp(firstTarget);
  const second = useCountUp(secondTarget);
  const Icon = stat.icon;

  const displayValue =
    stat.type === 'range'
      ? `${first.value}-${second.value}`
      : stat.type === 'region'
        ? first.value >= 1 ? stat.value : '0'
        : `${second.value}${'suffix' in stat ? stat.suffix : ''}`;

  return (
    <motion.div
      ref={(node) => {
        first.ref.current = node;
        second.ref.current = node;
      }}
      key={stat.label}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 + index * 0.08 }}
      className="panel-glow rounded-lg border border-white/10 bg-white/[0.055] p-4 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-sky-400/55 hover:shadow-[0_20px_70px_rgba(56,189,248,0.14)]"
    >
      <Icon className="mb-3 h-5 w-5 text-accent" />
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">{stat.label}</div>
      <div className="mt-1 text-lg font-black text-white">{displayValue}</div>
      <div className="text-xs text-white/52">{stat.detail}</div>
    </motion.div>
  );
};

const Hero = () => {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const globeY = useTransform(scrollY, [0, 720], [0, prefersReducedMotion ? 0 : 190]);

  return (
    <section id="home" className="relative min-h-[720px] overflow-hidden pt-24 lg:pt-28">
      <div className="absolute inset-0 ocean-grid opacity-80" />
      <div className="absolute inset-x-0 top-16 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
      <div className="absolute -top-20 right-0 h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[620px] grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300 shadow-[0_0_28px_rgba(0,210,106,0.12)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(0,210,106,0.8)]" />
              AI for Climate - Bangladesh
            </div>

            <h1 className="text-5xl font-black leading-[0.96] tracking-normal text-white sm:text-6xl lg:text-7xl">
              Ocean<span className="text-gradient">Sense</span>
            </h1>
            <p className="mt-5 text-2xl font-medium text-white/86 sm:text-3xl">
              AI-Powered ENSO Early Flood Prediction
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/64">
              Advanced AI and machine learning models for accurate flood risk assessment and early warning in Bangladesh.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/dashboard/overview">
                <Button size="lg" className="w-full rounded-md text-sm font-bold sm:w-auto">
                  Launch Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="/#research" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full rounded-md text-sm font-bold sm:w-auto">
                  View Research
                </Button>
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.map((stat, index) => <StatCard key={stat.label} stat={stat} index={index} />)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative mx-auto w-full max-w-[650px]"
            style={{ y: globeY }}
          >
            <GlobeAnimation />
            {[
              { label: 'Early Warning', className: 'right-4 top-[16%]' },
              { label: 'AI Prediction', className: 'right-0 top-[43%]' },
              { label: 'Flood Risk', className: 'right-8 top-[66%]' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 18 }}
                animate={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 1, x: 0, y: [-6, 6, -6] }}
                transition={prefersReducedMotion ? { delay: 0.7 + index * 0.16 } : {
                  opacity: { delay: 0.7 + index * 0.16 },
                  x: { delay: 0.7 + index * 0.16 },
                  y: { duration: 3.4 + index * 0.3, repeat: Infinity, ease: 'easeInOut' },
                }}
                className={`absolute hidden items-center gap-2 rounded-md border border-cyan-300/15 bg-[#06264c]/80 px-3 py-2 text-xs font-semibold text-white/76 shadow-[0_0_26px_rgba(0,194,255,0.12)] backdrop-blur-xl md:flex ${item.className}`}
              >
                <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(0,194,255,0.9)]" />
                {item.label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 h-px w-[92%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      <Sparkles className="absolute left-[78%] top-[19%] h-4 w-4 text-accent/70" />
    </section>
  );
};

export default Hero;
