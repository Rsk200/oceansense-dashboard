import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

export function useCountUp(target: number, durationMs = 1200) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const prefersReducedMotion = useReducedMotion();
  const [value, setValue] = useState(prefersReducedMotion ? target : 0);

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [durationMs, isInView, prefersReducedMotion, target]);

  return { ref, value };
}
