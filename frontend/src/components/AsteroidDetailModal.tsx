import React, { useState, useEffect } from 'react';
import { AsteroidDetail, CloseApproachResponse } from '../types';
import { apiClient } from '../api/client';
import { X, ExternalLink, Orbit, Calendar, Info, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-2xl bg-space-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-space-950/90 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-sky-500/20 text-sky-300 border border-sky-500/30">
                SPK-ID: {detail?.spkid || '...'}
              </span>
              {detail?.orbit_class && (
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {detail.orbit_class.name} ({detail.orbit_class.code})
                </span>
              )}
              {detail?.pha && (
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
                  <ShieldAlert className="w-3 h-3" />
                  <span>PHA Monitored</span>
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {detail ? detail.fullname : designation}
            </h2>
            <p className="text-xs text-slate-400">
              NASA JPL Small-Body Database (SBDB) Record • Orbit Solution ID: #{detail?.condition_code !== undefined ? detail?.data_arc_days : 'N/A'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {loading ? (
            <div className="p-16 text-center text-slate-400">
              <Orbit className="w-8 h-8 mx-auto text-sky-400 animate-spin mb-3" />
              <p className="text-sm">Querying NASA JPL Small-Body Database for {designation}...</p>
            </div>
          ) : error ? (
            <div className="p-8 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300 text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-rose-400" />
              <p className="font-medium text-sm">{error}</p>
            </div>
          ) : detail ? (
            <>
              {/* Quick Scientific Highlight Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">Near-Earth Object</div>
                  <div className="text-base font-bold text-white mt-1">
                    {detail.neo ? 'Yes (NEO)' : 'No'}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">Observation Arc</div>
                  <div className="text-base font-bold text-sky-300 mt-1 font-mono">
                    {detail.data_arc_days ? `${detail.data_arc_days} days` : 'N/A'}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">Condition Code (U)</div>
                  <div className="text-base font-bold text-amber-300 mt-1 font-mono">
                    {detail.condition_code !== 'None' ? detail.condition_code : '0'} 
                    <span className="text-[10px] text-slate-400 font-normal ml-1">
                      {detail.condition_code === '0' ? '(High certainty)' : '(Uncertainty rating)'}
                    </span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">Epoch (JD)</div>
                  <div className="text-base font-bold text-slate-200 mt-1 font-mono">
                    {detail.epoch_jd ? detail.epoch_jd.toFixed(1) : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Tabs for Elements / Physics / Close Approaches */}
              <div className="border-b border-slate-800 flex space-x-4">
                <button
                  onClick={() => setActiveTab('elements')}
                  className={`pb-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all ${
                    activeTab === 'elements'
                      ? 'border-sky-400 text-sky-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Keplerian Orbital Elements ({detail.elements.length})
                </button>
                <button
                  onClick={() => setActiveTab('physics')}
                  className={`pb-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all ${
                    activeTab === 'physics'
                      ? 'border-sky-400 text-sky-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Physical Parameters ({detail.physical_parameters.length})
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`pb-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all ${
                    activeTab === 'history'
                      ? 'border-sky-400 text-sky-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Close Approaches Record ({approaches?.items.length || 0})
                </button>
              </div>

              {/* Tab 1: Orbital Elements */}
              {activeTab === 'elements' && (
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-950/80 font-mono text-[11px] text-slate-400 uppercase">
                      <tr>
                        <th className="py-2.5 px-4">Parameter</th>
                        <th className="py-2.5 px-4">Symbol</th>
                        <th className="py-2.5 px-4">Value</th>
                        <th className="py-2.5 px-4">Units</th>
                        <th className="py-2.5 px-4">1-σ Uncertainty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {detail.elements.map((el) => (
                        <tr key={el.name} className="hover:bg-slate-950/40">
                          <td className="py-2.5 px-4 text-slate-300 font-medium">
                            {el.title || el.name}
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-sky-300">
                            {el.name}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-white font-semibold">
                            {el.value !== null ? el.value : el.raw_value}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-slate-400">
                            {el.units || '—'}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-slate-400 text-xs">
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
                    <div className="p-8 text-center text-slate-500 text-sm">
                      No physical parameters currently published in SBDB for this object.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {detail.physical_parameters.map((p) => (
                        <div key={p.name} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">{p.title || p.name}</span>
                            <span className="font-mono text-xs font-bold text-sky-400">[{p.name}]</span>
                          </div>
                          <div className="text-lg font-bold text-white mt-1 font-mono">
                            {p.value} {p.units || ''}
                          </div>
                          {p.desc && (
                            <p className="text-[11px] text-slate-400 mt-1">{p.desc}</p>
                          )}
                          {p.sigma && (
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Uncertainty: ± {p.sigma}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Close Approaches History */}
              {activeTab === 'history' && (
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  {approaches && approaches.items.length > 0 ? (
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-950/80 font-mono text-[11px] text-slate-400 uppercase">
                        <tr>
                          <th className="py-2.5 px-4">Date (UTC)</th>
                          <th className="py-2.5 px-4">Nominal Distance</th>
                          <th className="py-2.5 px-4">Min Distance</th>
                          <th className="py-2.5 px-4">Relative Velocity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-sans">
                        {approaches.items.map((app, idx) => (
                          <tr key={idx} className="hover:bg-slate-950/40">
                            <td className="py-2.5 px-4 font-mono text-slate-300">
                              {app.approach_date}
                            </td>
                            <td className="py-2.5 px-4 font-mono font-bold text-sky-300">
                              {app.dist_ld.toFixed(2)} LD <span className="text-slate-400 font-normal">({app.dist_au.toFixed(4)} AU)</span>
                            </td>
                            <td className="py-2.5 px-4 font-mono text-slate-300">
                              {app.dist_min_ld ? `${app.dist_min_ld.toFixed(2)} LD` : '—'}
                            </td>
                            <td className="py-2.5 px-4 font-mono text-slate-300">
                              {app.v_rel_km_s.toFixed(2)} km/s
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-slate-500 text-sm">
                      No published close approaches found in CAD records for this designation.
                    </div>
                  )}
                </div>
              )}

              {/* Provenance and Disclaimer Note */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start space-x-3 text-xs text-slate-400">
                <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p>
                    <strong>Data Provenance:</strong> {detail.provenance_note}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Observation Arc: {detail.first_obs} to {detail.last_obs} (RMS residual: {detail.rms_residual}).
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-space-950/90 flex flex-wrap items-center justify-between gap-3">
          {detail && (
            <a
              href={detail.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium"
            >
              <span>View Official NASA SBDB Record</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <div className="flex items-center space-x-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onVisualizeOrbit(designation);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-medium shadow-lg shadow-sky-500/20 flex items-center space-x-1.5"
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
