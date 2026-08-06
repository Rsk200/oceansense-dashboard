import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { AlertTriangle, Brain, CloudRain, Database, MapPinned, Waves } from 'lucide-react';
import { Card } from '../ui/Card';

const highlights = [
  { icon: CloudRain, title: 'Real Climate Data', description: 'Historical climate data from 1980 to 2024 using rainfall, satellite, and ocean observations.' },
  { icon: Waves, title: 'ENSO Forecasting', description: 'Advanced ONI and Nino 3.4 forecasting with machine learning and deep learning models.' },
  { icon: Brain, title: 'Hybrid AI Models', description: 'XGBoost and LSTM pipelines combine global signals with local river behavior.' },
  { icon: Database, title: 'Flood Prediction', description: 'Precise water level prediction with station thresholds and confidence-aware risk labels.' },
  { icon: AlertTriangle, title: 'Early Warning', description: 'AI-based early warnings for communities and officials before flood risk escalates.' },
  { icon: MapPinned, title: 'Bangladesh Focus', description: 'Tailored for Bangladesh river systems using local data and monitoring stations.' },
];

const ResearchHighlights = () => {
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
      id="research"
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
            <h2 className="text-2xl font-black text-white">Research Highlights</h2>
            <span className="h-px w-14 bg-gradient-to-l from-transparent to-accent/70" />
          </div>
          <p className="text-sm text-white/55">Cutting-edge AI research for flood early warning systems</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6" variants={gridVariants}>
          {highlights.map((highlight) => {
            const Icon = highlight.icon;
            return (
              <motion.div
                key={highlight.title}
                variants={itemVariants}
              >
                <Card hover className="h-full min-h-[190px] text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/12 shadow-[0_0_28px_rgba(0,194,255,0.16)]">
                    <Icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="mb-2 text-sm font-black text-white">{highlight.title}</h3>
                  <p className="text-xs leading-5 text-white/58">{highlight.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ResearchHighlights;
