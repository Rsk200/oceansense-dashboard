import { motion } from 'framer-motion';

export default function AnimatedGauge() {
  return (
    <div className="flex justify-center my-11 mb-2">
      <div className="flex flex-col items-center">
        <svg width="220" height="260" viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* gauge post */}
          <rect x="95" y="10" width="30" height="230" rx="6" fill="#0E2338" stroke="#2A4A66" strokeWidth="1.5" />
          
          {/* ticks */}
          <g stroke="#4A6B85" strokeWidth="1.5" fontFamily="JetBrains Mono" fontSize="9" fill="#8DA0B3">
            <line x1="95" y1="30" x2="85" y2="30" /><text x="60" y="34">25m</text>
            <line x1="95" y1="75" x2="85" y2="75" /><text x="60" y="79">22m</text>
            <line x1="95" y1="120" x2="85" y2="120" /><text x="60" y="124">18m</text>
            <line x1="95" y1="165" x2="85" y2="165" /><text x="60" y="169">14m</text>
            <line x1="95" y1="210" x2="85" y2="210" /><text x="60" y="214">10m</text>
          </g>
          
          {/* danger line at 22m */}
          <line x1="93" y1="75" x2="127" y2="75" stroke="#E8664F" strokeWidth="2" strokeDasharray="3 3" />
          
          {/* water fill, animated */}
          <clipPath id="gaugeClip"><rect x="97" y="12" width="26" height="226" rx="4" /></clipPath>
          <g clipPath="url(#gaugeClip)">
            <motion.rect 
              x="97" y="140" width="26" height="120" fill="#4FB3AB" 
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            />
            <motion.rect 
              x="97" y="140" width="26" height="6" fill="#7ED4CC" 
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            />
          </g>
          
          <text x="110" y="255" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#B9C2CE">
            Flood threshold: 22m
          </text>
        </svg>
        <div className="text-center font-mono text-xs text-article-ivory-dim mt-2.5 tracking-wider max-w-[280px]">
          This gauge shows the exact threshold OceanSense forecasts against — every prediction in this article is measured on this line.
        </div>
      </div>
    </div>
  );
}
