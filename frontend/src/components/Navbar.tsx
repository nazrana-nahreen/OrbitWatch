import React from 'react';
import { Compass, Orbit, BookOpen, Search, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'orbit' | 'glossary';
  setActiveTab: (tab: 'dashboard' | 'orbit' | 'glossary') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isBackendHealthy: boolean | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onSearch,
  isBackendHealthy
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-space-950/85 border-b border-neon-purple/20 shadow-xl shadow-space-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo with Glowing Rocket/Orbit Motif */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-neon-pink via-neon-purple to-neon-cyan p-0.5 shadow-lg shadow-neon-pink/30 group-hover:shadow-neon-pink/60 transition-shadow">
              <div className="w-full h-full bg-space-950 rounded-[14px] flex items-center justify-center">
                <Orbit className="w-5 h-5 sm:w-6 sm:h-6 text-neon-pink group-hover:rotate-45 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight font-display text-white">
                  OrbitWatch <span className="text-[11px] px-2 py-0.5 rounded-full bg-gradient-to-r from-neon-pink to-neon-orange text-white font-bold font-mono">AI</span>
                </span>
              </div>
              <p className="text-[10px] text-neon-cyan font-mono tracking-widest uppercase">NASA / JPL CELESTIAL RADAR</p>
            </div>
          </div>

          {/* Quick Search Input */}
          <form onSubmit={onSearch} className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-purple" />
              <input
                type="text"
                placeholder="Search asteroid (e.g. Apophis, 99942, Bennu)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-16 py-2 rounded-full bg-space-900/90 border border-neon-purple/30 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/20 font-sans transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-[11px] font-bold bg-neon-purple/30 hover:bg-neon-pink text-white transition-colors"
              >
                GO
              </button>
            </div>
          </form>

          {/* Navigation Tabs - Pill Shaped with Glowing Accents */}
          <nav className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'btn-neon-glow font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-space-800/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Close Passes</span>
            </button>

            <button
              onClick={() => setActiveTab('orbit')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'orbit'
                  ? 'btn-neon-glow font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-space-800/60'
              }`}
            >
              <Orbit className="w-4 h-4" />
              <span>3D Orbit</span>
            </button>

            <button
              onClick={() => setActiveTab('glossary')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'glossary'
                  ? 'btn-neon-glow font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-space-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Guide</span>
            </button>
          </nav>

          {/* NASA Live Status Indicator */}
          <div className="hidden xl:flex items-center space-x-2 pl-3 border-l border-neon-purple/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isBackendHealthy ? 'bg-emerald-400' : 'bg-neon-amber'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isBackendHealthy ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-neon-amber shadow-[0_0_10px_#f59e0b]'
              }`}></span>
            </span>
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-300">
              {isBackendHealthy ? 'NASA LIVE' : 'CONNECTING'}
            </span>
          </div>

        </div>
      </div>
    </header>
  );
};
