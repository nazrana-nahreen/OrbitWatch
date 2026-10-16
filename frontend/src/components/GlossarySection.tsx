import React, { useState, useEffect } from 'react';
import { GlossaryTerm } from '../types';
import { apiClient } from '../api/client';
import { BookOpen, HelpCircle, AlertOctagon, ExternalLink, Sparkles } from 'lucide-react';

export const GlossarySection: React.FC = () => {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [disclaimer, setDisclaimer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([apiClient.getGlossary(), apiClient.getDisclaimer()])
      .then(([g, d]) => {
        setTerms(g);
        setDisclaimer(d);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/40 text-neon-pink text-xs font-bold font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          <span>ASTRONOMY &amp; PLANETARY DEFENSE GUIDE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
          Asteroid Tracking &amp; Orbital Mechanics
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Demystifying the mathematical parameters, coordinate frames, and planetary risk indicators published by NASA/JPL.
        </p>
      </div>

      {/* Official Disclaimer Banner with Amber Neon Glow */}
      {disclaimer && (
        <div className="p-6 sm:p-7 rounded-3xl cosmic-card border-neon-amber/40 shadow-[0_0_30px_rgba(255,190,26,0.15)] text-amber-200 space-y-3">
          <div className="flex items-center space-x-2.5 text-neon-amber font-extrabold text-base font-display">
            <AlertOctagon className="w-5 h-5 flex-shrink-0" />
            <span>{disclaimer.title} ({disclaimer.title_bn})</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            {disclaimer.text}
          </p>
          <p className="text-xs sm:text-sm text-amber-300/90 leading-relaxed font-sans">
            {disclaimer.text_bn}
          </p>
          <div className="pt-2">
            <a
              href="https://cneos.jpl.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs text-neon-amber hover:text-white underline font-bold"
            >
              <span>Visit NASA Center for Near-Earth Object Studies (CNEOS)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Glossary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {terms.map((item) => (
          <div
            key={item.term}
            className="p-6 rounded-3xl cosmic-card cosmic-card-hover border-neon-purple/30 space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-white font-display">
                    {item.term}
                  </h3>
                  <div className="text-xs text-neon-cyan font-bold mt-0.5">
                    {item.label_bn}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-neon-purple" />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                {item.definition}
              </p>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-neon-purple/20 text-xs">
              <div>
                <span className="font-bold text-slate-400">Scientific Importance: </span>
                <span className="text-slate-200">{item.importance}</span>
              </div>
              {item.misconception && (
                <div className="p-3 rounded-2xl bg-rose-950/30 border border-neon-pink/30 text-rose-200 leading-relaxed">
                  <strong className="text-neon-pink font-bold">Common Misconception: </strong>
                  <span>{item.misconception}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
