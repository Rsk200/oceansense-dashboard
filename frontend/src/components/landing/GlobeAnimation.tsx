import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

// Bangladesh Coordinates
const BANGLADESH = { lat: 23.6850, lng: 90.3563 };

// ENSO Data Streams (Pacific Ocean to Bangladesh)
const ENSO_ARCS = [
  { startLat: 0, startLng: -150, endLat: BANGLADESH.lat, endLng: BANGLADESH.lng },
  { startLat: 5, startLng: -120, endLat: BANGLADESH.lat, endLng: BANGLADESH.lng },
  { startLat: -10, startLng: -170, endLat: BANGLADESH.lat, endLng: BANGLADESH.lng },
  { startLat: -5, startLng: 130, endLat: BANGLADESH.lat, endLng: BANGLADESH.lng }, // Indian ocean currents
];

const GlobeAnimation = () => {
  const globeEl = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Auto-rotate and configure globe
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.8;
      controls.enableZoom = false;
      
      // Center directly on Bangladesh on load with a smooth zoom-in animation
      globeEl.current.pointOfView({ lat: BANGLADESH.lat, lng: BANGLADESH.lng, altitude: 1.8 }, 2000);
    }
  }, [dimensions.width]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientWidth,
        });
      }
    };
    
    // Initial size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="relative aspect-square w-full flex items-center justify-center">
      
      {/* Subtle ambient glow (toned down heavily to blend with the dark page) */}
      <div className="absolute inset-[15%] rounded-full bg-blue-900/10 blur-[80px] pointer-events-none" />
      <div className="absolute inset-[25%] rounded-full bg-cyan-600/10 blur-[60px] pointer-events-none" />
      
      {/* Outer orbital tech rings */}
      <div className="absolute inset-[8%] rounded-full border border-cyan-500/10 border-dashed animate-[spin_80s_linear_infinite] pointer-events-none" />
      <div className="absolute inset-[14%] rounded-full border border-blue-500/5 animate-[spin_60s_linear_infinite_reverse] pointer-events-none" />
      <div className="absolute inset-[20%] rounded-full border border-accent/10 border-dotted animate-[spin_40s_linear_infinite] pointer-events-none" />

      {/* The 3D WebGL Globe */}
      <div className="relative z-10 cursor-grab active:cursor-grabbing flex items-center justify-center">
        {dimensions.width > 0 && (
          <Globe
            ref={globeEl}
            width={dimensions.width * 0.88} // Slightly larger globe
            height={dimensions.width * 0.88}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg" // Darker, sleeker texture
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="#1e40af" // Deep blue instead of neon cyan
            atmosphereAltitude={0.12} // Thinner atmosphere
            showGraticules={true}
            animateIn={true}
            
            // Highlight Bangladesh
            ringsData={[BANGLADESH]}
            ringColor={() => '#00f2fe'}
            ringMaxRadius={8}
            ringPropagationSpeed={2}
            ringRepeatPeriod={1000}
            
            // ENSO Data Streams (Wow Factor)
            arcsData={ENSO_ARCS}
            arcColor={() => ['rgba(0, 242, 254, 0.1)', 'rgba(0, 242, 254, 1)']}
            arcDashLength={0.4}
            arcDashGap={0.2}
            arcDashAnimateTime={2000}
            arcsTransitionDuration={0}
            arcStroke={0.5}
          />
        )}
      </div>
      
    </div>
  );
};

export default GlobeAnimation;
