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
          Initializing Ūrdhv Ascens Educational Viewer...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Sponsor Bar */}
      {ads && ads.topBar && ads.topBar.enabled && (
        <TopSponsorBar
          slides={ads.topBar.slides}
          rotationIntervalSeconds={ads.topBar.rotationIntervalSeconds}
        />
      )}

      {/* Main Studio Navigation Header */}
      <header className="sticky top-0 z-30 bg-black border-b border-zinc-850 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <a href="https://gold-cat-133405.hostingersite.com" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="Ūrdhv Ascens" className="h-7 w-auto object-contain transition-transform group-hover:scale-105" />
            <span className="text-base sm:text-lg font-black tracking-widest text-white uppercase">
              ŪRDHV <span className="text-emerald-400">ASCENS</span>
            </span>
          </a>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-900 border border-zinc-800 text-zinc-400">
            Viewer Platform
          </span>
        </div>

        <a
          href="https://gold-cat-133405.hostingersite.com"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          <span>Studio Flagship</span>
          <ExternalLink className="w-3 h-3 text-zinc-500" />
        </a>
      </header>

      {/* Viewport Content */}
      <main className="flex-1 relative">
        {/* Mobile Top Ad Banner for Mobile View */}
        {ads && ads.mobileBanner && ads.mobileBanner.enabled && (
          <MobileTopAdBanner
            slides={ads.mobileBanner.slides}
            rotationIntervalSeconds={ads.mobileBanner.rotationIntervalSeconds}
          />
        )}

        {/* Desktop Side Ads for 2xl viewports */}
        {ads && ads.sideAds && (
          <DesktopSideAds
            slides={ads.sideAds.slides}
            leftAd={ads.sideAds.leftAd}
            rightAd={ads.sideAds.rightAd}
            rotationIntervalSeconds={ads.sideAds.rotationIntervalSeconds}
          />
        )}

        {/* Booklet Library Grid */}
        <BookletLibrary
          booklets={booklets}
          onSelectBooklet={handleSelectBooklet}
        />
      </main>

      {/* Active Hardened Reader Engine Modal */}
      {selectedBooklet && (
        <ReaderEngine
          booklet={selectedBooklet}
          onBackToLibrary={handleBackToLibrary}
          ads={ads}
        />
      )}

      {/* Platform Footer */}
      <footer className="border-t border-zinc-900 py-6 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 ŪRDHV ASCENS. All visual course rights reserved.</p>
          <p className="font-mono text-[11px] text-zinc-600">
            Powered by Cloudflare Edge CDN & Hostinger Dynamic API
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
