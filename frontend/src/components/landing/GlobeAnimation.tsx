import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { ZoomIn, ZoomOut } from 'lucide-react';

// Bangladesh Coordinates (Target)
const BANGLADESH = { lat: 23.6850, lng: 90.3563 };
// Pacific El Nino Region (Source)
const PACIFIC = { lat: 0, lng: -120 };

// Main ENSO Data Streams
const ENSO_ARCS = [
  { startLat: PACIFIC.lat, startLng: PACIFIC.lng, endLat: BANGLADESH.lat, endLng: BANGLADESH.lng, isMain: true },
  { startLat: 5, startLng: -110, endLat: BANGLADESH.lat, endLng: BANGLADESH.lng, isMain: true },
  { startLat: -10, startLng: -140, endLat: BANGLADESH.lat, endLng: BANGLADESH.lng, isMain: true },
];

// Generate dynamic wind/atmospheric flow particles
const WIND_PARTICLES = Array.from({ length: 40 }).map(() => {
  // 70% chance to originate from Pacific (ENSO flow), 30% from Indian Ocean
  const isPacific = Math.random() > 0.3; 
  const startLat = isPacific ? (Math.random() - 0.5) * 60 : -15 + Math.random() * 30;
  const startLng = isPacific ? -170 + Math.random() * 100 : 50 + Math.random() * 40;
  
  return {
    startLat,
    startLng,
    endLat: BANGLADESH.lat + (Math.random() - 0.5) * 10,
    endLng: BANGLADESH.lng + (Math.random() - 0.5) * 10,
    isMain: false,
    alt: 0.05 + Math.random() * 0.2, // Varied heights for 3D depth
    speed: 1500 + Math.random() * 2000,
  };
});

const ALL_ARCS = [...ENSO_ARCS, ...WIND_PARTICLES];

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
      controls.enableZoom = false; // Disable scroll zoom so landing page scrolls smoothly
      
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

  const handleZoom = (direction: 'in' | 'out') => {
    if (globeEl.current) {
      const currentAltitude = globeEl.current.pointOfView().altitude;
      const newAltitude = direction === 'in' ? Math.max(0.5, currentAltitude * 0.7) : Math.min(4, currentAltitude * 1.3);
      globeEl.current.pointOfView({ altitude: newAltitude }, 600);
    }
  };

  return (
    <div ref={containerRef} className="relative aspect-square w-full flex items-center justify-center">
      
      {/* Background ambient glow - Blue on the left, Fiery Orange/Red on the right for ENSO */}
      <div className="absolute inset-[15%] rounded-full bg-[#00c2ff]/10 blur-[80px] pointer-events-none" />
      <div className="absolute right-[5%] top-[20%] h-[60%] w-[40%] rounded-full bg-[#ff4500]/15 blur-[70px] pointer-events-none" />
      
      {/* Outer orbital tech rings */}
      <div className="absolute inset-[8%] rounded-full border border-[#ff0055]/20 border-dashed animate-[spin_80s_linear_infinite] pointer-events-none" />
      <div className="absolute inset-[14%] rounded-full border border-[#00c2ff]/15 animate-[spin_60s_linear_infinite_reverse] pointer-events-none" />
      <div className="absolute inset-[20%] rounded-full border border-accent/10 border-dotted animate-[spin_40s_linear_infinite] pointer-events-none" />

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-1 rounded-lg border border-white/10 bg-[#041C3E]/60 p-1.5 shadow-xl backdrop-blur-md">
        <button
          onClick={() => handleZoom('in')}
          className="rounded p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="rounded p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
      </div>

      {/* The 3D WebGL Globe */}
      <div className="relative z-10 cursor-grab active:cursor-grabbing flex items-center justify-center">
        {dimensions.width > 0 && (
          <Globe
            ref={globeEl}
            width={dimensions.width * 0.88}
            height={dimensions.width * 0.88}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="#00c2ff"
            atmosphereAltitude={0.15}
            showGraticules={true}
            animateIn={true}
            
            // Highlight Bangladesh ONLY (subtle warning pulse)
            ringsData={[
              { ...BANGLADESH, color: '#ff0055', maxR: 4, propagationSpeed: 4, repeatPeriod: 1500 }
            ]}
            ringColor={(d: any) => d.color}
            ringMaxRadius={(d: any) => d.maxR}
            ringPropagationSpeed={(d: any) => d.propagationSpeed}
            ringRepeatPeriod={(d: any) => d.repeatPeriod}
            
            // Atmospheric Flow & ENSO Streams
            arcsData={ALL_ARCS}
            arcColor={(d: any) => d.isMain ? ['#ff4500', '#ff0055'] : ['rgba(0,194,255,0.0)', 'rgba(0,255,204,0.8)']}
            arcAltitude={(d: any) => d.alt || 0.2}
            arcDashLength={(d: any) => d.isMain ? 0.3 : 0.15}
            arcDashGap={(d: any) => d.isMain ? 4 : 2}
            arcDashInitialGap={() => Math.random() * 5}
            arcDashAnimateTime={(d: any) => d.speed || 2500}
            arcsTransitionDuration={0}
            arcStroke={(d: any) => d.isMain ? 0.8 : 0.3}
          />
        )}
      </div>
      
    </div>
  );
};

export default GlobeAnimation;
