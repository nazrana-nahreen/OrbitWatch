import React, { useState, useEffect } from 'react';
import { AsteroidDetail, CloseApproachResponse } from '../types';
import { apiClient } from '../api/client';
import { X, ExternalLink, Orbit, Calendar, Info, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';

interface AsteroidDetailModalProps {
  designation: string | null;
  onClose: () => void;
  onVisualizeOrbit: (designation: string) => void;
}

export const AsteroidDetailModal: React.FC<AsteroidDetailModalProps> = ({
  designation,
  onClose,
  onVisualizeOrbit
}) => {
  const [detail, setDetail] = useState<AsteroidDetail | null>(null);
  const [approaches, setApproaches] = useState<CloseApproachResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'elements' | 'physics' | 'history'>('elements');

  useEffect(() => {
    if (!designation) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    Promise.all([
      apiClient.getAsteroidDetail(designation),
      apiClient.getObjectCloseApproaches(designation, 10).catch(() => null)
    ])
      .then(([det, app]) => {
        if (!isMounted) return;
        setDetail(det);
        setApproaches(app);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.response?.data?.detail || 'Failed to load asteroid detail from NASA JPL.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [designation]);

  if (!designation) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-3xl cosmic-card border-neon-purple/50 shadow-[0_0_60px_rgba(176,87,252,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-neon-purple/20 bg-space-950/90 flex items-start justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40">
                SPK-ID: {detail?.spkid || '...'}
              </span>
              {detail?.orbit_class && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-neon-purple/20 text-neon-purple border border-neon-purple/40">
                  {detail.orbit_class.name} ({detail.orbit_class.code})
                </span>
              )}
              {detail?.pha && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-neon-pink/20 text-neon-pink border border-neon-pink/40 shadow-[0_0_10px_rgba(255,42,133,0.4)] flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>PHA Monitored</span>
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              {detail ? detail.fullname : designation}
            </h2>
            <p className="text-xs text-slate-300">
              NASA JPL Small-Body Database (SBDB) Record • Orbit Solution ID: #{detail?.condition_code !== undefined ? detail?.data_arc_days : 'N/A'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-space-850 hover:bg-space-700 text-slate-300 hover:text-white border border-neon-purple/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
          {loading ? (
            <div className="p-16 text-center text-slate-400">
              <Orbit className="w-10 h-10 mx-auto text-neon-pink animate-spin mb-3" />
              <p className="text-sm font-semibold">Querying NASA JPL Small-Body Database for {designation}...</p>
            </div>
          ) : error ? (
            <div className="p-8 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-center">
              <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-neon-coral" />
              <p className="font-bold text-sm">{error}</p>
            </div>
          ) : detail ? (
            <>
              {/* Quick Scientific Highlight Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-space-950/70 border border-neon-purple/30">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Near-Earth Object</div>
                  <div className="text-lg font-extrabold text-white mt-1 font-display">
                    {detail.neo ? 'Yes (NEO)' : 'No'}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-space-950/70 border border-neon-purple/30">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Observation Arc</div>
                  <div className="text-lg font-extrabold text-neon-cyan mt-1 font-mono">
                    {detail.data_arc_days ? `${detail.data_arc_days}d` : 'N/A'}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-space-950/70 border border-neon-purple/30">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Condition Code (U)</div>
                  <div className="text-lg font-extrabold text-neon-amber mt-1 font-mono">
                    {detail.condition_code !== 'None' ? detail.condition_code : '0'} 
                    <span className="text-[11px] text-slate-400 font-normal ml-1">
                      {detail.condition_code === '0' ? '(High Certainty)' : '(Rating)'}
                    </span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-space-950/70 border border-neon-purple/30">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Epoch (JD)</div>
                  <div className="text-lg font-extrabold text-slate-200 mt-1 font-mono">
                    {detail.epoch_jd ? detail.epoch_jd.toFixed(1) : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Tabs for Elements / Physics / History */}
              <div className="border-b border-neon-purple/20 flex space-x-6">
                <button
                  onClick={() => setActiveTab('elements')}
                  className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all font-display ${
                    activeTab === 'elements'
                      ? 'border-neon-pink text-neon-pink'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Keplerian Orbital Elements ({detail.elements.length})
                </button>
                <button
                  onClick={() => setActiveTab('physics')}
                  className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all font-display ${
                    activeTab === 'physics'
                      ? 'border-neon-pink text-neon-pink'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Physical Parameters ({detail.physical_parameters.length})
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all font-display ${
                    activeTab === 'history'
                      ? 'border-neon-pink text-neon-pink'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Close Approaches ({approaches?.items.length || 0})
                </button>
              </div>

              {/* Tab 1: Orbital Elements */}
              {activeTab === 'elements' && (
                <div className="rounded-2xl border border-neon-purple/30 overflow-hidden bg-space-950/60">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-space-900 font-mono text-[11px] text-neon-purple uppercase">
                      <tr>
                        <th className="py-3 px-4">Parameter</th>
                        <th className="py-3 px-4">Symbol</th>
                        <th className="py-3 px-4">Value</th>
                        <th className="py-3 px-4">Units</th>
                        <th className="py-3 px-4">1-σ Uncertainty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neon-purple/15 font-sans">
                      {detail.elements.map((el) => (
                        <tr key={el.name} className="hover:bg-space-850/50">
                          <td className="py-3 px-4 text-slate-200 font-semibold">
                            {el.title || el.name}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-neon-cyan">
                            {el.name}
                          </td>
                          <td className="py-3 px-4 font-mono text-white font-extrabold text-sm">
                            {el.value !== null ? el.value : el.raw_value}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-400">
                            {el.units || '—'}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-400 text-xs">
                            {el.sigma ? `± ${el.sigma}` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 2: Physical Parameters */}
              {activeTab === 'physics' && (
                <div className="space-y-3">
                  {detail.physical_parameters.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">
                      No physical parameters currently published in SBDB for this object.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {detail.physical_parameters.map((p) => (
                        <div key={p.name} className="p-4 rounded-2xl bg-space-950/70 border border-neon-purple/30">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-bold uppercase">{p.title || p.name}</span>
                            <span className="font-mono text-xs font-bold text-neon-pink">[{p.name}]</span>
                          </div>
                          <div className="text-xl font-extrabold text-white mt-1.5 font-mono">
                            {p.value} {p.units || ''}
                          </div>
                          {p.desc && (
                            <p className="text-xs text-slate-300 mt-1">{p.desc}</p>
                          )}
                          {p.sigma && (
                            <p className="text-[11px] text-slate-400 font-mono mt-1">Uncertainty: ± {p.sigma}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Close Approaches History */}
              {activeTab === 'history' && (
                <div className="rounded-2xl border border-neon-purple/30 overflow-hidden bg-space-950/60">
                  {approaches && approaches.items.length > 0 ? (
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-space-900 font-mono text-[11px] text-neon-purple uppercase">
                        <tr>
                          <th className="py-3 px-4">Date (UTC)</th>
                          <th className="py-3 px-4">Nominal Distance</th>
                          <th className="py-3 px-4">Min Distance</th>
                          <th className="py-3 px-4">Relative Velocity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neon-purple/15 font-sans">
                        {approaches.items.map((app, idx) => (
                          <tr key={idx} className="hover:bg-space-850/50">
                            <td className="py-3 px-4 font-mono text-slate-200">
                              {app.approach_date}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-neon-cyan">
                              {app.dist_ld.toFixed(2)} LD <span className="text-slate-400 font-normal">({app.dist_au.toFixed(4)} AU)</span>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-300">
                              {app.dist_min_ld ? `${app.dist_min_ld.toFixed(2)} LD` : '—'}
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-300 font-semibold">
                              {app.v_rel_km_s.toFixed(2)} km/s
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-sm">
                      No published close approaches found in CAD records for this designation.
                    </div>
                  )}
                </div>
              )}

              {/* Provenance and Disclaimer Note */}
              <div className="p-4 rounded-2xl bg-space-950/80 border border-neon-purple/30 flex items-start space-x-3 text-xs text-slate-300">
                <Info className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
                <div>
                  <p>
                    <strong>Data Provenance:</strong> {detail.provenance_note}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Observation Arc: {detail.first_obs} to {detail.last_obs} (RMS residual: {detail.rms_residual}).
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 sm:p-6 border-t border-neon-purple/20 bg-space-950/90 flex flex-wrap items-center justify-between gap-4">
          {detail && (
            <a
              href={detail.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs text-neon-cyan hover:text-white font-bold"
            >
              <span>View Official NASA SBDB Record</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <div className="flex items-center space-x-3 ml-auto">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-space-850 hover:bg-space-700 text-slate-300 text-xs font-bold border border-neon-purple/30"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onVisualizeOrbit(designation);
              }}
              className="btn-neon-glow px-6 py-2.5 rounded-full text-xs font-bold flex items-center space-x-2 shadow-lg"
            >
              <Orbit className="w-4 h-4" />
              <span>Visualize Orbit in 3D</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
