import React, { useState, useEffect, useRef, useMemo } from 'react';
import { EphemerisResponse, EphemerisPoint } from '../types';
import { apiClient } from '../api/client';
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Compass, Info, Orbit, Sparkles } from 'lucide-react';

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

    // Fetch 1 full year ephemeris from JPL Horizons
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
    }, 150 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, data, playbackSpeed]);

  // Current active points
  const currentAstPoint = data?.points[currentIndex] || null;

  // Approximate Earth coordinates at corresponding day of year
  // (Earth completes 1 orbit in 365.25 days around 1.0 AU)
  const currentEarthPoint = useMemo(() => {
    if (!data || data.points.length === 0 || !currentAstPoint) {
      return { x: 1.0, y: 0.0, z: 0.0 };
    }
    // Fraction of year from Oct 1 (day ~274 of year)
    const dayOffset = currentIndex * 5; // step size 5 days
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

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear background
    ctx.fillStyle = '#070a13';
    ctx.fillRect(0, 0, width, height);

    // Draw background stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 40; i++) {
      const sx = ((i * 137.5) % width);
      const sy = ((i * 249.3) % height);
      ctx.fillRect(sx, sy, 1.2, 1.2);
    }

    // 3D Projection Helper
    // Rotates point (x, y, z) by rotationZ (around Z axis) and rotationX (around X axis)
    const radX = (rotationX * Math.PI) / 180;
    const radZ = (rotationZ * Math.PI) / 180;

    const project = (x: number, y: number, z: number) => {
      // Rotate around Z axis (ecliptic longitude)
      const x1 = x * Math.cos(radZ) - y * Math.sin(radZ);
      const y1 = x * Math.sin(radZ) + y * Math.cos(radZ);
      const z1 = z;

      // Rotate around X axis (inclination tilt)
      const y2 = y1 * Math.cos(radX) - z1 * Math.sin(radX);
      const z2 = y1 * Math.sin(radX) + z1 * Math.cos(radX);

      // Project to 2D canvas coordinates
      return {
        px: centerX + x1 * zoom,
        py: centerY - y2 * zoom,
        depth: z2
      };
    };

    // 1. Draw Ecliptic Reference Plane Grid Rings (0.5 AU, 1.0 AU Earth, 1.5 AU Mars-like)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
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

    // 2. Draw Earth's Orbit (1.0 AU, Cyan)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    for (let i = 0; i <= 72; i++) {
      const theta = (i / 72) * 2 * Math.PI;
      const pt = project(Math.cos(theta), Math.sin(theta), 0);
      if (i === 0) ctx.moveTo(pt.px, pt.py);
      else ctx.lineTo(pt.px, pt.py);
    }
    ctx.stroke();

    // 3. Draw Asteroid Orbit Trajectory (from Horizons Points)
    if (data && data.points.length > 0) {
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();

      data.points.forEach((pt, i) => {
        const p = project(pt.x_au, pt.y_au, pt.z_au);
        if (i === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      });
      ctx.stroke();

      // Draw vertical drop-lines from points to ecliptic plane to visualize inclination
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.15)';
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

    // 4. Draw the Sun at Center (0, 0, 0)
    const sunPt = project(0, 0, 0);
    // Sun outer glow
    const sunGlow = ctx.createRadialGradient(sunPt.px, sunPt.py, 2, sunPt.px, sunPt.py, 20);
    sunGlow.addColorStop(0, 'rgba(251, 191, 36, 1)');
    sunGlow.addColorStop(0.3, 'rgba(245, 158, 11, 0.6)');
    sunGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunPt.px, sunPt.py, 20, 0, 2 * Math.PI);
    ctx.fill();

    // Sun core
    ctx.fillStyle = '#fffbeb';
    ctx.beginPath();
    ctx.arc(sunPt.px, sunPt.py, 6, 0, 2 * Math.PI);
    ctx.fill();

    // 5. Draw Earth Position at scrubbed epoch
    const earthPt = project(currentEarthPoint.x, currentEarthPoint.y, currentEarthPoint.z);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(earthPt.px, earthPt.py, 5, 0, 2 * Math.PI);
    ctx.fill();
    // Earth label
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#bae6fd';
    ctx.fillText('Earth (1.0 AU)', earthPt.px + 8, earthPt.py + 3);

    // 6. Draw Asteroid Position at scrubbed epoch
    if (currentAstPoint) {
      const astPt = project(currentAstPoint.x_au, currentAstPoint.y_au, currentAstPoint.z_au);
      
      // Connecting dashed line between Earth and Asteroid
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(earthPt.px, earthPt.py);
      ctx.lineTo(astPt.px, astPt.py);
      ctx.stroke();
      ctx.setLineDash([]);

      // Asteroid marker glow
      const astGlow = ctx.createRadialGradient(astPt.px, astPt.py, 1, astPt.px, astPt.py, 10);
      astGlow.addColorStop(0, 'rgba(244, 63, 94, 1)');
      astGlow.addColorStop(1, 'rgba(244, 63, 94, 0)');
      ctx.fillStyle = astGlow;
      ctx.beginPath();
      ctx.arc(astPt.px, astPt.py, 10, 0, 2 * Math.PI);
      ctx.fill();

      // Asteroid core
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.arc(astPt.px, astPt.py, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Asteroid label
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillStyle = '#fecdd3';
      ctx.fillText(data?.target_name || selectedAsteroid, astPt.px + 8, astPt.py - 4);
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
    <div className="space-y-6">
      
      {/* Visualizer Header & Target Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl card-glass border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              JPL HORIZONS 3D ENGINE
            </span>
            <span className="text-xs text-slate-400">Ephemeris Vectors in Heliocentric Ecliptic Frame</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Orbital Path &amp; Motion Simulator
          </h2>
        </div>

        {/* Quick Target Asteroid Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {PRESET_ASTEROIDS.map((ast) => (
            <button
              key={ast.des}
              onClick={() => onSelectAsteroid(ast.des)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedAsteroid === ast.des
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {ast.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas Box */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-space-950 shadow-2xl h-[480px] sm:h-[540px]">
        
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-space-950/80 z-20">
            <Orbit className="w-10 h-10 text-amber-400 animate-spin mb-3" />
            <p className="text-sm font-medium">Computing ephemeris trajectory via NASA JPL Horizons...</p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-rose-300 bg-space-950/90 z-20 p-6 text-center">
            <p className="text-sm">{error}</p>
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

        {/* On-Canvas Telemetry HUD (Top-Left) */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none space-y-2">
          <div className="p-3 rounded-xl bg-space-900/80 backdrop-blur-md border border-slate-800/80 text-xs text-slate-300 space-y-1 w-64 shadow-lg">
            <div className="text-[11px] font-mono text-amber-400 font-semibold uppercase tracking-wider">
              {data?.target_name || selectedAsteroid}
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date (UTC):</span>
              <span className="font-mono text-white">{currentAstPoint?.calendar_date || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sun Distance:</span>
              <span className="font-mono text-white">{currentAstPoint?.distance_sun_au.toFixed(3)} AU</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Orbital Speed:</span>
              <span className="font-mono text-white">{currentAstPoint?.speed_km_s ? `${currentAstPoint.speed_km_s.toFixed(1)} km/s` : '—'}</span>
            </div>
            {distanceEarthAsteroid && (
              <div className="pt-1.5 border-t border-slate-800/80 flex justify-between font-medium">
                <span className="text-rose-400">Earth Distance:</span>
                <span className="font-mono text-rose-300">
                  {distanceEarthAsteroid.distLD.toFixed(1)} LD ({distanceEarthAsteroid.distAU.toFixed(3)} AU)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Camera Preset Buttons (Top-Right) */}
        <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
          <button
            onClick={() => { setRotationX(0); setRotationZ(0); }}
            className="px-2.5 py-1.5 rounded-lg bg-space-900/80 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Top-Down View (Ecliptic Plane)"
          >
            Top-Down (2D)
          </button>
          <button
            onClick={() => { setRotationX(55); setRotationZ(30); }}
            className="px-2.5 py-1.5 rounded-lg bg-space-900/80 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="3D Perspective Inclination View"
          >
            3D Tilt (55°)
          </button>
          <div className="flex items-center space-x-1 bg-space-900/80 backdrop-blur-md border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setZoom((z) => Math.min(500, z + 30))}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(60, z - 30))}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend (Bottom-Left) */}
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none hidden sm:flex items-center space-x-4 bg-space-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800/80 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="text-slate-300">Sun (Origin)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span className="text-slate-300">Earth Orbit (1.0 AU)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
            <span className="text-slate-300">Asteroid Trajectory</span>
          </div>
        </div>

      </div>

      {/* Timeline Scrubber & Animation Controls */}
      {data && data.points.length > 0 && (
        <div className="p-4 rounded-xl card-glass border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs flex items-center space-x-1.5 shadow-sm shadow-sky-500/20"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play Motion'}</span>
              </button>

              <button
                onClick={() => { setIsPlaying(false); setCurrentIndex(0); }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                title="Reset to Start"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-1 text-xs text-slate-400 ml-2">
                <span>Speed:</span>
                {[1, 2, 4].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      playbackSpeed === spd
                        ? 'bg-slate-700 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-mono text-slate-300">
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
            className="w-full accent-sky-400 cursor-pointer"
          />
        </div>
      )}

    </div>
  );
};
