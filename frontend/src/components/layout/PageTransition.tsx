import { motion } from 'framer-motion';

const TRANSITION_DURATION = 0.8;
const STAGGER = 0.15;

/**
 * Deep Ocean Wipe Page Transition
 * Sweeps three layers of ocean colors across the screen during route changes.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 
        The exit layers that sweep UP from the bottom when LEAVING the page.
        They start completely off-screen at the bottom (y: 100%), and animate to cover the screen (y: 0%).
      */}
      <motion.div
        className="fixed inset-0 z-[100] bg-cyan-600"
        initial={{ y: '100%' }}
        exit={{ y: '0%' }}
        transition={{ duration: TRANSITION_DURATION, ease: [0.22, 1, 0.36, 1], delay: 0 }}
      />
      <motion.div
        className="fixed inset-0 z-[101] bg-[#0072A2]"
        initial={{ y: '100%' }}
        exit={{ y: '0%' }}
        transition={{ duration: TRANSITION_DURATION, ease: [0.22, 1, 0.36, 1], delay: STAGGER }}
      />
      <motion.div
        className="fixed inset-0 z-[102] bg-[#040d1c]"
        initial={{ y: '100%' }}
        exit={{ y: '0%' }}
        transition={{ duration: TRANSITION_DURATION, ease: [0.22, 1, 0.36, 1], delay: STAGGER * 2 }}
      />

      {/* 
        The entry layers that sweep DOWN from the top when ENTERING the new page.
        They start covering the screen (height: 100vh), and their height animates to 0.
      */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[102] bg-[#040d1c]"
        initial={{ height: '100vh' }}
        animate={{ height: '0vh' }}
        exit={{ height: '0vh' }}
        transition={{ duration: TRANSITION_DURATION, ease: [0.22, 1, 0.36, 1], delay: 0 }}
      />
      <motion.div
        className="fixed top-0 left-0 right-0 z-[101] bg-[#0072A2]"
        initial={{ height: '100vh' }}
        animate={{ height: '0vh' }}
        exit={{ height: '0vh' }}
        transition={{ duration: TRANSITION_DURATION, ease: [0.22, 1, 0.36, 1], delay: STAGGER }}
      />
      <motion.div
        className="fixed top-0 left-0 right-0 z-[100] bg-cyan-600"
        initial={{ height: '100vh' }}
        animate={{ height: '0vh' }}
        exit={{ height: '0vh' }}
        transition={{ duration: TRANSITION_DURATION, ease: [0.22, 1, 0.36, 1], delay: STAGGER * 2 }}
      />

      {/* Actual page content fades in slightly after the wipe */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: STAGGER * 2 + 0.3, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </>
  );
}
