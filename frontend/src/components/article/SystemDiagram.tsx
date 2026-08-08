import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
export default function SystemDiagram() {
  const lineVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 1.5, ease: "easeInOut" }
    }
  };

  const nodeVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", bounce: 0.4, duration: 0.8 }
    }
  };

  return (
    <div className="w-full aspect-square md:aspect-[4/3] flex items-center justify-center p-8 bg-[#041E42] rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-accent/20 blur-[50px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-danger/20 blur-[50px] rounded-full" />

      <motion.svg 
        viewBox="0 0 400 400" 
        className="w-full h-full relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20%" }}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00C2FF" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>

        {/* Connecting Lines */}
        <motion.path 
          d="M 200 80 L 200 160"
          stroke="url(#lineGrad)" strokeWidth="3" strokeDasharray="6 6" fill="none"
          variants={lineVariants}
        />
        <motion.path 
          d="M 200 240 L 200 320"
          stroke="url(#lineGrad)" strokeWidth="3" strokeDasharray="6 6" fill="none"
          variants={lineVariants}
        />

        {/* Helper 1: Ocean */}
        <motion.g variants={nodeVariants} transform="translate(200, 80)">
          <circle r="40" fill="#0B2F5C" stroke="#00C2FF" strokeWidth="2" />
          <path d="M -15 0 Q 0 -15 15 0 T 15 0" fill="none" stroke="#00C2FF" strokeWidth="2" strokeLinecap="round" />
          <path d="M -15 10 Q 0 -5 15 10 T 15 10" fill="none" stroke="#00C2FF" strokeWidth="2" strokeLinecap="round" />
          <text y="60" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12" fontFamily="monospace" letterSpacing="1">OCEAN</text>
        </motion.g>

        {/* Helper 2: River */}
        <motion.g variants={nodeVariants} transform="translate(200, 200)">
          <circle r="40" fill="#0B2F5C" stroke="#19E3FF" strokeWidth="2" />
          {/* Drops */}
          <path d="M -10 -5 Q -10 5 0 10 Q 10 5 10 -5 Q 0 -15 -10 -5" fill="none" stroke="#19E3FF" strokeWidth="2" />
          <text y="60" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12" fontFamily="monospace" letterSpacing="1">RIVER</text>
        </motion.g>

        {/* Helper 3: Alert */}
        <motion.g variants={nodeVariants} transform="translate(200, 320)">
          <circle r="40" fill="#EF4444" fillOpacity="0.2" stroke="#EF4444" strokeWidth="2" />
          {/* Bell */}
          <path d="M -12 5 C -12 -10 12 -10 12 5 L 15 10 L -15 10 Z" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="0" cy="14" r="2" fill="#EF4444" />
          <text y="60" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12" fontFamily="monospace" letterSpacing="1">ALERT</text>
        </motion.g>

      </motion.svg>
    </div>
  );
}
