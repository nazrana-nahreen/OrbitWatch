import React from 'react';
import { Orbit, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-space-950/80 text-xs text-slate-500 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Orbit className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-slate-300">OrbitWatch AI</span>
            <span>• Portfolio &amp; Educational Science Project</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <a
              href="https://ssd-api.jpl.nasa.gov/doc/sbdb.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 flex items-center space-x-1"
            >
              <span>NASA SBDB API</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://ssd-api.jpl.nasa.gov/doc/cad.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 flex items-center space-x-1"
            >
              <span>NASA CAD API</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://ssd.jpl.nasa.gov/horizons/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 flex items-center space-x-1"
            >
              <span>JPL Horizons System</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 border-t border-slate-900 pt-3">
          Disclaimer: OrbitWatch AI is an educational astronomy explorer. It is not an official planetary defense service or impact warning system. Data sourced from NASA JPL Small-Body Database and Horizons ephemeris computation services.
        </p>
      </div>
    </footer>
  );
};
