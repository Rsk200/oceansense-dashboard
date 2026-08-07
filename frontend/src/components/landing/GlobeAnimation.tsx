import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

const GlobeAnimation = () => {
  const globeEl = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Auto-rotate and configure globe
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.8;
      controls.enableZoom = false;
      
      // Setup initial point of view (zoom out slightly)
      globeEl.current.pointOfView({ altitude: 2.1 });
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
      <div className="absolute inset-0 rounded-full bg-accent/10 blur-[60px] opacity-70 pointer-events-none" />
      <div className="absolute inset-[15%] rounded-full bg-cyan-500/20 blur-[50px] opacity-70 pointer-events-none" />
      
      {/* Outer orbital tech rings */}
      <div className="absolute inset-[3%] rounded-full border border-accent/15 border-dashed animate-[spin_60s_linear_infinite] pointer-events-none" />
      <div className="absolute inset-[12%] rounded-full border border-cyan-200/10 animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />
      
      {/* Globe Shadow Aura */}
      <div className="absolute inset-[18%] rounded-full shadow-[0_0_80px_rgba(0,194,255,0.25)] pointer-events-none" />

      {/* The 3D WebGL Globe */}
      <div className="relative z-10 cursor-grab active:cursor-grabbing flex items-center justify-center">
        {dimensions.width > 0 && (
          <Globe
            ref={globeEl}
            width={dimensions.width * 0.78}
            height={dimensions.width * 0.78}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="#00c2ff"
            atmosphereAltitude={0.15}
            showGraticules={true}
            animateIn={true}
          />
        )}
      </div>
      
    </div>
  );
};

export default GlobeAnimation;
