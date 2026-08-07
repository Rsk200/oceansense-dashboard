import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.06, // Creates a very heavy, luxurious, buttery smooth friction
      wheelMultiplier: 0.8, // Slightly slows down the wheel for a premium heavy feel
      smoothWheel: true,
      touchMultiplier: 1.5, // Better touch feeling
      syncTouch: true, // Makes touch scrolling smooth too
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
