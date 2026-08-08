import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type EnsoPhase = 'elnino' | 'lanina';

export default function InteractiveEnsoMap() {
  const [phase, setPhase] = useState<EnsoPhase>('elnino');

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Toggle Controls */}
      <div className="flex bg-black/30 backdrop-blur-md border border-white/10 rounded-full p-1 mb-8">
        <button
          onClick={() => setPhase('elnino')}
          className={`relative px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase transition-colors z-10 ${
            phase === 'elnino' ? 'text-white' : 'text-white/40 hover:text-white/70'
          }`}
        >
          {phase === 'elnino' && (
            <motion.div
              layoutId="ensoToggle"
              className="absolute inset-0 bg-danger/80 rounded-full -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          El Niño
        </button>
        <button
          onClick={() => setPhase('lanina')}
          className={`relative px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase transition-colors z-10 ${
            phase === 'lanina' ? 'text-white' : 'text-white/40 hover:text-white/70'
          }`}
        >
          {phase === 'lanina' && (
            <motion.div
              layoutId="ensoToggle"
              className="absolute inset-0 bg-accent/80 rounded-full -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          La Niña
        </button>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full max-w-2xl aspect-[16/9] rounded-2xl overflow-hidden glass border border-white/10 shadow-2xl bg-[#041E42]">
        <svg viewBox="0 0 800 450" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            {/* Base Grid */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            </pattern>
            
            {/* El Nino Gradient */}
            <radialGradient id="grad-elnino" cx="65%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.6" />
              <stop offset="40%" stopColor="#FFC857" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>

            {/* La Nina Gradient */}
            <radialGradient id="grad-lanina" cx="45%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00C2FF" stopOpacity="0.6" />
              <stop offset="40%" stopColor="#0B2F5C" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00C2FF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="800" height="450" fill="url(#grid)" />

          {/* Equator Line */}
          <line x1="0" y1="225" x2="800" y2="225" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Abstract Continents (Stylized) */}
          {/* Asia/Australia on left */}
          <path d="M-50,0 Q150,50 100,200 T150,450 L-50,450 Z" fill="#0B2F5C" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          {/* Americas on right */}
          <path d="M850,0 Q650,150 700,250 T650,500 L850,500 Z" fill="#0B2F5C" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />

          {/* Dynamic Heatmap Area */}
          <motion.circle
            cx={phase === 'elnino' ? 550 : 350}
            cy="225"
            r={phase === 'elnino' ? 200 : 180}
            fill={phase === 'elnino' ? "url(#grad-elnino)" : "url(#grad-lanina)"}
            animate={{ 
              cx: phase === 'elnino' ? 550 : 350,
              r: phase === 'elnino' ? 250 : 200
            }}
            transition={{ type: "spring", bounce: 0.2, duration: 1.5 }}
          />

          {/* Wind Arrows */}
          <motion.g
            animate={{
              x: phase === 'elnino' ? 50 : -50,
              opacity: phase === 'elnino' ? 0.3 : 0.8
            }}
            transition={{ type: "spring", bounce: 0, duration: 1.5 }}
          >
            {/* Trade winds pushing left (stronger in La Nina, weaker/reversed in El Nino) */}
            <path d="M 500 200 L 300 200 L 320 180 M 300 200 L 320 220" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
            <path d="M 500 250 L 300 250 L 320 230 M 300 250 L 320 270" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
          </motion.g>

          <text x="10" y="215" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="monospace" letterSpacing="2">EQUATOR</text>
        </svg>

        {/* Dynamic Caption Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4"
            >
              <strong className={`font-mono text-xs uppercase tracking-widest block mb-1 ${phase === 'elnino' ? 'text-danger' : 'text-accent'}`}>
                {phase === 'elnino' ? 'El Niño State' : 'La Niña State'}
              </strong>
              <p className="text-sm text-white/80 m-0 leading-relaxed">
                {phase === 'elnino' 
                  ? 'Trade winds weaken. Warm water gets pushed back east toward the Americas, shifting global weather patterns and often reducing rainfall over South Asia.' 
                  : 'Trade winds strengthen, pushing warm water further west toward Asia, bringing heavier monsoon rains and higher flood risks to Bangladesh.'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
