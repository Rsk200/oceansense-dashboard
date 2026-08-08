import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CountUpStatProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export default function CountUpStat({ value, suffix = '', duration = 2 }: CountUpStatProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [springValue]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      onViewportEnter={() => {
        motionValue.set(value);
      }}
      className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-accent block mb-3 tabular-nums"
    >
      {displayValue}
      {suffix}
    </motion.span>
  );
}
