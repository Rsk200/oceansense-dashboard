import { useEffect, useRef } from 'react';
import { useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';

/**
 * LiquidDistortion
 * Applies a real-time SVG displacement filter to create an "underwater/wave" effect
 * that reacts to how fast the user is scrolling.
 */
export default function LiquidDistortion() {
  const filterRef = useRef<SVGFEDisplacementMapElement>(null);
  
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  // Spring to smooth out the velocity so the wave doesn't jerk
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  // Transform velocity into a scale value for the displacement map
  // If velocity is 0, scale is 0 (no distortion). If scrolling fast, scale goes up to 25.
  const velocityScale = useTransform(smoothVelocity, [-1000, 0, 1000], [25, 0, 25]);

  useEffect(() => {
    // Manually update the SVG DOM node for maximum performance
    // bypassing React renders
    return velocityScale.onChange((latest) => {
      if (filterRef.current) {
        filterRef.current.setAttribute('scale', latest.toString());
      }
    });
  }, [velocityScale]);

  return (
    <svg className="pointer-events-none fixed inset-0 z-[-1] hidden" width="0" height="0">
      <defs>
        <filter id="liquid-distortion">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.015 0.05" 
            numOctaves="1" 
            result="noise" 
          />
          <feDisplacementMap 
            ref={filterRef}
            in="SourceGraphic" 
            in2="noise" 
            scale="0" 
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
        </filter>
      </defs>
    </svg>
  );
}
