import { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { ZoomIn, ZoomOut, Navigation, Info, Waves, ThermometerSun, Snowflake } from 'lucide-react';

// Coordinates
const BANGLADESH = { lat: 23.6850, lng: 90.3563 };
const PACIFIC_EQUATOR = { lat: 0, lng: -140 };

type ClimateMode = 'neutral' | 'elnino' | 'lanina';

const GlobeAnimation = () => {
  const globeEl = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mode, setMode] = useState<ClimateMode>('elnino');
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

  // Storytelling Camera Flight when Mode Changes
  useEffect(() => {
    if (!globeEl.current) return;
    
    // Pause auto-rotation temporarily
    setIsInteracting(true);
    
    // Step 1: Fly to Pacific to show the Ocean Anomaly (The Wave/Source)
    globeEl.current.pointOfView({ lat: PACIFIC_EQUATOR.lat, lng: PACIFIC_EQUATOR.lng, altitude: 1.5 }, 1500);
    
    // Step 2: After looking at the Pacific, fly to Bangladesh to show the impact
    const timer = setTimeout(() => {
      if (globeEl.current) {
        globeEl.current.pointOfView({ lat: BANGLADESH.lat - 10, lng: BANGLADESH.lng, altitude: 1.8 }, 3000);
      }
      
      // Resume rotation shortly after arriving
      const rotationTimer = setTimeout(() => {
        setIsInteracting(false);
      }, 4000);
      return () => clearTimeout(rotationTimer);
      
    }, 3000); // Look at Pacific for 3 seconds

    return () => clearTimeout(timer);
  }, [mode]);

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
    globeEl.current?.pointOfView({ lat: BANGLADESH.lat, lng: BANGLADESH.lng, altitude: 1.8 }, 1500);
  };

  // --- GENERATE DYNAMIC PARTICLES BASED ON CLIMATE MODE ---
  const { arcsData, ringsData, backgroundGlow } = useMemo(() => {
    const arcs = [];
    let rings = [];
    let bgGlow = 'bg-blue-500/10';

    if (mode === 'elnino') {
      bgGlow = 'bg-[#ff4500]/15'; // Fiery background
      
      // 1. Ocean Heat Wave (Surface currents flowing EAST)
      for (let i = 0; i < 200; i++) {
        const startLng = -190 + Math.random() * 100;
        const endLng = startLng + 20 + Math.random() * 30; // Flow East
        const lat = (Math.random() - 0.5) * 20; // Hug Equator
        arcs.push({
          startLat: lat, startLng, endLat: lat + (Math.random() - 0.5) * 5, endLng,
          color: ['rgba(255, 69, 0, 0)', 'rgba(255, 0, 0, 0.9)'], // Fiery Red
          alt: 0.01 + Math.random() * 0.02, // Surface level
          speed: 1500 + Math.random() * 2000,
          dashLength: 0.1, dashGap: 2, stroke: 0.2
        });
      }

      // 2. Atmospheric Teleconnection (Winds carrying impact to BD)
      for (let i = 0; i < 40; i++) {
        arcs.push({
          startLat: PACIFIC_EQUATOR.lat + (Math.random() - 0.5) * 20,
          startLng: PACIFIC_EQUATOR.lng + (Math.random() - 0.5) * 40,
          endLat: BANGLADESH.lat + (Math.random() - 0.5) * 10,
          endLng: BANGLADESH.lng + (Math.random() - 0.5) * 10,
          color: ['rgba(255, 69, 0, 0)', 'rgba(255, 0, 85, 1)'], // Red Alert
          alt: 0.2 + Math.random() * 0.3, // High altitude winds
          speed: 2500 + Math.random() * 2000,
          dashLength: 0.3, dashGap: 4, stroke: 0.6
        });
      }

      // 3. Bangladesh Impact Ring (Red Alert)
      rings = [{ ...BANGLADESH, color: '#ff0055', maxR: 5, propagationSpeed: 4, repeatPeriod: 1200 }];
      
    } else if (mode === 'lanina') {
      bgGlow = 'bg-[#00f2fe]/15'; // Cyan/Cold background
      
      // 1. Ocean Cold Wave (Surface currents flowing WEST)
      for (let i = 0; i < 200; i++) {
        const startLng = -90 - Math.random() * 100;
        const endLng = startLng - 20 - Math.random() * 30; // Flow West
        const lat = (Math.random() - 0.5) * 20; // Hug Equator
        arcs.push({
          startLat: lat, startLng, endLat: lat + (Math.random() - 0.5) * 5, endLng,
          color: ['rgba(0, 242, 254, 0)', 'rgba(0, 194, 255, 0.9)'], // Deep Cyan/Blue
          alt: 0.01 + Math.random() * 0.02, // Surface level
          speed: 1500 + Math.random() * 2000,
          dashLength: 0.1, dashGap: 2, stroke: 0.2
        });
      }

      // 2. Atmospheric Teleconnection (Winds carrying impact to BD - Heavy Monsoon)
      for (let i = 0; i < 40; i++) {
        arcs.push({
          startLat: PACIFIC_EQUATOR.lat + (Math.random() - 0.5) * 20,
          startLng: PACIFIC_EQUATOR.lng + (Math.random() - 0.5) * 40,
          endLat: BANGLADESH.lat + (Math.random() - 0.5) * 10,
          endLng: BANGLADESH.lng + (Math.random() - 0.5) * 10,
          color: ['rgba(0, 242, 254, 0)', 'rgba(0, 255, 204, 1)'], // Cyan/Monsoon Alert
          alt: 0.2 + Math.random() * 0.3, 
          speed: 2500 + Math.random() * 2000,
          dashLength: 0.3, dashGap: 4, stroke: 0.6
        });
      }

      // 3. Bangladesh Impact Ring (Monsoon Alert)
      rings = [{ ...BANGLADESH, color: '#00ffcc', maxR: 5, propagationSpeed: 4, repeatPeriod: 1200 }];
      
    } else {
      // Neutral Mode: Gentle global atmospheric currents
      bgGlow = 'bg-white/5';
      for (let i = 0; i < 100; i++) {
        const startLat = (Math.random() - 0.5) * 120;
        const startLng = (Math.random() - 0.5) * 360;
        arcs.push({
          startLat, startLng,
          endLat: startLat + (Math.random() - 0.5) * 20,
          endLng: startLng + 30 + Math.random() * 20, // Prevailing Westerlies/Easterlies
          color: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.4)'],
          alt: 0.05 + Math.random() * 0.1,
          speed: 3000 + Math.random() * 3000,
          dashLength: 0.15, dashGap: 3, stroke: 0.2
        });
      }
      rings = [{ ...BANGLADESH, color: '#ffffff', maxR: 2, propagationSpeed: 2, repeatPeriod: 3000 }];
    }

    return { arcsData: arcs, ringsData: rings, backgroundGlow: bgGlow };
  }, [mode]);

  return (
    <div 
      ref={containerRef} 
      className="relative aspect-square w-full flex items-center justify-center cursor-move"
      onMouseDown={handleUserInteraction}
      onTouchStart={handleUserInteraction}
    >
      
      {/* Dynamic Background Ambient Glow */}
      <div className="absolute inset-[15%] rounded-full bg-blue-900/10 blur-[80px] pointer-events-none transition-colors duration-1000" />
      <div className={`absolute right-[5%] top-[20%] h-[60%] w-[40%] rounded-full ${backgroundGlow} blur-[70px] pointer-events-none transition-colors duration-1000`} />
      
      {/* Outer orbital tech rings */}
      <div className="absolute inset-[8%] rounded-full border border-white/5 border-dashed animate-[spin_80s_linear_infinite] pointer-events-none" />
      <div className="absolute inset-[14%] rounded-full border border-[#00c2ff]/10 animate-[spin_60s_linear_infinite_reverse] pointer-events-none" />
      
      {/* INTERACTIVE ENSO SIMULATOR PANEL */}
      <div className="absolute top-4 left-4 z-30 flex flex-col gap-3">
        <div className="rounded-xl border border-white/10 bg-[#041C3E]/80 p-3 shadow-2xl backdrop-blur-xl">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
            <Waves className="h-3 w-3" /> Live ENSO Simulator
          </h3>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setMode('elnino')}
              className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all ${mode === 'elnino' ? 'bg-[#ff4500]/20 text-[#ff4500] border border-[#ff4500]/30' : 'text-white/70 hover:bg-white/5'}`}
            >
              <ThermometerSun className="h-4 w-4" />
              <div className="text-left">
                <div className="leading-tight">El Niño Phase</div>
                <div className="text-[10px] opacity-70">Warming Pacific, Drought Risk</div>
              </div>
            </button>
            <button 
              onClick={() => setMode('lanina')}
              className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all ${mode === 'lanina' ? 'bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/30' : 'text-white/70 hover:bg-white/5'}`}
            >
              <Snowflake className="h-4 w-4" />
              <div className="text-left">
                <div className="leading-tight">La Niña Phase</div>
                <div className="text-[10px] opacity-70">Cooling Pacific, Flood Risk</div>
              </div>
            </button>
          </div>
        </div>
        
        {/* Interaction Hint */}
        <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-black/40 px-3 py-2 backdrop-blur-md text-xs text-white/60">
          <Info className="h-4 w-4 text-[#00c2ff]" />
          Drag earth to explore currents
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-2">
        <button
          onClick={resetView}
          className="rounded-lg border border-white/10 bg-[#041C3E]/80 p-2 text-white/70 shadow-xl backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
          title="Reset to Bangladesh"
        >
          <Navigation className="h-4 w-4" />
        </button>
        <div className="flex flex-col gap-px overflow-hidden rounded-lg border border-white/10 bg-[#041C3E]/80 shadow-xl backdrop-blur-md">
          <button
            onClick={() => handleZoom('in')}
            className="p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <div className="h-px w-full bg-white/10" />
          <button
            onClick={() => handleZoom('out')}
            className="p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
        </div>
      </div>

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
