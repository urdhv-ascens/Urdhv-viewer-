import { useState, useEffect } from 'react';
import type { Booklet, AdsConfig } from './types';
import { getBookletsCatalog, getAdsConfig } from './services/api';
import { TopSponsorBar } from './components/TopSponsorBar';
import { DesktopSideAds } from './components/DesktopSideAds';
import { MobileTopAdBanner } from './components/MobileTopAdBanner';
import { BookletLibrary } from './components/BookletLibrary';
import { ReaderEngine } from './components/ReaderEngine';
import { Loader2, ExternalLink } from 'lucide-react';

export function App() {
  const [booklets, setBooklets] = useState<Booklet[]>([]);
  const [ads, setAds] = useState<AdsConfig | null>(null);
  const [selectedBooklet, setSelectedBooklet] = useState<Booklet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const [bookletsData, adsData] = await Promise.all([
          getBookletsCatalog(),
          getAdsConfig()
        ]);
        setBooklets(bookletsData);
        setAds(adsData);

        // Check if bookletId is provided in URL query params (e.g. ?booklet=student-01)
        const params = new URLSearchParams(window.location.search);
        const urlBookletId = params.get('booklet');
        if (urlBookletId) {
          const matched = bookletsData.find(b => b.id === urlBookletId);
          if (matched) {
            setSelectedBooklet(matched);
          }
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  const handleSelectBooklet = (booklet: Booklet) => {
    setSelectedBooklet(booklet);
    // Update URL without reload for shareability
    const url = new URL(window.location.href);
    url.searchParams.set('booklet', booklet.id);
    window.history.pushState({}, '', url.toString());
  };

  const handleBackToLibrary = () => {
    setSelectedBooklet(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('booklet');
    window.history.pushState({}, '', url.toString());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-4" />
        <p className="text-xs sm:text-sm font-mono tracking-widest text-zinc-400 uppercase">
          Opening Ūrdhv Ascens Learning Platform...
        </p>
      </div>
    );
  }

  // Active Reader View - completely isolated with zero underlying DOM bleed
  if (selectedBooklet) {
    return (
      <ReaderEngine
        booklet={selectedBooklet}
        onBackToLibrary={handleBackToLibrary}
        ads={ads}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Sticky Top Bar & Navigation Zone - Mobile Ad constantly on screen above */}
      <div className="sticky top-0 z-40 w-full bg-black/95 backdrop-blur-md">
        {/* Desktop Top Sponsor Bar */}
        {ads?.topBar?.enabled !== false && (
          <TopSponsorBar
            slides={ads?.topBar?.slides || []}
            rotationIntervalSeconds={ads?.topBar?.rotationIntervalSeconds || 6}
          />
        )}

        {/* Main Studio Navigation Header */}
        <header className="border-b border-zinc-850 px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <a href="https://urdhvascens.pages.dev" className="flex items-center gap-2 group">
              <img src="/logo.webp" alt="Ūrdhv Ascens" className="h-6 sm:h-7 w-auto object-contain transition-transform group-hover:scale-105" />
              <span className="text-sm sm:text-lg font-black tracking-widest text-white uppercase">
                ŪRDHV <span className="text-emerald-400">ASCENS</span>
              </span>
            </a>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-900 border border-zinc-800 text-zinc-400">
              Curriculum Reader
            </span>
          </div>

          <a
            href="https://urdhvascens.pages.dev"
            className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[11px] sm:text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
          >
            <span>Studio Flagship</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </a>
        </header>

        {/* Mobile Top Ad Banner - Wider & Constantly on screen above content */}
        {ads?.mobileBanner?.enabled !== false && (
          <div className="block lg:hidden border-b border-zinc-850 bg-black">
            <MobileTopAdBanner
              slides={ads?.mobileBanner?.slides || []}
              rotationIntervalSeconds={ads?.mobileBanner?.rotationIntervalSeconds || 5}
            />
          </div>
        )}
      </div>

      {/* Viewport Content with Non-overlapping Desktop Side Gutters */}
      <main className="flex-1 w-full relative">
        <div className="w-full max-w-[1760px] mx-auto flex justify-center items-start px-2 sm:px-4 lg:px-6 relative">
          {/* Desktop Left Flanking Side Ad - Dedicated column, NEVER blocks cards */}
          {ads?.sideAds?.enabled !== false && (
            <aside className="hidden xl:block w-36 2xl:w-44 shrink-0 sticky top-28 pt-8 mr-3 2xl:mr-6 z-20">
              <DesktopSideAds
                position="left"
                slides={ads?.sideAds?.slides}
                placement={ads?.sideAds?.leftAd}
                rotationIntervalSeconds={ads?.sideAds?.rotationIntervalSeconds}
              />
            </aside>
          )}

          {/* Central Booklet Library Grid - 100% unobstructed */}
          <div className="flex-1 min-w-0 max-w-7xl">
            <BookletLibrary
              booklets={booklets}
              onSelectBooklet={handleSelectBooklet}
            />
          </div>

          {/* Desktop Right Flanking Side Ad - Dedicated column, NEVER blocks cards */}
          {ads?.sideAds?.enabled !== false && (
            <aside className="hidden xl:block w-36 2xl:w-44 shrink-0 sticky top-28 pt-8 ml-3 2xl:ml-6 z-20">
              <DesktopSideAds
                position="right"
                slides={ads?.sideAds?.slides}
                placement={ads?.sideAds?.rightAd}
                rotationIntervalSeconds={ads?.sideAds?.rotationIntervalSeconds}
              />
            </aside>
          )}
        </div>
      </main>

      {/* Platform Footer */}
      <footer className="border-t border-zinc-900 py-6 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 ŪRDHV ASCENS. All visual course rights reserved.</p>
          <p className="font-mono text-[11px] text-zinc-600">
            Published by Ūrdhv Ascens • Open Knowledge Initiative
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
