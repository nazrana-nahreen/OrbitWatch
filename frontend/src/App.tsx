import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CloseApproachDashboard } from './components/CloseApproachDashboard';
import { OrbitVisualizer } from './components/OrbitVisualizer';
import { GlossarySection } from './components/GlossarySection';
import { AsteroidDetailModal } from './components/AsteroidDetailModal';
import { Footer } from './components/Footer';
import { apiClient } from './api/client';
import { CloseApproachItem } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orbit' | 'glossary'>('dashboard');
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);

  // Close approach items and filters
  const [approaches, setApproaches] = useState<CloseApproachItem[]>([]);
  const [loadingApproaches, setLoadingApproaches] = useState<boolean>(true);
  const [cadFilters, setCadFilters] = useState({
    date_range: '+30',
    dist_max_ld: 15,
    pha_only: false,
    sort: 'date' as 'date' | 'dist'
  });

  // Target asteroid states
  const [selectedDetailAsteroid, setSelectedDetailAsteroid] = useState<string | null>(null);
  const [selectedOrbitAsteroid, setSelectedOrbitAsteroid] = useState<string>('99942');

  // Search
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Check health on mount
  useEffect(() => {
    apiClient.checkHealth()
      .then(() => setIsBackendHealthy(true))
      .catch(() => setIsBackendHealthy(false));
  }, []);

  // Fetch CAD close approaches whenever filters change
  useEffect(() => {
    setLoadingApproaches(true);
    apiClient.getCloseApproaches({
      date_min: 'now',
      date_max: cadFilters.date_range,
      dist_max_ld: cadFilters.dist_max_ld,
      pha_only: cadFilters.pha_only,
      sort: cadFilters.sort,
      limit: 50
    })
      .then((res) => {
        setApproaches(res.items);
        setLoadingApproaches(false);
      })
      .catch(() => {
        setApproaches([]);
        setLoadingApproaches(false);
      });
  }, [cadFilters]);

  // Handle Search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSelectedDetailAsteroid(searchQuery.trim());
  };

  // Switch to orbit visualization tab
  const handleVisualizeOrbit = (designation: string) => {
    setSelectedOrbitAsteroid(designation);
    setActiveTab('orbit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0c051e] cosmic-nebula-bg star-dots text-slate-100 selection:bg-neon-pink/30 selection:text-neon-pink">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        isBackendHealthy={isBackendHealthy}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            {/* Colorful Space Hero Section (Inspired by uploaded images) */}
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              onQuickSelect={(des) => setSelectedDetailAsteroid(des)}
              onExploreApproaches={() => {
                const el = document.getElementById('close-approaches-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenOrbitView={() => handleVisualizeOrbit('99942')}
            />

            <div id="close-approaches-section" className="pt-2">
              <CloseApproachDashboard
                items={approaches}
                isLoading={loadingApproaches}
                onSelectAsteroid={(des) => setSelectedDetailAsteroid(des)}
                onVisualizeOrbit={handleVisualizeOrbit}
                filters={cadFilters}
                onUpdateFilters={setCadFilters}
              />
            </div>
          </div>
        )}

        {activeTab === 'orbit' && (
          <div className="pt-4">
            <OrbitVisualizer
              selectedAsteroid={selectedOrbitAsteroid}
              onSelectAsteroid={setSelectedOrbitAsteroid}
            />
          </div>
        )}

        {activeTab === 'glossary' && (
          <div className="pt-4">
            <GlossarySection />
          </div>
        )}

      </main>

      {/* Asteroid Detail Modal (SBDB & CAD history) */}
      <AsteroidDetailModal
        designation={selectedDetailAsteroid}
        onClose={() => setSelectedDetailAsteroid(null)}
        onVisualizeOrbit={handleVisualizeOrbit}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default App;
