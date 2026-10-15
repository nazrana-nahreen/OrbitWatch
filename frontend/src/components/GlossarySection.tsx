import React, { useState, useEffect } from 'react';
import { GlossaryTerm } from '../types';
import { apiClient } from '../api/client';
import { BookOpen, HelpCircle, AlertOctagon, ExternalLink, ShieldCheck } from 'lucide-react';

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
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-medium">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Scientific Knowledge Base</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Asteroid Tracking &amp; Orbital Mechanics Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Understand the mathematical parameters, coordinate frames, and planetary defense terminology published by NASA/JPL.
        </p>
      </div>

      {/* Official Disclaimer Banner */}
      {disclaimer && (
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-200 space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-sm">
            <AlertOctagon className="w-4 h-4 flex-shrink-0" />
            <span>{disclaimer.title} ({disclaimer.title_bn})</span>
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            {disclaimer.text}
          </p>
          <p className="text-xs text-amber-300/80 leading-relaxed font-sans">
            {disclaimer.text_bn}
          </p>
          <div className="pt-2">
            <a
              href="https://cneos.jpl.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs text-amber-400 hover:text-amber-300 underline font-medium"
            >
              <span>Visit NASA Center for Near-Earth Object Studies (CNEOS)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Glossary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {terms.map((item) => (
          <div
            key={item.term}
            className="p-5 rounded-xl card-glass border border-slate-800 space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <span>{item.term}</span>
                  </h3>
                  <div className="text-xs text-sky-400 font-medium mt-0.5">
                    {item.label_bn}
                  </div>
                </div>
                <HelpCircle className="w-4 h-4 text-slate-500" />
              </div>

              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                {item.definition}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px]">
              <div>
                <span className="font-semibold text-slate-400">Scientific Importance: </span>
                <span className="text-slate-300">{item.importance}</span>
              </div>
              {item.misconception && (
                <div className="p-2 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-300">
                  <span className="font-bold">Common Misconception: </span>
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
