import { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { ZoomIn, ZoomOut, Navigation } from 'lucide-react';

// Coordinates
const BANGLADESH = { lat: 23.6850, lng: 90.3563 };
const PACIFIC_HUB = { lat: 0, lng: -140 };

const GlobeAnimation = () => {
  const globeEl = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientWidth,
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Configure Globe Controls
  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = !isInteracting;
      controls.autoRotateSpeed = 0.8;
      controls.enableZoom = false; // Disable scroll-zoom to protect landing page scroll
    }
  }, [dimensions.width, isInteracting]);

  // Initial flight to show the data link from Pacific to Bangladesh
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: BANGLADESH.lat - 5, lng: BANGLADESH.lng + 30, altitude: 2.2 }, 2000);
    }
  }, []);

  // Handle Manual Interaction
  const handleUserInteraction = () => {
    setIsInteracting(true);
    if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    interactionTimeout.current = setTimeout(() => {
      setIsInteracting(false); // Resume auto-rotate after 5 seconds of inactivity
    }, 5000);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    handleUserInteraction();
    if (globeEl.current) {
      const currentAltitude = globeEl.current.pointOfView().altitude;
      const newAltitude = direction === 'in' ? Math.max(0.5, currentAltitude * 0.7) : Math.min(4, currentAltitude * 1.3);
      globeEl.current.pointOfView({ altitude: newAltitude }, 600);
    }
  };

  const resetView = () => {
    handleUserInteraction();
    globeEl.current?.pointOfView({ lat: BANGLADESH.lat - 5, lng: BANGLADESH.lng + 30, altitude: 2.2 }, 1500);
  };

  // --- OCEAN SENSE: CLEAN, PROFESSIONAL DATA VISUALIZATION ---
  const { arcsData, ringsData, pointsData } = useMemo(() => {
    
    // 1. Ocean Sensors (Scattered dots in the ocean representing data collection)
    const sensors = [];
    for (let i = 0; i < 40; i++) {
      sensors.push({
        lat: (Math.random() - 0.5) * 60,
        lng: -190 + Math.random() * 120, // Pacific/Indian Ocean
        size: 0.05 + Math.random() * 0.1,
        color: 'rgba(0, 242, 254, 0.6)' // Sleek cyan
      });
    }

    // Add explicit hubs
    sensors.push({ ...PACIFIC_HUB, size: 0.3, color: '#00f2fe' });
    sensors.push({ ...BANGLADESH, size: 0.2, color: '#00f2fe' });

    // 2. Data Links (Elegant, minimal arcs connecting sensors to AI in BD)
    const links = [
      { startLat: PACIFIC_HUB.lat, startLng: PACIFIC_HUB.lng, endLat: BANGLADESH.lat, endLng: BANGLADESH.lng, speed: 2500 },
      { startLat: 15, startLng: -110, endLat: BANGLADESH.lat, endLng: BANGLADESH.lng, speed: 3000 },
      { startLat: -10, startLng: -160, endLat: BANGLADESH.lat, endLng: BANGLADESH.lng, speed: 2800 },
      { startLat: -20, startLng: 100, endLat: BANGLADESH.lat, endLng: BANGLADESH.lng, speed: 2000 }, // Indian Ocean
    ];

    // 3. Radar Ripples (Sensing zones)
    const ripples = [
      { lat: PACIFIC_HUB.lat, lng: PACIFIC_HUB.lng, maxR: 15, propagationSpeed: 1.5, repeatPeriod: 2500, color: 'rgba(0, 242, 254, 0.3)' },
      { lat: BANGLADESH.lat, lng: BANGLADESH.lng, maxR: 6, propagationSpeed: 2, repeatPeriod: 1500, color: 'rgba(0, 242, 254, 0.5)' },
    ];
      
    return { arcsData: links, ringsData: ripples, pointsData: sensors };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative aspect-square w-full flex items-center justify-center cursor-move"
      onMouseDown={handleUserInteraction}
      onTouchStart={handleUserInteraction}
    >
      
      {/* Sleek, professional ambient glow */}
      <div className="absolute inset-[15%] rounded-full bg-blue-900/10 blur-[80px] pointer-events-none" />
      <div className="absolute right-[10%] top-[20%] h-[60%] w-[40%] rounded-full bg-[#00c2ff]/10 blur-[80px] pointer-events-none" />
      
      {/* Minimal Outer Rings */}
      <div className="absolute inset-[8%] rounded-full border border-white/5 border-dashed animate-[spin_120s_linear_infinite] pointer-events-none" />
      <div className="absolute inset-[14%] rounded-full border border-[#00c2ff]/10 animate-[spin_90s_linear_infinite_reverse] pointer-events-none" />
      
      {/* Ultra-minimal Navigation Controls */}
      <div className="absolute bottom-4 right-4 z-30 flex gap-2 opacity-50 transition-opacity hover:opacity-100">
        <button
          onClick={resetView}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
          title="Reset View"
        >
          <Navigation className="h-3.5 w-3.5" />
        </button>
        <div className="flex overflow-hidden rounded-full bg-white/5 backdrop-blur-sm">
          <button
            onClick={() => handleZoom('in')}
            className="flex h-8 w-8 items-center justify-center text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <div className="w-px bg-white/10" />
          <button
            onClick={() => handleZoom('out')}
            className="flex h-8 w-8 items-center justify-center text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Hint to drag (disappears on interaction) */}
      {!isInteracting && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-[10px] uppercase tracking-[0.2em] text-white/30 animate-pulse">
          Drag to explore
        </div>
      )}

      {/* The 3D WebGL Globe */}
      <div className="relative z-10 flex items-center justify-center">
        {dimensions.width > 0 && (
          <Globe
            ref={globeEl}
            width={dimensions.width * 0.9}
            height={dimensions.width * 0.9}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="#00c2ff"
            atmosphereAltitude={0.15}
            showGraticules={true}
            animateIn={true}
            
            // Sensors (Points)
            pointsData={pointsData}
            pointColor={(d: any) => d.color}
            pointAltitude={0.01}
            pointRadius={(d: any) => d.size}
            pointsMerge={true}
            
            // Radar Ripples (Rings)
            ringsData={ringsData}
            ringColor={(d: any) => d.color}
            ringMaxRadius={(d: any) => d.maxR}
            ringPropagationSpeed={(d: any) => d.propagationSpeed}
            ringRepeatPeriod={(d: any) => d.repeatPeriod}
            
            // Data Links (Clean Arcs)
            arcsData={arcsData}
            arcColor={() => ['rgba(255, 255, 255, 0.1)', 'rgba(0, 242, 254, 1)']} // Sleek White to Cyan
            arcAltitude={0.25} // Higher elegant arcs
            arcDashLength={0.4}
            arcDashGap={2} // Only 1 dash visible at a time per link
            arcDashInitialGap={() => Math.random() * 2}
            arcDashAnimateTime={(d: any) => d.speed}
            arcsTransitionDuration={1000}
            arcStroke={0.5} // Thin, sharp, professional
          />
        )}
      </div>
      
    </div>
  );
};

export default GlobeAnimation;
