import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import GlobeAnimation from './GlobeAnimation';
import { useCountUp } from '../../hooks/useCountUp';

const StatChip = ({
  value,
  label,
  mono = false,
}: {
  value: string;
  label: string;
  mono?: boolean;
}) => (
  <div className="flex flex-col gap-0.5 border-l border-white/10 pl-4 first:border-0 first:pl-0">
    <span className={`text-xl font-bold text-white ${mono ? 'font-mono tabular-nums' : 'font-display'}`}>
      {value}
    </span>
    <span className="text-[11px] font-medium uppercase tracking-widest text-white/40">{label}</span>
  </div>
);

const Hero = () => {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const globeY = useTransform(scrollY, [0, 720], [0, prefersReducedMotion ? 0 : 190]);

  // Dummy ref so useCountUp has something to observe — stat chips are always visible
  const dummy = useCountUp(0);

  return (
    <section id="home" className="relative min-h-[720px] overflow-hidden pt-24 lg:pt-28">
      {/* Background grid */}
      <div className="absolute inset-0 ocean-grid opacity-80" />
      <div className="absolute inset-x-0 top-16 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
      <div className="absolute -top-20 right-0 h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[620px] grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">

          {/* ── Left: copy column ── */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            {/* Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#0072A2]/60 bg-[#041C3E] px-3.5 py-1.5 text-[11px] font-semibold tracking-wider text-[#00C2FF]/90 uppercase">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00C2FF] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00C2FF]" />
              </span>
              ENSO Flood Early Warning · Bangladesh
            </div>

            <h1 className="font-display text-5xl font-bold leading-[0.96] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Ocean<span className="text-gradient">Sense</span>
            </h1>
            <p className="mt-5 text-2xl font-medium text-white/86 sm:text-3xl">
              AI-Powered ENSO Early Flood Prediction
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/64">
              ENSO conditions in the Pacific alter Bangladesh's monsoon months before floods arrive. OceanSense translates those signals into station-level risk — in time to act.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/dashboard/overview">
                <Button size="lg" className="w-full rounded-md text-sm font-bold sm:w-auto">
                  See Live Flood Risk
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="/#research-section" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full rounded-md text-sm font-bold sm:w-auto group">
                  Research &amp; Methodology
                  <ChevronRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </a>
            </div>

            {/* Stat chips */}
            <div ref={dummy.ref} className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              <StatChip value="1980–2024" label="Climate data period" mono />
              <StatChip value="3 Stations" label="Live monitoring" />
              <StatChip value="12+ Months" label="Forecast horizon" mono />
            </div>
          </motion.div>

          {/* ── Right: Globe ── */}
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
              { label: 'Flood Risk',    className: 'right-8 top-[66%]' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 18 }}
                animate={
                  prefersReducedMotion
                    ? { opacity: 1, x: 0 }
                    : { opacity: 1, x: 0, y: [-6, 6, -6] }
                }
                transition={
                  prefersReducedMotion
                    ? { delay: 0.7 + index * 0.16 }
                    : {
                        opacity: { delay: 0.7 + index * 0.16 },
                        x:       { delay: 0.7 + index * 0.16 },
                        y:       { duration: 3.4 + index * 0.3, repeat: Infinity, ease: 'easeInOut' },
                      }
                }
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
    </section>
  );
};

export default Hero;
