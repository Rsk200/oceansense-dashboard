import { motion, useScroll, useVelocity, useSpring, useTransform, useReducedMotion } from 'framer-motion';

/**
 * ScrollWaveWrapper
 * Bends (skews) the content vertically based on scroll velocity.
 * Creates a "liquid/wave" feeling when scrolling fast.
 */
export default function ScrollWaveWrapper({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  // Spring to smooth out the velocity so the wave doesn't jerk
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  // Transform velocity into a skewY value
  // If velocity is 0, skew is 0 (normal). If scrolling fast, it bends up to 3 degrees.
  const skewY = useTransform(smoothVelocity, [-1000, 0, 1000], [-2.5, 0, 2.5]);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div style={{ skewY }} className="origin-center w-full">
      {children}
    </motion.div>
  );
}
