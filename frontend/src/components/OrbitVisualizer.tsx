import React, { useState, useEffect, useRef, useMemo } from 'react';
import { EphemerisResponse } from '../types';
import { apiClient } from '../api/client';
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Orbit, Sparkles } from 'lucide-react';

interface OrbitVisualizerProps {
  selectedAsteroid: string;
  onSelectAsteroid: (des: string) => void;
}

const PRESET_ASTEROIDS = [
  { des: '99942', name: '99942 Apophis', note: 'Approaches ~0.00025 AU on April 2029' },
  { des: '101955', name: '101955 Bennu', note: 'B-type carbonaceous NEO' },
  { des: '433', name: '433 Eros', note: 'Large Mars-crosser Amor asteroid' },
  { des: '2024 YR4', name: '2024 YR4', note: 'Recently discovered Apollo NEO' },
  { des: '162173', name: '162173 Ryugu', note: 'Diamond-shaped carbonaceous asteroid' },
];

export const OrbitVisualizer: React.FC<OrbitVisualizerProps> = ({
  selectedAsteroid,
  onSelectAsteroid
}) => {
  const [data, setData] = useState<EphemerisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Time scrubber and animation state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // 3D camera controls
  const [rotationX, setRotationX] = useState<number>(55); // tilt angle in deg (inclination view)
  const [rotationZ, setRotationZ] = useState<number>(30); // azimuth angle in deg
  const [zoom, setZoom] = useState<number>(180); // scale factor (pixels per AU)

  // Drag interaction state
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fetch Horizons Ephemeris
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    apiClient.getEphemeris(selectedAsteroid, {
      start_time: '2026-10-01',
      stop_time: '2027-10-01',
      step_size: '5d'
    })
      .then((res) => {
        if (!isMounted) return;
        setData(res);
        setCurrentIndex(0);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.response?.data?.detail || 'Failed to fetch ephemeris from NASA JPL Horizons.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedAsteroid]);

  // Animation Loop
  useEffect(() => {
    if (!isPlaying || !data || data.points.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.points.length);
    }, 140 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, data, playbackSpeed]);

  const currentAstPoint = data?.points[currentIndex] || null;

  // Approximate Earth coordinates
  const currentEarthPoint = useMemo(() => {
    if (!data || data.points.length === 0 || !currentAstPoint) {
      return { x: 1.0, y: 0.0, z: 0.0 };
    }
    const dayOffset = currentIndex * 5;
    const totalDays = (274 + dayOffset) % 365.25;
    const angle = (totalDays / 365.25) * 2 * Math.PI;
    return {
      x: Math.cos(angle),
      y: Math.sin(angle),
      z: 0.0
    };
  }, [data, currentIndex, currentAstPoint]);

  // Distance between Earth and Asteroid
  const distanceEarthAsteroid = useMemo(() => {
    if (!currentAstPoint) return null;
    const dx = currentAstPoint.x_au - currentEarthPoint.x;
    const dy = currentAstPoint.y_au - currentEarthPoint.y;
    const dz = currentAstPoint.z_au - currentEarthPoint.z;
    const distAU = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const distLD = distAU * 389.17227;
    return { distAU, distLD };
  }, [currentAstPoint, currentEarthPoint]);

  // 3D Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Deep cosmic gradient background
    const bgGrad = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, width * 0.7);
    bgGrad.addColorStop(0, '#160833');
    bgGrad.addColorStop(0.5, '#0f0524');
    bgGrad.addColorStop(1, '#090317');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Draw multi-colored celestial stars
    const starColors = ['#ffffff', '#ff9ec6', '#8be9fd', '#ffeaa7', '#c084fc'];
    for (let i = 0; i < 50; i++) {
      const sx = ((i * 179.3) % width);
      const sy = ((i * 283.7) % height);
      const color = starColors[i % starColors.length];
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.35 + (i % 5) * 0.12;
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }
    ctx.globalAlpha = 1.0;

    // 3D Projection Helper
    const radX = (rotationX * Math.PI) / 180;
    const radZ = (rotationZ * Math.PI) / 180;

    const project = (x: number, y: number, z: number) => {
      const x1 = x * Math.cos(radZ) - y * Math.sin(radZ);
      const y1 = x * Math.sin(radZ) + y * Math.cos(radZ);
      const z1 = z;

      const y2 = y1 * Math.cos(radX) - z1 * Math.sin(radX);
      const z2 = y1 * Math.sin(radX) + z1 * Math.cos(radX);

      return {
        px: centerX + x1 * zoom,
        py: centerY - y2 * zoom,
        depth: z2
      };
    };

    // 1. Draw Ecliptic Reference Plane Grid Rings
    ctx.strokeStyle = 'rgba(176, 87, 252, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    [0.5, 1.5].forEach((radius) => {
      ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * 2 * Math.PI;
        const pt = project(radius * Math.cos(theta), radius * Math.sin(theta), 0);
        if (i === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.stroke();
    });

    // 2. Draw Earth's Orbit (1.0 AU, Vibrant Cyan with glow)
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.55)';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    for (let i = 0; i <= 72; i++) {
      const theta = (i / 72) * 2 * Math.PI;
      const pt = project(Math.cos(theta), Math.sin(theta), 0);
      if (i === 0) ctx.moveTo(pt.px, pt.py);
      else ctx.lineTo(pt.px, pt.py);
    }
    ctx.stroke();

    // 3. Draw Asteroid Orbit Trajectory (Vibrant Neon Coral/Pink)
    if (data && data.points.length > 0) {
      ctx.strokeStyle = '#ff2a85';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      data.points.forEach((pt, i) => {
        const p = project(pt.x_au, pt.y_au, pt.z_au);
        if (i === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      });
      ctx.stroke();

      // Drop lines to visualize orbital inclination
      ctx.strokeStyle = 'rgba(255, 42, 133, 0.2)';
      ctx.setLineDash([2, 2]);
      data.points.forEach((pt, i) => {
        if (i % 6 === 0) {
          const pt3d = project(pt.x_au, pt.y_au, pt.z_au);
          const ptPlane = project(pt.x_au, pt.y_au, 0);
          ctx.beginPath();
          ctx.moveTo(pt3d.px, pt3d.py);
          ctx.lineTo(ptPlane.px, ptPlane.py);
          ctx.stroke();
        }
      });
      ctx.setLineDash([]);
    }

    // 4. Draw Radiant Golden Sun at Center (0, 0, 0)
    const sunPt = project(0, 0, 0);
    // Outer Corona Glow
    const sunGlow = ctx.createRadialGradient(sunPt.px, sunPt.py, 3, sunPt.px, sunPt.py, 28);
    sunGlow.addColorStop(0, '#fffbeb');
    sunGlow.addColorStop(0.2, '#fde047');
    sunGlow.addColorStop(0.5, 'rgba(255, 138, 61, 0.8)');
    sunGlow.addColorStop(1, 'rgba(255, 42, 133, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunPt.px, sunPt.py, 28, 0, 2 * Math.PI);
    ctx.fill();

    // Sun core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sunPt.px, sunPt.py, 7, 0, 2 * Math.PI);
    ctx.fill();

    // 5. Draw Earth Position at scrubbed epoch
    const earthPt = project(currentEarthPoint.x, currentEarthPoint.y, currentEarthPoint.z);
    
    // Earth glow
    const earthGlow = ctx.createRadialGradient(earthPt.px, earthPt.py, 1, earthPt.px, earthPt.py, 12);
    earthGlow.addColorStop(0, '#22d3ee');
    earthGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = earthGlow;
    ctx.beginPath();
    ctx.arc(earthPt.px, earthPt.py, 12, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(earthPt.px, earthPt.py, 5.5, 0, 2 * Math.PI);
    ctx.fill();

    // Earth label
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillStyle = '#67e8f9';
    ctx.fillText('Earth (1.0 AU)', earthPt.px + 9, earthPt.py + 4);

    // 6. Draw Asteroid Position at scrubbed epoch
    if (currentAstPoint) {
      const astPt = project(currentAstPoint.x_au, currentAstPoint.y_au, currentAstPoint.z_au);
      
      // Distance line connecting Earth & Asteroid
      ctx.strokeStyle = 'rgba(255, 138, 61, 0.6)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(earthPt.px, earthPt.py);
      ctx.lineTo(astPt.px, astPt.py);
      ctx.stroke();
      ctx.setLineDash([]);

      // Asteroid glow
      const astGlow = ctx.createRadialGradient(astPt.px, astPt.py, 1, astPt.px, astPt.py, 16);
      astGlow.addColorStop(0, '#ff2a85');
      astGlow.addColorStop(0.5, 'rgba(255, 92, 106, 0.7)');
      astGlow.addColorStop(1, 'rgba(255, 42, 133, 0)');
      ctx.fillStyle = astGlow;
      ctx.beginPath();
      ctx.arc(astPt.px, astPt.py, 16, 0, 2 * Math.PI);
      ctx.fill();

      // Asteroid core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(astPt.px, astPt.py, 5, 0, 2 * Math.PI);
      ctx.fill();

      // Asteroid label
      ctx.font = 'bold 12px Outfit, sans-serif';
      ctx.fillStyle = '#fbcfe8';
      ctx.fillText(data?.target_name || selectedAsteroid, astPt.px + 10, astPt.py - 6);
    }

  }, [data, currentIndex, currentEarthPoint, currentAstPoint, rotationX, rotationZ, zoom]);

  // Mouse handlers for 3D rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setRotationZ((prev) => (prev + dx * 0.5) % 360);
    setRotationX((prev) => Math.max(0, Math.min(90, prev + dy * 0.5)));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => Math.max(60, Math.min(500, prev - e.deltaY * 0.2)));
  };

  return (
    <div className="space-y-8">
      
      {/* Visualizer Header with Colorful Target Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl cosmic-card border-neon-purple/30">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-neon-amber/20 text-neon-amber border border-neon-amber/40 shadow-[0_0_10px_rgba(255,190,26,0.3)]">
              JPL HORIZONS 3D ENGINE
            </span>
            <span className="text-xs text-slate-300">Heliocentric Ecliptic Vectors in Astronomical Units</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-display">
            Interactive Orbit &amp; Motion Simulator
          </h2>
        </div>

        {/* Quick Target Asteroid Pill Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_ASTEROIDS.map((ast) => (
            <button
              key={ast.des}
              onClick={() => onSelectAsteroid(ast.des)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedAsteroid === ast.des
                  ? 'btn-neon-glow shadow-md'
                  : 'bg-space-900 text-slate-300 hover:text-white border border-neon-purple/30 hover:border-neon-pink'
              }`}
            >
              {ast.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas Box */}
      <div className="relative rounded-3xl overflow-hidden border border-neon-purple/30 bg-space-950 shadow-2xl h-[500px] sm:h-[580px]">
        
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 bg-space-950/85 z-20">
            <Orbit className="w-12 h-12 text-neon-pink animate-spin mb-3" />
            <p className="text-sm font-bold font-display">Calculating ephemeris orbit vectors via NASA JPL Horizons...</p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-rose-300 bg-space-950/90 z-20 p-6 text-center">
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : null}

        {/* Interactive Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
        />

        {/* On-Canvas Telemetry HUD (Top-Left) with Frosted Purple Glass */}
        <div className="absolute top-5 left-5 z-10 pointer-events-none space-y-2">
          <div className="p-4 rounded-2xl cosmic-card border-neon-purple/40 text-xs text-slate-200 space-y-1.5 w-72 shadow-2xl backdrop-blur-xl">
            <div className="text-xs font-mono text-neon-pink font-extrabold uppercase tracking-wider">
              {data?.target_name || selectedAsteroid}
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-400">Date (UTC):</span>
              <span className="font-mono text-white font-bold">{currentAstPoint?.calendar_date || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sun Distance:</span>
              <span className="font-mono text-neon-amber font-semibold">{currentAstPoint?.distance_sun_au.toFixed(3)} AU</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Orbital Speed:</span>
              <span className="font-mono text-neon-cyan font-semibold">{currentAstPoint?.speed_km_s ? `${currentAstPoint.speed_km_s.toFixed(1)} km/s` : '—'}</span>
            </div>
            {distanceEarthAsteroid && (
              <div className="pt-2 border-t border-neon-purple/30 flex justify-between font-bold">
                <span className="text-neon-pink">Earth Distance:</span>
                <span className="font-mono text-neon-pink">
                  {distanceEarthAsteroid.distLD.toFixed(1)} LD ({distanceEarthAsteroid.distAU.toFixed(3)} AU)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Camera Preset Buttons (Top-Right) */}
        <div className="absolute top-5 right-5 z-10 flex flex-col space-y-2">
          <button
            onClick={() => { setRotationX(0); setRotationZ(0); }}
            className="px-3 py-1.5 rounded-full cosmic-card border-neon-purple/40 text-xs font-bold text-slate-200 hover:text-white hover:border-neon-cyan transition-all shadow-lg"
          >
            Top-Down (2D)
          </button>
          <button
            onClick={() => { setRotationX(55); setRotationZ(30); }}
            className="px-3 py-1.5 rounded-full cosmic-card border-neon-purple/40 text-xs font-bold text-slate-200 hover:text-white hover:border-neon-pink transition-all shadow-lg"
          >
            3D Tilt (55°)
          </button>
          <div className="flex items-center space-x-1 cosmic-card border-neon-purple/40 rounded-full p-1 shadow-lg">
            <button
              onClick={() => setZoom((z) => Math.min(500, z + 30))}
              className="p-1.5 rounded-full text-slate-300 hover:text-neon-cyan"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(60, z - 30))}
              className="p-1.5 rounded-full text-slate-300 hover:text-neon-pink"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend (Bottom-Left) */}
        <div className="absolute bottom-5 left-5 z-10 pointer-events-none hidden sm:flex items-center space-x-4 cosmic-card px-4 py-2 rounded-full border-neon-purple/30 text-xs font-semibold shadow-lg">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-neon-amber shadow-[0_0_8px_#ffbe1a]"></span>
            <span className="text-slate-200">Sun (Origin)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-neon-cyan shadow-[0_0_8px_#06b6d4]"></span>
            <span className="text-slate-200">Earth Orbit</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-neon-pink shadow-[0_0_8px_#ff2a85]"></span>
            <span className="text-slate-200">Asteroid Trajectory</span>
          </div>
        </div>

      </div>

      {/* Timeline Scrubber & Animation Controls */}
      {data && data.points.length > 0 && (
        <div className="p-5 rounded-2xl cosmic-card border-neon-purple/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="btn-neon-glow px-4 py-2 rounded-full font-bold text-xs flex items-center space-x-2 shadow-lg"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : 'Play Orbit Motion'}</span>
              </button>

              <button
                onClick={() => { setIsPlaying(false); setCurrentIndex(0); }}
                className="p-2 rounded-full bg-space-900 hover:bg-space-800 text-slate-300 hover:text-white border border-neon-purple/30"
                title="Reset to Start"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-1.5 text-xs text-slate-300 ml-2 font-medium">
                <span>Speed:</span>
                {[1, 2, 4].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      playbackSpeed === spd
                        ? 'bg-neon-purple text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-mono font-bold text-neon-cyan">
              Step {currentIndex + 1} of {data.points.length} • {currentAstPoint?.calendar_date}
            </div>
          </div>

          {/* Slider */}
          <input
            type="range"
            min={0}
            max={data.points.length - 1}
            value={currentIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentIndex(Number(e.target.value));
            }}
            className="w-full accent-neon-pink cursor-pointer h-2 bg-space-900 rounded-lg"
          />
        </div>
      )}

    </div>
  );
};
