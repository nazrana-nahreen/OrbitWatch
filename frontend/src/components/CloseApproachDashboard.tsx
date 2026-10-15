import React, { useState } from 'react';
import { CloseApproachItem } from '../types';
import { ShieldAlert, Compass, Calendar, Gauge, ArrowUpDown, Eye, Orbit, Filter, ExternalLink } from 'lucide-react';

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
  // Statistics calculations
  const closestItem = items.length > 0 
    ? items.reduce((min, cur) => cur.dist_ld < min.dist_ld ? cur : min, items[0]) 
    : null;

  const fastestItem = items.length > 0 
    ? items.reduce((max, cur) => cur.v_rel_km_s > max.v_rel_km_s ? cur : max, items[0]) 
    : null;

  const phaCount = items.filter(i => i.pha).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Science Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-purple-950/20 border border-sky-500/20 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-sky-500/20 text-sky-300 border border-sky-500/30">
                NASA/JPL CAD FEED
              </span>
              <span className="text-xs text-slate-400">Earth Close-Approach Observations</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Upcoming Near-Earth Asteroid Encounters
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Track real-time trajectories of asteroids scheduled to pass within our cosmic neighborhood. 
              Distances are measured in <span className="text-sky-300 font-medium">Lunar Distances (1 LD ≈ 384,400 km)</span>.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800 text-slate-300">
            <ShieldAlert className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Scientific Fact:</strong> None of these passing objects represent an imminent impact threat.
            </span>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Approaches */}
        <div className="p-4 rounded-xl card-glass border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Tracked Objects</span>
            <Compass className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-mono">
            {isLoading ? '...' : items.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Within selected parameters</div>
        </div>

        {/* Closest Approach */}
        <div className="p-4 rounded-xl card-glass border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Closest Pass</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-2 font-mono">
            {closestItem ? `${closestItem.dist_ld.toFixed(2)} LD` : '—'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">
            {closestItem ? `${closestItem.designation} (${(closestItem.dist_au * 149597870.7 / 1000).toLocaleString('en-US', {maximumFractionDigits: 0})}k km)` : 'No records'}
          </div>
        </div>

        {/* Highest Relative Velocity */}
        <div className="p-4 rounded-xl card-glass border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Peak Velocity</span>
            <Gauge className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-violet-300 mt-2 font-mono">
            {fastestItem ? `${fastestItem.v_rel_km_s.toFixed(1)} km/s` : '—'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">
            {fastestItem ? `${fastestItem.designation} (${(fastestItem.v_rel_km_s * 3600).toLocaleString('en-US', {maximumFractionDigits: 0})} km/h)` : 'No records'}
          </div>
        </div>

        {/* Potentially Hazardous Count */}
        <div className="p-4 rounded-xl card-glass border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Monitored PHAs</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-300 mt-2 font-mono">
            {isLoading ? '...' : phaCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Earth MOID &lt; 0.05 AU &amp; H ≤ 22</div>
        </div>

      </div>

      {/* Filter and Control Bar */}
      <div className="p-4 rounded-xl card-glass border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
            <Filter className="w-3.5 h-3.5 text-sky-400" />
            <span>Time Horizon:</span>
          </div>
          <div className="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-xs">
            {[
              { id: '+7', label: '7 Days' },
              { id: '+30', label: '30 Days' },
              { id: '+90', label: '90 Days' },
              { id: '+365', label: '1 Year' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => onUpdateFilters({ ...filters, date_range: tab.id })}
                className={`px-3 py-1 rounded-md transition-all ${
                  filters.date_range === tab.id
                    ? 'bg-sky-500/20 text-sky-300 font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>

          {/* Distance Filter */}
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>Max Distance:</span>
            <select
              value={filters.dist_max_ld}
              onChange={(e) => onUpdateFilters({ ...filters, dist_max_ld: Number(e.target.value) })}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value={5}>Within 5 LD (~1.9M km)</option>
              <option value={10}>Within 10 LD (~3.8M km)</option>
              <option value={20}>Within 20 LD (~7.7M km)</option>
              <option value={50}>Within 50 LD (~19.2M km)</option>
            </select>
          </div>
        </div>

        {/* Right side toggles: PHA Only & Sort */}
        <div className="flex items-center space-x-4 text-xs">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.pha_only}
              onChange={(e) => onUpdateFilters({ ...filters, pha_only: e.target.checked })}
              className="rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0 focus:ring-offset-0"
            />
            <span className="text-slate-300">PHA Only</span>
          </label>

          <button
            onClick={() => onUpdateFilters({ ...filters, sort: filters.sort === 'date' ? 'dist' : 'date' })}
            className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-sky-400" />
            <span>Sort: {filters.sort === 'date' ? 'Date' : 'Distance'}</span>
          </button>
        </div>

      </div>

      {/* Main List Table */}
      <div className="rounded-xl card-glass border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <Orbit className="w-8 h-8 mx-auto text-sky-400 animate-spin mb-3" />
            <p className="text-sm">Fetching real-time close approach data from NASA JPL...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Compass className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="text-sm">No asteroids match the current filter criteria.</p>
            <button
              onClick={() => onUpdateFilters({ date_range: '+30', dist_max_ld: 20, pha_only: false, sort: 'date' })}
              className="mt-3 px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 text-xs border border-sky-500/30"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/60 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Asteroid / Designation</th>
                  <th className="py-3 px-4">Approach Date (UTC)</th>
                  <th className="py-3 px-4">Miss Distance</th>
                  <th className="py-3 px-4">Relative Velocity</th>
                  <th className="py-3 px-4">Magnitude (H)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {items.map((item, idx) => {
                  const distProgress = Math.min(100, (item.dist_ld / 20) * 100);
                  const isVeryClose = item.dist_ld < 2.0;

                  return (
                    <tr
                      key={`${item.designation}-${item.approach_date}-${idx}`}
                      className="hover:bg-slate-900/50 transition-colors group"
                    >
                      {/* Name / Designation */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white group-hover:text-sky-300 transition-colors">
                          {item.designation}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Orbit sol #{item.orbit_id || 'N/A'}
                        </div>
                      </td>

                      {/* Approach Date */}
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {item.approach_date}
                      </td>

                      {/* Miss Distance */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span className={`font-mono font-bold ${
                            isVeryClose ? 'text-amber-400' : 'text-slate-200'
                          }`}>
                            {item.dist_ld.toFixed(2)} LD
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            ({item.dist_au.toFixed(4)} AU)
                          </span>
                        </div>
                        <div className="w-28 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isVeryClose ? 'bg-amber-400' : 'bg-sky-400'
                            }`}
                            style={{ width: `${distProgress}%` }}
                          />
                        </div>
                      </td>

                      {/* Velocity */}
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {item.v_rel_km_s.toFixed(2)} km/s
                      </td>

                      {/* Magnitude H */}
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {item.h_mag !== null && item.h_mag !== undefined ? item.h_mag.toFixed(1) : '—'}
                      </td>

                      {/* Status / Badges */}
                      <td className="py-3.5 px-4">
                        {item.pha ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            PHA Monitored
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                            NEO
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          <button
                            onClick={() => onSelectAsteroid(item.designation)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Inspect Object Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onVisualizeOrbit(item.designation)}
                            className="p-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 hover:text-sky-200 border border-sky-500/30 transition-colors"
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
