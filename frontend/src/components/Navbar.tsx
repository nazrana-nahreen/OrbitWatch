import React from 'react';
import { Compass, Orbit, BookOpen, AlertCircle, Activity, Search } from 'lucide-react';

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
    <header className="sticky top-0 z-40 backdrop-blur-md bg-space-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-sky-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-space-950 rounded-[10px] flex items-center justify-center">
                <Orbit className="w-5 h-5 text-sky-400 animate-spin-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-400 bg-clip-text text-transparent">
                  OrbitWatch <span className="text-xs px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 font-mono">AI</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">NASA / JPL ASTEROID EXPLORER</p>
            </div>
          </div>

          {/* Quick Search Input */}
          <form onSubmit={onSearch} className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search asteroid (e.g. Apophis, 99942, Bennu, 2024 YR4)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-sans"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                ↵
              </button>
            </div>
          </form>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-sm shadow-sky-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Close Approaches</span>
            </button>

            <button
              onClick={() => setActiveTab('orbit')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'orbit'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-sm shadow-sky-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Orbit className="w-4 h-4" />
              <span>3D Orbit View</span>
            </button>

            <button
              onClick={() => setActiveTab('glossary')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'glossary'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-sm shadow-sky-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Glossary</span>
            </button>
          </nav>

          {/* NASA Live Status Indicator */}
          <div className="hidden lg:flex items-center space-x-2 pl-3 border-l border-slate-800">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isBackendHealthy ? 'bg-emerald-400' : 'bg-amber-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isBackendHealthy ? 'bg-emerald-500' : 'bg-amber-500'
              }`}></span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {isBackendHealthy ? 'NASA LIVE' : 'CONNECTING'}
            </span>
          </div>

        </div>
      </div>
    </header>
  );
};
