import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const glossary: Record<string, string> = {
  'ENSO': 'The natural warming/cooling cycle of the tropical Pacific Ocean that reshapes weather worldwide.',
  'Niño 3.4 index': 'The single number scientists use to officially track whether the Pacific is in an El Niño, La Niña, or neutral state.',
  'teleconnection': 'A statistical link between weather in one part of the world and weather thousands of kilometres away.',
  'XGBoost': 'A machine learning method that builds many small decision trees and combines them.',
  'LSTM': 'A type of neural network with a built-in "memory," designed to understand patterns over time.',
  'PCA': 'Principal Component Analysis — a way of compressing complex data down to its most important patterns.',
  'BWDB': 'The Bangladesh Water Development Board — the government body that sets official river danger levels.',
};

interface GlossaryTooltipProps {
  term: string;
  children: React.ReactNode;
}

export default function GlossaryTooltip({ term, children }: GlossaryTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);
  const definition = glossary[term];

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <span className="cursor-help border-b border-dashed border-accent/50 text-accent hover:text-accent-light transition-colors duration-300">
        {children}
      </span>
      
      <AnimatePresence>
        {isHovered && definition && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-lg bg-[#041E42]/95 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-none"
          >
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-1.5 font-bold">
              {term}
            </div>
            <div className="text-sm text-white/80 leading-snug font-sans">
              {definition}
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-white/10" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] border-4 border-transparent border-t-[#041E42]/95" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
