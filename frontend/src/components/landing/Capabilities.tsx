import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { AlertTriangle, BarChart3, Brain, Droplets, Globe, LayoutDashboard } from 'lucide-react';
import { Card } from '../ui/Card';

const capabilities = [
  { icon: Globe, title: 'Global ENSO Prediction', description: 'Forecasts ENSO conditions months in advance.' },
  { icon: Droplets, title: 'Flood Prediction', description: 'Water level forecasting with confidence intervals.' },
  { icon: BarChart3, title: 'Climate Analytics', description: 'Climate pattern and trend analysis.' },
  { icon: LayoutDashboard, title: 'Interactive Dashboard', description: 'Real-time monitoring and forecast visualization.' },
  { icon: Brain, title: 'AI Decision Support', description: 'Model-powered insights and recommendations.' },
  { icon: AlertTriangle, title: 'Early Warning', description: 'Automated risk alerts and notifications.' },
];

const Capabilities = () => {
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
      id="capabilities"
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
            <h2 className="text-2xl font-black text-white">Platform Capabilities</h2>
            <span className="h-px w-14 bg-gradient-to-l from-transparent to-accent/70" />
          </div>
          <p className="text-sm text-white/55">Comprehensive tools for climate intelligence and flood risk management</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6" variants={gridVariants}>
          {capabilities.map((capability) => {
            const Icon = capability.icon;
            return (
              <motion.div
                key={capability.title}
                variants={itemVariants}
              >
                <Card hover className="h-full min-h-[170px] text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/12">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mb-2 text-sm font-black text-white">{capability.title}</h3>
                  <p className="text-xs leading-5 text-white/58">{capability.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Capabilities;
