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
      y: -30
    },
    visible: (index: number) => ({
      rotate: index === 3 ? 75 : 60, // The last domino falls further, others lean
      opacity: 1,
      y: 0,
      transition: {
        rotate: { type: "spring", stiffness: 40, damping: 12, delay: index * 0.3 + 0.4 },
        opacity: { duration: 0.4 },
        y: { type: "spring", stiffness: 60, damping: 10 }
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
    <div className="w-full aspect-[4/3] flex items-center justify-center p-4 md:p-8 bg-[#041E42] rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 to-transparent blur-3xl opacity-50" />
      
      {/* Floor line */}
      <div className="absolute bottom-[35%] left-4 right-4 h-px bg-white/20 shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />

      {/* Container for Dominoes sitting on the floor */}
      <motion.div 
        className="flex items-end justify-center gap-3 md:gap-8 w-full absolute bottom-[35%] z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20%" }}
      >
        {dominoes.map((domino, i) => (
          <div key={i} className="relative flex flex-col items-center">
            
            {/* The Domino Block */}
            <motion.div
              custom={i}
              variants={dominoVariants}
              className="w-12 h-28 md:w-20 md:h-40 rounded-md md:rounded-lg shadow-[10px_10px_20px_rgba(0,0,0,0.4)] border-t border-l border-white/20 flex flex-col justify-between p-2 md:p-3 relative origin-bottom-right"
              style={{ 
                background: 'linear-gradient(135deg, #16304B 0%, #0B1E33 100%)',
                zIndex: 10 - i
              }}
            >
              {/* Domino Dots / Design */}
              <div className="w-full flex justify-end">
                <span className="font-mono text-[9px] md:text-xs font-bold" style={{ color: domino.color }}>
                  {domino.label}
                </span>
              </div>
              
              {/* Center Line */}
              <div className="w-full h-px bg-black/40 shadow-[0_1px_0_rgba(255,255,255,0.1)] my-auto" />

              <div className="w-full flex justify-start">
                <div 
                  className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full" 
                  style={{ backgroundColor: domino.color, boxShadow: `0 0 10px ${domino.color}` }} 
                />
              </div>
            </motion.div>

            {/* Explanatory Label (Placed below the floor) */}
            <motion.div 
              className="absolute top-full pt-6 w-16 md:w-24 text-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3 + 0.6, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest font-bold mb-1.5" style={{ color: domino.color }}>
                Step {domino.label}
              </div>
              <div className="font-sans text-[10px] md:text-xs text-white/70 leading-snug">
                {domino.text}
              </div>
            </motion.div>

          </div>
        ))}
      </motion.div>
    </div>
  );
}
