import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

const ScrollProgress = () => {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: prefersReducedMotion ? 1000 : 140,
    damping: prefersReducedMotion ? 100 : 28,
    mass: 0.2,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed left-0 top-0 z-[70] h-[3px] w-full origin-left bg-accent shadow-[0_0_14px_rgba(0,194,255,0.75)]"
      style={{ scaleX }}
    />
  );
};

export default ScrollProgress;
