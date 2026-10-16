import React from 'react';
import { Search, Compass, Orbit, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onQuickSelect: (des: string) => void;
  onExploreApproaches: () => void;
  onOpenOrbitView: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  onQuickSelect,
  onExploreApproaches,
  onOpenOrbitView
}) => {
  return (
    <div className="relative pt-6 pb-12 overflow-hidden">
      
      {/* Background Decorative Cosmic Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-neon-pink/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-neon-cyan/15 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Main Hero Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Headlines, Search, CTAs */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          
          {/* Eyebrow Badge (like in Image 2: NAVIGATE THE UNIVERSE) */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-space-800 to-space-700 border border-neon-purple/40 shadow-lg shadow-neon-purple/20">
            <span className="w-2 h-2 rounded-full bg-neon-pink animate-ping" />
            <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-widest uppercase text-neon-pink">
              NAVIGATE THE UNIVERSE
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-300 text-xs font-medium">NASA JPL Real-Time Data</span>
          </div>

          {/* Main Rounded Bold Title (Outfit Font) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Start Exploring{' '}
            <span className="accent-underline inline-block text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-coral to-neon-amber">
              Infinite Space
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
            Discover near-Earth asteroids, track close approaches in Lunar Distances, and interact with live 3D orbital simulations powered by official NASA/JPL telemetry.
          </p>

          {/* Search Bar (like in Image 1) */}
          <form onSubmit={onSearch} className="max-w-xl mx-auto lg:mx-0">
            <div className="relative p-1.5 rounded-2xl bg-space-900/90 border border-neon-purple/40 shadow-2xl shadow-neon-purple/20 backdrop-blur-xl flex items-center gap-2">
              <Search className="w-5 h-5 text-neon-purple ml-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search asteroid (e.g. Apophis, 99942, Bennu, 2024 YR4)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-2 py-2 text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
              />
              <button
                type="submit"
                className="btn-neon-glow px-6 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase flex-shrink-0"
              >
                Search
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-3 text-xs">
              <span className="text-slate-400 text-[11px] font-medium">Trending:</span>
              {[
                { des: '99942', label: '99942 Apophis' },
                { des: '101955', label: '101955 Bennu' },
                { des: '2024 YR4', label: '2024 YR4' },
                { des: '433', label: '433 Eros' },
                { des: '162173', label: '162173 Ryugu' },
              ].map((ast) => (
                <button
                  key={ast.des}
                  type="button"
                  onClick={() => onQuickSelect(ast.des)}
                  className="px-2.5 py-1 rounded-full bg-space-850/80 hover:bg-neon-purple/20 text-slate-300 hover:text-white border border-neon-purple/30 hover:border-neon-pink transition-all font-mono text-[11px]"
                >
                  {ast.label}
                </button>
              ))}
            </div>
          </form>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={onExploreApproaches}
              className="btn-neon-glow px-6 py-3 rounded-full text-sm font-bold flex items-center space-x-2 shadow-xl"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Close Encounters</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onOpenOrbitView}
              className="btn-secondary-glow px-6 py-3 rounded-full text-sm font-semibold flex items-center space-x-2"
            >
              <Orbit className="w-4 h-4 text-neon-cyan" />
              <span>Launch 3D Orbit Simulator</span>
            </button>
          </div>

        </div>

        {/* Right Column: Colorful Space Vector Artwork (inspired by Images 2, 3 & 4) */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            
            {/* Ambient Background Cosmic Glow Ring */}
            <div className="absolute inset-0 rounded-full border border-neon-purple/20 animate-spin-slow pointer-events-none" />
            <div className="absolute inset-6 rounded-full border border-dashed border-neon-pink/20 animate-spin-reverse-slow pointer-events-none" />
            
            {/* Stylized Giant Purple Planet with Craters (from Image 3) */}
            <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-[#2a1157] via-[#5b21b6] to-[#ec4899] shadow-[0_0_60px_rgba(168,85,247,0.4)] flex items-center justify-center overflow-hidden">
              {/* Planetary craters */}
              <div className="absolute top-6 left-8 w-8 h-8 rounded-full bg-[#1e0a42]/70 border border-[#8b5cf6]/40" />
              <div className="absolute bottom-8 right-10 w-12 h-12 rounded-full bg-[#1e0a42]/60 border border-[#8b5cf6]/30" />
              <div className="absolute top-16 right-6 w-6 h-6 rounded-full bg-[#1e0a42]/50" />
              <div className="absolute bottom-6 left-12 w-5 h-5 rounded-full bg-[#1e0a42]/60" />
            </div>

            {/* Orbiting Ring around the Planet */}
            <div className="absolute w-64 h-20 border-4 border-neon-cyan/60 rounded-[100%] rotate-[-25deg] shadow-[0_0_20px_rgba(6,182,212,0.6)] pointer-events-none" />

            {/* Floating Rocket with Fire & Trail (from Image 2 & Image 4) */}
            <div className="absolute z-20 animate-float translate-x-4 -translate-y-4">
              <svg width="220" height="220" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_15px_30px_rgba(255,42,133,0.5)]">
                {/* Rocket Thrust Cloud */}
                <ellipse cx="65" cy="155" rx="35" ry="18" transform="rotate(-40 65 155)" fill="url(#smokeGrad)" opacity="0.85" />
                
                {/* Thrust Flame */}
                <path d="M72 135 L50 170 L82 145 Z" fill="#ffbe1a" />
                <path d="M75 130 L60 162 L85 140 Z" fill="#ff2a85" />

                {/* Rocket Body */}
                <path d="M145 40 C110 55 90 95 85 135 L125 125 C135 85 155 65 145 40 Z" fill="url(#rocketBodyGrad)" />
                
                {/* Left Fin */}
                <path d="M85 130 L60 145 C65 125 75 110 85 105 Z" fill="#ff2a85" />
                
                {/* Right Fin */}
                <path d="M125 125 L145 145 C135 130 130 115 125 105 Z" fill="#ff2a85" />

                {/* Center Nose Cone Highlight */}
                <path d="M145 40 C140 45 135 55 130 65 L145 75 Z" fill="#fde047" />

                {/* Cockpit Window */}
                <circle cx="120" cy="80" r="14" fill="#0c051e" stroke="#38bdf8" strokeWidth="3" />
                <circle cx="123" cy="77" r="5" fill="#38bdf8" opacity="0.8" />

                {/* Gradients */}
                <defs>
                  <linearGradient id="rocketBodyGrad" x1="145" y1="40" x2="85" y2="135" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ff5c6a" />
                    <stop offset="0.5" stopColor="#ff2a85" />
                    <stop offset="1" stopColor="#8b5cf6" />
                  </linearGradient>
                  <radialGradient id="smokeGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(65 155) rotate(90) scale(18 35)">
                    <stop stopColor="#a855f7" stopOpacity="0.8" />
                    <stop offset="1" stopColor="#3b0764" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </div>

            {/* Orbiting Colorful Mini-Planets (Cyan, Pink, Coral) */}
            <div className="absolute top-2 right-4 w-12 h-12 rounded-full bg-gradient-to-tr from-neon-cyan to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.8)] animate-float-delayed flex items-center justify-center">
              <div className="w-16 h-3 border-2 border-neon-cyan/50 rounded-[100%] rotate-[20deg]" />
            </div>

            <div className="absolute bottom-4 left-6 w-10 h-10 rounded-full bg-gradient-to-tr from-neon-amber to-neon-orange shadow-[0_0_20px_rgba(255,138,61,0.7)] animate-float" />

            <div className="absolute top-1/2 left-0 w-6 h-6 rounded-full bg-gradient-to-tr from-neon-pink to-purple-400 shadow-[0_0_15px_rgba(255,42,133,0.8)]" />

            {/* Comets / Shooting Stars with glowing trails (from Image 3 & 4) */}
            <div className="absolute top-8 left-16 w-16 h-1 bg-gradient-to-r from-transparent via-neon-cyan to-white rotate-[35deg] rounded-full opacity-80" />
            <div className="absolute bottom-16 right-8 w-20 h-1.5 bg-gradient-to-r from-transparent via-neon-pink to-white rotate-[-25deg] rounded-full opacity-75" />

          </div>

        </div>

      </div>

      {/* 4 Glowing Circular Feature Steps (from Reference Image 1) */}
      <div className="mt-16 pt-10 border-t border-neon-purple/20">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Steps away from exploring your cosmic neighborhood!
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            We exist to make NASA/JPL planetary data easy, transparent, and exciting to explore.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-3 group cursor-pointer" onClick={onExploreApproaches}>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full glowing-circle-step flex items-center justify-center">
              <Compass className="w-8 h-8 sm:w-10 sm:h-10 text-neon-cyan group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-neon-cyan transition-colors">
                Live CAD Discovery
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                Explore upcoming close approaches in Lunar Distances (LD).
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-3 group cursor-pointer" onClick={() => onQuickSelect('99942')}>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full glowing-circle-step flex items-center justify-center">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-neon-pink group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-neon-pink transition-colors">
                Keplerian Parameters
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                Inspect asteroid size, eccentricity, and 1-σ uncertainty.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-3 group cursor-pointer" onClick={onOpenOrbitView}>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full glowing-circle-step flex items-center justify-center">
              <Orbit className="w-8 h-8 sm:w-10 sm:h-10 text-neon-amber group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-neon-amber transition-colors">
                3D Orbit Simulator
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                Interactive heliocentric ephemeris vector playback.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center space-y-3 group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full glowing-circle-step flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-emerald-400 transition-colors">
                Planetary Defense
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                Educational, evidence-backed science without false panic.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
