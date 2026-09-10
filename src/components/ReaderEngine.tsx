import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Booklet, AdsConfig } from '../types';
import { usePageLoader } from '../hooks/usePageLoader';
import { DesktopReaderSideAds } from './DesktopReaderSideAds';
import { MobileTopAdBanner } from './MobileTopAdBanner';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ArrowLeft,
  RotateCcw,
  Layers,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface ReaderEngineProps {
  booklet: Booklet;
  onBackToLibrary: () => void;
  ads?: AdsConfig | null;
}

export const ReaderEngine: React.FC<ReaderEngineProps> = ({
  booklet,
  onBackToLibrary,
  ads
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [pageInput, setPageInput] = useState('1');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch swipe handling for mobile
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    // Horizontal swipe threshold: 50px and horizontally dominant
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
      if (diffX > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Hook for bounded LRU cache and smart prefetching
  const { loading, error, renderToCanvas, retry } = usePageLoader(booklet, currentPage);

  // Keep pageInput synced with currentPage
  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  // Render to canvas whenever page loads or zoom changes
  useEffect(() => {
    if (!loading && !error && canvasRef.current) {
      renderToCanvas(canvasRef.current, zoomLevel);
    }
  }, [loading, error, renderToCanvas, zoomLevel]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Standard shortcut prevention
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P' || e.key === 'u' || e.key === 'U')
      ) {
        e.preventDefault();
        return;
      }

      // Navigation
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          exitFullscreen();
        } else {
          onBackToLibrary();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, booklet.totalPages, isFullscreen]);

  // Page Navigation Handlers
  const goToNext = useCallback(() => {
    if (currentPage < booklet.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, booklet.totalPages]);

  const goToPrev = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const handlePageJump = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= booklet.totalPages) {
      setCurrentPage(pageNum);
    } else {
      setPageInput(String(currentPage));
    }
  };

  // Zoom Handlers
  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.6));
  const resetZoom = () => setZoomLevel(1.0);

  // Fit Width Handler
  const fitWidth = () => {
    if (containerRef.current && canvasRef.current) {
      const containerWidth = containerRef.current.clientWidth - 32;
      const originalWidth = canvasRef.current.width / zoomLevel;
      if (originalWidth > 0) {
        const ratio = containerWidth / originalWidth;
        setZoomLevel(Math.min(Math.max(ratio, 0.7), 2.2));
      }
    }
  };

  // Fullscreen Handlers
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
    setIsFullscreen(false);
  };

  // Helper for thumbnail URL
  const getThumbnailUrl = (index: number) => {
    const pad = String(index).padStart(4, '0');
    return `${booklet.cdnBaseUrl}${booklet.thumbnailDirectory}${pad}.webp`;
  };

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => e.preventDefault()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 flex flex-col bg-black text-white select-none overflow-hidden h-[100dvh] w-full"
    >
      {/* Top Reading Navigation Bar */}
      <header className="h-14 bg-zinc-950 border-b border-zinc-800 px-4 flex items-center justify-between z-20">
        {/* Left: Back & Title */}
        <div className="flex items-center space-x-3 truncate">
          <button
            onClick={onBackToLibrary}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
            title="Back to Library (Esc)"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="truncate">
            <h2 className="text-xs sm:text-sm font-bold text-white truncate">
              {booklet.title}
            </h2>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              {booklet.category === 'student' ? 'Student AI Course' : 'Educators AI Toolkit'} • v{booklet.version}
            </p>
          </div>
        </div>

        {/* Center: Page Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrev}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 transition-colors"
            title="Previous Page (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <form onSubmit={handlePageJump} className="flex items-center space-x-1">
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={() => setPageInput(String(currentPage))}
              className="w-10 sm:w-12 bg-zinc-900 border border-zinc-700 rounded-md text-center py-1 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
            />
            <span className="text-xs text-zinc-500">/ {booklet.totalPages}</span>
          </form>

          <button
            onClick={goToNext}
            disabled={currentPage >= booklet.totalPages}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 transition-colors"
            title="Next Page (Right Arrow / Space)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Zoom & Tool Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={zoomOut}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors hidden sm:inline-flex"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-mono text-zinc-400 min-w-10 text-center hidden sm:inline-block">
            {Math.round(zoomLevel * 100)}%
          </span>

          <button
            onClick={zoomIn}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors hidden sm:inline-flex"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={fitWidth}
            className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[11px] font-medium text-zinc-300 hover:text-white transition-colors hidden md:inline-flex"
            title="Fit to Screen Width"
          >
            Fit Width
          </button>

          <button
            onClick={resetZoom}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors hidden sm:inline-flex"
            title="Reset Zoom (100%)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Thumbnail Drawer Toggle */}
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-1.5 rounded-lg transition-colors ${
              showThumbnails
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
            }`}
            title="Toggle Page Filmstrip"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Top Ad Banner */}
      {ads?.mobileBanner?.enabled !== false && (
        <MobileTopAdBanner
          slides={ads?.mobileBanner?.slides || []}
          rotationIntervalSeconds={ads?.mobileBanner?.rotationIntervalSeconds || 5}
        />
      )}

      {/* Main Canvas Reading Viewport - Scrollable vertically for comfortable reading */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden flex items-start sm:items-center justify-between p-2 sm:p-4 lg:p-6 bg-zinc-950/95 reader-canvas-container gap-4 touch-pan-y">
        {/* Left Side Ad Banner (Desktop) */}
        {ads?.sideAds?.enabled && (
          <DesktopReaderSideAds
            position="left"
            slides={ads.sideAds.slides}
            placement={ads.sideAds.leftAd}
            rotationIntervalSeconds={ads.sideAds.rotationIntervalSeconds}
          />
        )}

        {/* Central Canvas Reading Area */}
        <div className="flex-1 flex flex-col items-center justify-start sm:justify-center relative min-w-0 w-full py-2 sm:py-0">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 z-30 rounded-lg min-h-[300px]">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
              <p className="text-xs text-zinc-400 font-mono">Loading page {currentPage}...</p>
            </div>
          )}

          {error ? (
            <div className="max-w-md p-6 bg-zinc-900 border border-red-500/30 rounded-2xl text-center z-30 shadow-2xl my-auto">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-2">Page Unavailable</h3>
              <p className="text-xs text-zinc-400 mb-4">{error}</p>
              <button
                onClick={retry}
                className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="relative inline-block transition-transform duration-100 ease-out shadow-2xl rounded-lg overflow-hidden border border-zinc-800/60 bg-zinc-900 my-auto">
              <canvas
                ref={canvasRef}
                className="w-full max-w-[98vw] sm:max-w-full sm:max-h-[82vh] h-auto object-contain block"
              />
            </div>
          )}

          {/* Desktop/Tablet Floating Navigation Arrows - Hidden on mobile so canvas text is NEVER blocked */}
          <button
            onClick={goToPrev}
            disabled={currentPage <= 1}
            aria-label="Previous Page"
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-lg bg-zinc-900/90 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 disabled:hidden transition-colors z-10 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={goToNext}
            disabled={currentPage >= booklet.totalPages}
            aria-label="Next Page"
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-lg bg-zinc-900/90 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 disabled:hidden transition-colors z-10 shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Right Side Ad Banner (Desktop) */}
        {ads?.sideAds?.enabled && (
          <DesktopReaderSideAds
            position="right"
            slides={ads.sideAds.slides}
            placement={ads.sideAds.rightAd}
            rotationIntervalSeconds={ads.sideAds.rotationIntervalSeconds}
          />
        )}
      </main>

      {/* Dedicated Mobile Bottom Navigation Bar (Buttons never overlap reading canvas) */}
      <div className="sm:hidden bg-zinc-950 border-t border-zinc-850 px-3 py-2 flex items-center justify-between z-30 shrink-0">
        <button
          onClick={goToPrev}
          disabled={currentPage <= 1}
          className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-800 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-800 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        <div className="flex items-center space-x-2">
          <form onSubmit={handlePageJump} className="flex items-center space-x-1">
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={() => setPageInput(String(currentPage))}
              className="w-10 bg-zinc-900 border border-zinc-700 rounded-md text-center py-1 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
            />
            <span className="text-xs text-zinc-400 font-mono">/ {booklet.totalPages}</span>
          </form>

          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-1.5 rounded-lg border transition-colors ${
              showThumbnails
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800'
            }`}
            title="Toggle Thumbnails"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={goToNext}
          disabled={currentPage >= booklet.totalPages}
          className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-800 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-800 text-xs font-semibold"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Thumbnail Filmstrip Drawer */}
      {showThumbnails && (
        <aside
          aria-label="Page thumbnails filmstrip"
          className="h-28 sm:h-32 bg-zinc-950 border-t border-zinc-800 px-4 py-2 flex items-center space-x-3 overflow-x-auto z-20 shrink-0"
        >
          {Array.from({ length: booklet.totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => {
                setCurrentPage(pageNum);
                setShowThumbnails(false);
              }}
              className={`relative flex-shrink-0 h-20 sm:h-24 aspect-[3/4] rounded-lg overflow-hidden border transition-all ${
                pageNum === currentPage
                  ? 'border-emerald-400 ring-1 ring-emerald-500/50 scale-105'
                  : 'border-zinc-800 hover:border-zinc-600 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={getThumbnailUrl(pageNum)}
                alt={`Page ${pageNum}`}
                loading="lazy"
                className="w-full h-full object-cover pointer-events-none"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/80 text-white">
                {pageNum}
              </span>
            </button>
          ))}
        </aside>
      )}

      {/* Footer Status Bar */}
      <footer className="h-7 bg-zinc-950 border-t border-zinc-900 px-4 flex items-center justify-between text-[10px] text-zinc-500 font-mono shrink-0">
        <div className="flex items-center space-x-2">
          <span>ŪRDHV ASCENS READER</span>
          <span>•</span>
          <span className="text-zinc-400">Page {currentPage} of {booklet.totalPages}</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
          <span>Swipe or Arrow Keys to Navigate</span>
          <span>•</span>
          <span>Official Edition</span>
        </div>
      </footer>
    </div>
  );
};
