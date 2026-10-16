import React from 'react';
import { Orbit, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-24 border-t border-neon-purple/20 bg-space-950/90 text-xs text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-neon-pink to-neon-purple p-0.5 flex items-center justify-center shadow-lg shadow-neon-pink/30">
              <div className="w-full h-full bg-space-950 rounded-[10px] flex items-center justify-center">
                <Orbit className="w-4 h-4 text-neon-pink" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-white text-base font-display">OrbitWatch AI</span>
              <p className="text-[11px] text-slate-400">Open Space Science &amp; Asteroid Explorer</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
            <a
              href="https://ssd-api.jpl.nasa.gov/doc/sbdb.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-neon-cyan flex items-center space-x-1.5 transition-colors"
            >
              <span>NASA SBDB API</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://ssd-api.jpl.nasa.gov/doc/cad.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-neon-pink flex items-center space-x-1.5 transition-colors"
            >
              <span>NASA CAD API</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://ssd.jpl.nasa.gov/horizons/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-neon-amber flex items-center space-x-1.5 transition-colors"
            >
              <span>JPL Horizons System</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="border-t border-neon-purple/15 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            Disclaimer: OrbitWatch AI is an educational planetary astronomy application. It is not an official emergency warning system. Telemetry sourced from NASA/JPL CNEOS services.
          </p>
          <div className="flex items-center space-x-1 text-slate-400 flex-shrink-0">
            <span>Built for open space science literacy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
