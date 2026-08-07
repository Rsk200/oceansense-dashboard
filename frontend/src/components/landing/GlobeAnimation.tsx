import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

// Bangladesh Coordinates (Target)
const BANGLADESH = { lat: 23.6850, lng: 90.3563 };
// Pacific El Nino Region (Source)
const PACIFIC = { lat: 0, lng: -120 };

// ENSO Data Streams (Pacific Ocean to Bangladesh)
const ENSO_ARCS = [
  { startLat: PACIFIC.lat, startLng: PACIFIC.lng, endLat: BANGLADESH.lat, endLng: BANGLADESH.lng },
  { startLat: 5, startLng: -110, endLat: BANGLADESH.lat, endLng: BANGLADESH.lng },
  { startLat: -10, startLng: -140, endLat: BANGLADESH.lat, endLng: BANGLADESH.lng },
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
      controls.autoRotateSpeed = 1.0;
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
      
      {/* Background ambient glow - Blue on the left, Fiery Orange/Red on the right for ENSO */}
      <div className="absolute inset-[15%] rounded-full bg-[#00c2ff]/10 blur-[80px] pointer-events-none" />
      <div className="absolute right-[5%] top-[20%] h-[60%] w-[40%] rounded-full bg-[#ff4500]/15 blur-[70px] pointer-events-none" />
      
      {/* Outer orbital tech rings */}
      <div className="absolute inset-[8%] rounded-full border border-[#ff0055]/20 border-dashed animate-[spin_80s_linear_infinite] pointer-events-none" />
      <div className="absolute inset-[14%] rounded-full border border-[#00c2ff]/15 animate-[spin_60s_linear_infinite_reverse] pointer-events-none" />
      <div className="absolute inset-[20%] rounded-full border border-accent/10 border-dotted animate-[spin_40s_linear_infinite] pointer-events-none" />

      {/* The 3D WebGL Globe */}
      <div className="relative z-10 cursor-grab active:cursor-grabbing flex items-center justify-center">
        {dimensions.width > 0 && (
          <Globe
            ref={globeEl}
            width={dimensions.width * 0.88} // Slightly larger globe
            height={dimensions.width * 0.88}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg" // Beautiful night lights
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="#00c2ff" // Restored vibrant atmosphere
            atmosphereAltitude={0.15}
            showGraticules={true}
            animateIn={true}
            
            // Highlight ENSO Origin (Fire/Warming) and Bangladesh (Flood Alert)
            ringsData={[
              { ...PACIFIC, color: '#ff4500', maxR: 20, propagationSpeed: 1, repeatPeriod: 1200 }, // Massive slow fiery pulse
              { ...BANGLADESH, color: '#ff0055', maxR: 8, propagationSpeed: 3, repeatPeriod: 800 }  // Fast red alert pulse
            ]}
            ringColor={(d: any) => d.color}
            ringMaxRadius={(d: any) => d.maxR}
            ringPropagationSpeed={(d: any) => d.propagationSpeed}
            ringRepeatPeriod={(d: any) => d.repeatPeriod}
            
            // Fiery ENSO Data Streams (Wow Factor)
            arcsData={ENSO_ARCS}
            arcColor={() => ['#ff4500', '#ff0055']} // Fiery orange to red alert
            arcDashLength={0.4}
            arcDashGap={0.2}
            arcDashAnimateTime={2000}
            arcsTransitionDuration={0}
            arcStroke={0.6} // Thicker, bolder arcs
          />
        )}
      </div>
      
    </div>
  );
};

export default GlobeAnimation;
