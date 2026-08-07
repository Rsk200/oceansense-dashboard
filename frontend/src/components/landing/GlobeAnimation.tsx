import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

// Bangladesh Coordinates
const BANGLADESH = { lat: 23.6850, lng: 90.3563 };

const GlobeAnimation = () => {
  const globeEl = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Auto-rotate and configure globe
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.2; // Slightly faster for visual interest
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
      
      {/* Background ambient glow behind the globe */}
      <div className="absolute inset-0 rounded-full bg-accent/10 blur-[80px] opacity-80 pointer-events-none" />
      <div className="absolute inset-[15%] rounded-full bg-[#00c2ff]/30 blur-[60px] opacity-90 pointer-events-none" />
      <div className="absolute inset-[25%] rounded-full bg-blue-600/30 blur-[40px] opacity-60 pointer-events-none" />
      
      {/* Outer orbital tech rings */}
      <div className="absolute inset-[2%] rounded-full border border-cyan-400/20 border-dashed animate-[spin_80s_linear_infinite] pointer-events-none" />
      <div className="absolute inset-[8%] rounded-full border border-blue-400/10 animate-[spin_60s_linear_infinite_reverse] pointer-events-none" />
      <div className="absolute inset-[14%] rounded-full border border-accent/15 border-dotted animate-[spin_40s_linear_infinite] pointer-events-none" />
      
      {/* Globe Shadow Aura */}
      <div className="absolute inset-[18%] rounded-full shadow-[0_0_120px_rgba(0,194,255,0.45)] pointer-events-none" />

      {/* The 3D WebGL Globe */}
      <div className="relative z-10 cursor-grab active:cursor-grabbing flex items-center justify-center mix-blend-screen">
        {dimensions.width > 0 && (
          <Globe
            ref={globeEl}
            width={dimensions.width * 0.82}
            height={dimensions.width * 0.82}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="#00c2ff"
            atmosphereAltitude={0.25}
            showGraticules={true}
            animateIn={true}
            // Add a pulsing ring over Bangladesh
            ringsData={[BANGLADESH]}
            ringColor={() => '#00ffcc'}
            ringMaxRadius={12}
            ringPropagationSpeed={3}
            ringRepeatPeriod={800}
          />
        )}
      </div>
      
    </div>
  );
};

export default GlobeAnimation;
