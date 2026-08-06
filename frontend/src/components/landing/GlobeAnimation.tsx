import { motion, useReducedMotion } from 'framer-motion';

const orbitDots = [
  { size: 'h-2 w-2', top: '5%', left: '52%', color: 'bg-accent', duration: 18 },
  { size: 'h-1.5 w-1.5', top: '82%', left: '48%', color: 'bg-white', duration: 26 },
  { size: 'h-1.5 w-1.5', top: '50%', left: '96%', color: 'bg-emerald-300', duration: 34 },
];

const GlobeAnimation = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative aspect-square w-full">
      <div className="absolute inset-[7%] rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute inset-[19%] rounded-full bg-emerald-300/10 blur-2xl" />

      <motion.div
        className="absolute inset-[3%] rounded-full border border-accent/15"
        animate={prefersReducedMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 46, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-[12%] rounded-full border border-dashed border-cyan-200/15"
        animate={prefersReducedMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 62, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-x-[20%] bottom-[13%] h-[15%] rounded-[50%] border border-accent/25"
        animate={prefersReducedMotion ? undefined : { opacity: [0.45, 0.8, 0.45], scale: [1, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {orbitDots.map((dot, index) => (
        <motion.div
          key={`${dot.top}-${dot.left}`}
          className="absolute inset-[4%]"
          animate={prefersReducedMotion ? undefined : { rotate: index % 2 ? -360 : 360 }}
          transition={{ duration: dot.duration, repeat: Infinity, ease: 'linear' }}
        >
          <span
            className={`absolute ${dot.size} ${dot.color} rounded-full shadow-[0_0_14px_rgba(0,194,255,0.8)]`}
            style={{ top: dot.top, left: dot.left }}
          />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9 }}
        className="absolute inset-[18%] overflow-hidden rounded-full border border-cyan-200/20 shadow-[0_0_70px_rgba(0,194,255,0.35)]"
      >
        <svg viewBox="0 0 240 240" className="h-full w-full">
          <defs>
            <radialGradient id="oceanSphere" cx="34%" cy="28%" r="74%">
              <stop offset="0%" stopColor="#42f4ff" stopOpacity="0.95" />
              <stop offset="42%" stopColor="#088fc0" stopOpacity="0.9" />
              <stop offset="78%" stopColor="#0a315e" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#020817" />
            </radialGradient>
            <radialGradient id="nightShade" cx="74%" cy="72%" r="70%">
              <stop offset="0%" stopColor="#020817" stopOpacity="0" />
              <stop offset="100%" stopColor="#020817" stopOpacity="0.76" />
            </radialGradient>
            <filter id="landGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="globeClip">
              <circle cx="120" cy="120" r="120" />
            </clipPath>
          </defs>

          <circle cx="120" cy="120" r="120" fill="url(#oceanSphere)" />
          <g clipPath="url(#globeClip)">
            <motion.g
              animate={prefersReducedMotion ? undefined : { x: [-32, 14, -32] }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              fill="#00d26a"
              fillOpacity="0.48"
              stroke="#5fffd2"
              strokeOpacity="0.22"
              filter="url(#landGlow)"
            >
              <path d="M24 64 C44 45 70 45 82 62 C96 82 72 94 70 116 C68 139 47 142 35 126 C23 110 8 85 24 64 Z" />
              <path d="M86 42 C109 30 142 33 157 54 C170 72 157 87 140 84 C126 82 120 93 108 89 C89 84 73 60 86 42 Z" />
              <path d="M130 93 C143 89 159 95 164 111 C171 132 153 144 149 162 C145 184 122 188 108 172 C96 158 100 140 109 129 C118 117 113 101 130 93 Z" />
              <path d="M154 128 C174 123 196 135 200 155 C205 179 183 194 164 185 C151 178 146 138 154 128 Z" />
              <path d="M177 49 C195 43 214 53 219 70 C225 88 208 101 191 94 C177 88 165 59 177 49 Z" />
            </motion.g>

            <g stroke="rgba(255,255,255,0.18)" strokeWidth="0.7" fill="none">
              <ellipse cx="120" cy="120" rx="118" ry="38" />
              <ellipse cx="120" cy="120" rx="118" ry="72" />
              <ellipse cx="120" cy="120" rx="42" ry="118" />
              <ellipse cx="120" cy="120" rx="78" ry="118" />
            </g>
          </g>

          <circle cx="120" cy="120" r="120" fill="url(#nightShade)" />
          <circle cx="120" cy="120" r="118" fill="none" stroke="rgba(25,227,255,0.36)" strokeWidth="1.4" />

          <motion.g
            animate={prefersReducedMotion ? undefined : { opacity: [0.6, 1, 0.6], scale: [0.98, 1.06, 0.98] }}
            transition={{ duration: 2.6, repeat: Infinity }}
            style={{ transformOrigin: '132px 130px' }}
          >
            <circle cx="132" cy="130" r="4" fill="#00ffaa" />
            <circle cx="132" cy="130" r="12" fill="none" stroke="#00ffaa" strokeOpacity="0.45" />
            <path d="M132 130 L102 148 L149 158 L176 136" stroke="#00ffaa" strokeWidth="1" strokeOpacity="0.45" fill="none" />
          </motion.g>
        </svg>

        <div className="absolute left-[18%] top-[10%] h-20 w-28 rounded-full bg-white/18 blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_38%_30%,transparent_0%,transparent_42%,rgba(2,8,23,0.38)_100%)]" />
      </motion.div>
    </div>
  );
};

export default GlobeAnimation;
