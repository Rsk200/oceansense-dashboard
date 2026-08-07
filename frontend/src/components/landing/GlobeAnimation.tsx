import { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { ZoomIn, ZoomOut, Navigation } from 'lucide-react';

// Coordinates
const BANGLADESH = { lat: 23.6850, lng: 90.3563 };
const PACIFIC_EQUATOR = { lat: 0, lng: -140 };

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

  // Initial flight to Bangladesh
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: BANGLADESH.lat - 5, lng: BANGLADESH.lng + 10, altitude: 2.0 }, 2000);
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
    globeEl.current?.pointOfView({ lat: BANGLADESH.lat - 5, lng: BANGLADESH.lng + 10, altitude: 2.0 }, 1500);
  };

  // --- GENERATE STUNNING HYBRID PARTICLES ---
  const { arcsData, ringsData } = useMemo(() => {
    const arcs = [];
    
    // 1. Pacific Ocean Heat & Cold Anomaly Currents (Beautiful hybrid flow)
    for (let i = 0; i < 250; i++) {
      const isWarm = Math.random() > 0.5; // 50% warm currents, 50% cold currents
      
      const startLng = -190 + Math.random() * 120;
      // Warm flows East, Cold flows West
      const endLng = isWarm ? startLng + 20 + Math.random() * 30 : startLng - 20 - Math.random() * 30; 
      const lat = (Math.random() - 0.5) * 30; // Hug Equator
      
      arcs.push({
        startLat: lat, startLng, endLat: lat + (Math.random() - 0.5) * 8, endLng,
        color: isWarm 
          ? ['rgba(255, 69, 0, 0)', 'rgba(255, 69, 0, 0.8)'] // Fiery Red
          : ['rgba(0, 242, 254, 0)', 'rgba(0, 194, 255, 0.8)'], // Deep Cyan
        alt: 0.01 + Math.random() * 0.03, // Surface level
        speed: 1500 + Math.random() * 2500,
        dashLength: 0.1, dashGap: 2.5, stroke: 0.3
      });
    }

    // 2. Atmospheric Teleconnection (Winds carrying impact to BD)
    for (let i = 0; i < 40; i++) {
      const isWarm = Math.random() > 0.5;
      arcs.push({
        startLat: PACIFIC_EQUATOR.lat + (Math.random() - 0.5) * 40,
        startLng: PACIFIC_EQUATOR.lng + (Math.random() - 0.5) * 60,
        endLat: BANGLADESH.lat + (Math.random() - 0.5) * 15,
        endLng: BANGLADESH.lng + (Math.random() - 0.5) * 15,
        color: isWarm 
          ? ['rgba(255, 69, 0, 0)', 'rgba(255, 0, 85, 0.9)'] // Red Alert
          : ['rgba(0, 242, 254, 0)', 'rgba(0, 255, 204, 0.9)'], // Monsoon Cyan
        alt: 0.15 + Math.random() * 0.3, // High altitude winds
        speed: 2500 + Math.random() * 2500,
        dashLength: 0.2, dashGap: 4, stroke: 0.5
      });
    }

    // 3. Bangladesh Impact Ring (Subtle Warning)
    const rings = [
      { ...BANGLADESH, color: '#ff0055', maxR: 4, propagationSpeed: 3, repeatPeriod: 1500 },
      { ...BANGLADESH, color: '#00c2ff', maxR: 6, propagationSpeed: 2, repeatPeriod: 2000 }
    ];
      
    return { arcsData: arcs, ringsData: rings };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative aspect-square w-full flex items-center justify-center cursor-move"
      onMouseDown={handleUserInteraction}
      onTouchStart={handleUserInteraction}
    >
      
      {/* Dynamic Background Ambient Glow (Hybrid colors) */}
      <div className="absolute inset-[15%] rounded-full bg-blue-900/10 blur-[80px] pointer-events-none" />
      <div className="absolute right-[5%] top-[20%] h-[60%] w-[40%] rounded-full bg-[#ff4500]/10 blur-[80px] pointer-events-none" />
      <div className="absolute left-[10%] bottom-[10%] h-[40%] w-[40%] rounded-full bg-[#00c2ff]/10 blur-[80px] pointer-events-none" />
      
      {/* Outer orbital tech rings */}
      <div className="absolute inset-[8%] rounded-full border border-white/5 border-dashed animate-[spin_80s_linear_infinite] pointer-events-none" />
      <div className="absolute inset-[14%] rounded-full border border-[#00c2ff]/10 animate-[spin_60s_linear_infinite_reverse] pointer-events-none" />
      
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
            
            ringsData={ringsData}
            ringColor={(d: any) => d.color}
            ringMaxRadius={(d: any) => d.maxR}
            ringPropagationSpeed={(d: any) => d.propagationSpeed}
            ringRepeatPeriod={(d: any) => d.repeatPeriod}
            
            arcsData={arcsData}
            arcColor={(d: any) => d.color}
            arcAltitude={(d: any) => d.alt}
            arcDashLength={(d: any) => d.dashLength}
            arcDashGap={(d: any) => d.dashGap}
            arcDashInitialGap={() => Math.random() * 5}
            arcDashAnimateTime={(d: any) => d.speed}
            arcsTransitionDuration={1000}
            arcStroke={(d: any) => d.stroke}
          />
        )}
      </div>
      
    </div>
  );
};

export default GlobeAnimation;
