import React from 'react';
import { CloseApproachItem } from '../types';
import { ShieldAlert, Compass, Calendar, Gauge, ArrowUpDown, Eye, Orbit, Filter, Sparkles, CheckCircle2 } from 'lucide-react';

interface CloseApproachDashboardProps {
  items: CloseApproachItem[];
  isLoading: boolean;
  onSelectAsteroid: (designation: string) => void;
  onVisualizeOrbit: (designation: string) => void;
  filters: {
    date_range: string;
    dist_max_ld: number;
    pha_only: boolean;
    sort: 'date' | 'dist';
  };
  onUpdateFilters: (newFilters: any) => void;
}

export const CloseApproachDashboard: React.FC<CloseApproachDashboardProps> = ({
  items,
  isLoading,
  onSelectAsteroid,
  onVisualizeOrbit,
  filters,
  onUpdateFilters
}) => {
  const closestItem = items.length > 0 
    ? items.reduce((min, cur) => cur.dist_ld < min.dist_ld ? cur : min, items[0]) 
    : null;

  const fastestItem = items.length > 0 
    ? items.reduce((max, cur) => cur.v_rel_km_s > max.v_rel_km_s ? cur : max, items[0]) 
    : null;

  const phaCount = items.filter(i => i.pha).length;

  return (
    <div className="space-y-8">
      
      {/* Top Banner with Colorful Cosmic Wave Styling */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl cosmic-card border-neon-purple/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-neon-pink/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-neon-cyan/15 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/40 text-neon-pink text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NASA CNEOS ACTIVE TELEMETRY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Upcoming Near-Earth Encounters
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Track the exact orbital timing and flyby parameters of asteroids passing within Earth's orbital neighborhood. Distances are expressed in <strong className="text-neon-cyan">Lunar Distances (1 LD ≈ 384,400 km)</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs cosmic-card px-4 py-3 rounded-2xl border-neon-cyan/30 text-slate-200 shadow-lg">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-white">Scientific Clearance</div>
              <span className="text-slate-300 text-[11px]">
                No tracked objects present an imminent impact threat to Earth.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards with Glowing Circular Icons (Image 1 & 2 inspired) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Tracked Objects */}
        <div className="p-5 rounded-2xl cosmic-card cosmic-card-hover border-neon-cyan/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tracked Objects</span>
            <div className="w-10 h-10 rounded-full bg-neon-cyan/15 border border-neon-cyan/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Compass className="w-5 h-5 text-neon-cyan" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              {isLoading ? '...' : items.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Within selected parameters</div>
          </div>
        </div>

        {/* Closest Approach */}
        <div className="p-5 rounded-2xl cosmic-card cosmic-card-hover border-neon-amber/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Closest Flyby</span>
            <div className="w-10 h-10 rounded-full bg-neon-amber/15 border border-neon-amber/40 flex items-center justify-center shadow-[0_0_15px_rgba(255,190,26,0.3)]">
              <Calendar className="w-5 h-5 text-neon-amber" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-neon-amber font-display tracking-tight">
              {closestItem ? `${closestItem.dist_ld.toFixed(2)} LD` : '—'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate font-mono">
              {closestItem ? `${closestItem.designation} (${(closestItem.dist_au * 149597870.7 / 1000).toLocaleString('en-US', {maximumFractionDigits: 0})}k km)` : 'No records'}
            </div>
          </div>
        </div>

        {/* Highest Relative Velocity */}
        <div className="p-5 rounded-2xl cosmic-card cosmic-card-hover border-neon-coral/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Peak Velocity</span>
            <div className="w-10 h-10 rounded-full bg-neon-coral/15 border border-neon-coral/40 flex items-center justify-center shadow-[0_0_15px_rgba(255,92,106,0.3)]">
              <Gauge className="w-5 h-5 text-neon-coral" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-neon-coral font-display tracking-tight">
              {fastestItem ? `${fastestItem.v_rel_km_s.toFixed(1)} km/s` : '—'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate font-mono">
              {fastestItem ? `${fastestItem.designation} (${(fastestItem.v_rel_km_s * 3600).toLocaleString('en-US', {maximumFractionDigits: 0})} km/h)` : 'No records'}
            </div>
          </div>
        </div>

        {/* Potentially Hazardous Monitored */}
        <div className="p-5 rounded-2xl cosmic-card cosmic-card-hover border-neon-pink/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Monitored PHAs</span>
            <div className="w-10 h-10 rounded-full bg-neon-pink/15 border border-neon-pink/40 flex items-center justify-center shadow-[0_0_15px_rgba(255,42,133,0.3)]">
              <ShieldAlert className="w-5 h-5 text-neon-pink" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-neon-pink font-display tracking-tight">
              {isLoading ? '...' : phaCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Earth MOID &lt; 0.05 AU &amp; H ≤ 22</div>
          </div>
        </div>

      </div>

      {/* Filter and Control Bar (Pill buttons inspired by Image 2 & 3) */}
      <div className="p-4 sm:p-5 rounded-2xl cosmic-card border-neon-purple/30 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-bold uppercase tracking-wider">
            <Filter className="w-4 h-4 text-neon-pink" />
            <span>Timeframe:</span>
          </div>
          
          <div className="inline-flex rounded-full bg-space-900 p-1 border border-neon-purple/30 text-xs shadow-inner">
            {[
              { id: '+7', label: '7 Days' },
              { id: '+30', label: '30 Days' },
              { id: '+90', label: '90 Days' },
              { id: '+365', label: '1 Year' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => onUpdateFilters({ ...filters, date_range: tab.id })}
                className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
                  filters.date_range === tab.id
                    ? 'btn-neon-glow shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="h-5 w-[1px] bg-neon-purple/30 hidden sm:block"></div>

          {/* Distance Dropdown Filter */}
          <div className="flex items-center space-x-2 text-xs text-slate-300 font-medium">
            <span>Distance Limit:</span>
            <select
              value={filters.dist_max_ld}
              onChange={(e) => onUpdateFilters({ ...filters, dist_max_ld: Number(e.target.value) })}
              className="bg-space-900 border border-neon-purple/40 rounded-full px-3 py-1.5 text-white focus:outline-none focus:border-neon-pink text-xs font-semibold shadow-inner"
            >
              <option value={5}>Within 5 LD (~1.9M km)</option>
              <option value={10}>Within 10 LD (~3.8M km)</option>
              <option value={20}>Within 20 LD (~7.7M km)</option>
              <option value={50}>Within 50 LD (~19.2M km)</option>
            </select>
          </div>
        </div>

        {/* Right side toggles: PHA Only & Sort */}
        <div className="flex items-center space-x-4 text-xs font-semibold">
          <label className="flex items-center space-x-2 cursor-pointer select-none px-3 py-1.5 rounded-full bg-space-900/80 border border-neon-purple/30">
            <input
              type="checkbox"
              checked={filters.pha_only}
              onChange={(e) => onUpdateFilters({ ...filters, pha_only: e.target.checked })}
              className="rounded bg-space-850 border-neon-pink text-neon-pink focus:ring-0 focus:ring-offset-0"
            />
            <span className="text-slate-200">PHA Only</span>
          </label>

          <button
            onClick={() => onUpdateFilters({ ...filters, sort: filters.sort === 'date' ? 'dist' : 'date' })}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-space-900 border border-neon-purple/40 text-slate-200 hover:text-white hover:border-neon-pink transition-all"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-neon-cyan" />
            <span>Sort: {filters.sort === 'date' ? 'Date' : 'Distance'}</span>
          </button>
        </div>

      </div>

      {/* Main List Table with Rich Gradients */}
      <div className="rounded-3xl cosmic-card border-neon-purple/30 overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="p-16 text-center text-slate-400">
            <Orbit className="w-10 h-10 mx-auto text-neon-pink animate-spin mb-3" />
            <p className="text-sm font-semibold">Fetching live telemetry from NASA JPL Small-Body Database...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Compass className="w-10 h-10 mx-auto text-slate-600 mb-3" />
            <p className="text-base font-bold text-white">No asteroids found for this filter criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try expanding the date window or increasing the distance limit.</p>
            <button
              onClick={() => onUpdateFilters({ date_range: '+30', dist_max_ld: 20, pha_only: false, sort: 'date' })}
              className="mt-4 btn-neon-glow px-4 py-2 rounded-full text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-neon-purple/20 bg-space-950/80 text-neon-purple font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-4 px-5">Asteroid / Designation</th>
                  <th className="py-4 px-5">Approach Date (UTC)</th>
                  <th className="py-4 px-5">Miss Distance</th>
                  <th className="py-4 px-5">Relative Velocity</th>
                  <th className="py-4 px-5">Magnitude (H)</th>
                  <th className="py-4 px-5">Classification</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neon-purple/15 font-sans">
                {items.map((item, idx) => {
                  const distProgress = Math.min(100, (item.dist_ld / 20) * 100);
                  const isVeryClose = item.dist_ld < 2.0;

                  return (
                    <tr
                      key={`${item.designation}-${item.approach_date}-${idx}`}
                      className="hover:bg-space-850/60 transition-colors group"
                    >
                      {/* Name / Designation */}
                      <td className="py-4 px-5">
                        <div className="font-extrabold text-white text-base group-hover:text-neon-pink transition-colors font-display">
                          {item.designation}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Orbit sol #{item.orbit_id || 'N/A'}
                        </div>
                      </td>

                      {/* Approach Date */}
                      <td className="py-4 px-5 font-mono text-slate-200">
                        {item.approach_date}
                      </td>

                      {/* Miss Distance */}
                      <td className="py-4 px-5">
                        <div className="flex items-center space-x-2">
                          <span className={`font-mono font-bold text-sm ${
                            isVeryClose ? 'text-neon-amber' : 'text-neon-cyan'
                          }`}>
                            {item.dist_ld.toFixed(2)} LD
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            ({item.dist_au.toFixed(4)} AU)
                          </span>
                        </div>
                        <div className="w-32 bg-space-950 rounded-full h-2 mt-1.5 overflow-hidden border border-neon-purple/20">
                          <div
                            className={`h-full rounded-full ${
                              isVeryClose 
                                ? 'bg-gradient-to-r from-neon-amber to-neon-pink shadow-[0_0_10px_#ffbe1a]' 
                                : 'bg-gradient-to-r from-neon-teal to-neon-cyan shadow-[0_0_10px_#06b6d4]'
                            }`}
                            style={{ width: `${distProgress}%` }}
                          />
                        </div>
                      </td>

                      {/* Velocity */}
                      <td className="py-4 px-5 font-mono text-slate-200 font-semibold">
                        {item.v_rel_km_s.toFixed(2)} km/s
                      </td>

                      {/* Magnitude H */}
                      <td className="py-4 px-5 font-mono text-slate-400">
                        {item.h_mag !== null && item.h_mag !== undefined ? item.h_mag.toFixed(1) : '—'}
                      </td>

                      {/* Classification Badges */}
                      <td className="py-4 px-5">
                        {item.pha ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-neon-pink/20 text-neon-pink border border-neon-pink/40 shadow-[0_0_10px_rgba(255,42,133,0.3)]">
                            PHA Monitored
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-space-850 text-slate-300 border border-neon-purple/30">
                            NEO
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center space-x-2">
                          <button
                            onClick={() => onSelectAsteroid(item.designation)}
                            className="p-2 rounded-xl bg-space-850 hover:bg-space-700 text-slate-300 hover:text-white border border-neon-purple/30 transition-colors shadow-sm"
                            title="Inspect Object Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onVisualizeOrbit(item.designation)}
                            className="p-2 rounded-xl bg-gradient-to-r from-neon-pink/20 to-neon-purple/20 hover:from-neon-pink/40 hover:to-neon-purple/40 text-neon-pink hover:text-white border border-neon-pink/40 transition-colors shadow-sm"
                            title="Plot Orbit in 3D"
                          >
                            <Orbit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
