import { motion } from 'framer-motion';
import { Waves } from 'lucide-react';

const TRANSITION_DURATION = 0.8;
const STAGGER = 0.15;

/**
 * Deep Ocean Wipe Page Transition
 * Sweeps three layers of ocean colors across the screen during route changes,
 * featuring a glowing logo splash in the middle to psychologically hook the user.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 
        The exit layers that sweep UP from the bottom when LEAVING the page.
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

      {/* The glowing logo splash that appears when exiting the page (screen is covered) */}
      <motion.div
        className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0, scale: 0.5 }}
        exit={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: STAGGER * 2 + 0.3, ease: 'easeOut' }}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <Waves className="w-16 h-16 text-accent drop-shadow-[0_0_24px_rgba(0,194,255,0.8)]" />
          <span className="text-2xl font-bold tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]">
            OceanSense
          </span>
        </div>
      </motion.div>

      {/* 
        The entry layers that sweep DOWN from the top when ENTERING the new page.
      */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[102] bg-[#040d1c]"
        initial={{ height: '100vh' }}
        animate={{ height: '0vh' }}
        exit={{ height: '0vh' }}
        transition={{ duration: TRANSITION_DURATION, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />
      <motion.div
        className="fixed top-0 left-0 right-0 z-[101] bg-[#0072A2]"
        initial={{ height: '100vh' }}
        animate={{ height: '0vh' }}
        exit={{ height: '0vh' }}
        transition={{ duration: TRANSITION_DURATION, ease: [0.22, 1, 0.36, 1], delay: STAGGER + 0.2 }}
      />
      <motion.div
        className="fixed top-0 left-0 right-0 z-[100] bg-cyan-600"
        initial={{ height: '100vh' }}
        animate={{ height: '0vh' }}
        exit={{ height: '0vh' }}
        transition={{ duration: TRANSITION_DURATION, ease: [0.22, 1, 0.36, 1], delay: STAGGER * 2 + 0.2 }}
      />

      {/* The glowing logo splash fading out on entry */}
      <motion.div
        className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 1.2 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 0.3, delay: 0.1, ease: 'easeIn' }}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <Waves className="w-16 h-16 text-accent drop-shadow-[0_0_24px_rgba(0,194,255,0.8)]" />
          <span className="text-2xl font-bold tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]">
            OceanSense
          </span>
        </div>
      </motion.div>

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
