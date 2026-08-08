import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
export default function AnimatedDominoes() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const dominoVariants: Variants = {
    hidden: { 
      rotate: 0, 
      opacity: 0,
      y: 20
    },
    visible: (index: number) => ({
      rotate: index === 3 ? 75 : 60, // The last domino falls flat, others lean
      opacity: 1,
      y: 0,
      transition: {
        rotate: { type: "spring", stiffness: 50, damping: 10 },
        opacity: { duration: 0.4 },
        y: { duration: 0.4 }
      }
    })
  };

  // 4 Dominoes
  const dominoes = [
    { label: "1", text: "ENSO Shift", color: "#00C2FF" },
    { label: "2", text: "Wind/Pressure", color: "#19E3FF" },
    { label: "3", text: "Rainfall", color: "#0B2F5C" },
    { label: "4", text: "River Flood", color: "#EF4444" }
  ];

  return (
    <div className="w-full aspect-[4/3] flex items-center justify-center p-8 bg-[#041E42] rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 to-transparent blur-3xl opacity-50" />
      
      {/* Floor line */}
      <div className="absolute bottom-[30%] left-10 right-10 h-px bg-white/20" />

      <motion.div 
        className="flex items-end justify-center w-full h-[200px] relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20%" }}
      >
        {dominoes.map((domino, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={dominoVariants}
            className="w-16 h-32 md:w-20 md:h-40 rounded-lg shadow-xl border border-white/10 flex flex-col justify-between p-2 md:p-3 relative origin-bottom-right"
            style={{ 
              backgroundColor: '#0B1E33', // Dark navy base
              marginRight: i === 3 ? 0 : '-10px', // Overlap so they hit each other
              zIndex: 10 - i
            }}
          >
            {/* Domino Dots / Design */}
            <div className="w-full flex justify-end">
              <span className="font-mono text-[10px] md:text-xs font-bold" style={{ color: domino.color }}>
                {domino.label}
              </span>
            </div>
            
            {/* Center Line */}
            <div className="w-full h-px bg-white/10 my-auto" />

            <div className="w-full flex justify-start">
              <div 
                className="w-2 h-2 md:w-3 md:h-3 rounded-full" 
                style={{ backgroundColor: domino.color, boxShadow: `0 0 10px ${domino.color}` }} 
              />
            </div>
            
            {/* Overlay Text inside Domino */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 whitespace-nowrap opacity-20 pointer-events-none">
              <span className="font-display text-xs md:text-sm font-bold text-white tracking-widest uppercase">
                {domino.text}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
