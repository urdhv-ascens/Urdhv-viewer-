import React, { useState, useEffect } from 'react';
import type { AdSlide, SideAdPlacement } from '../types';
import { ExternalLink } from 'lucide-react';

interface DesktopReaderSideAdsProps {
  position: 'left' | 'right';
  slides?: AdSlide[];
  placement?: SideAdPlacement;
  rotationIntervalSeconds?: number;
}

export const DesktopReaderSideAds: React.FC<DesktopReaderSideAdsProps> = ({
  position,
  slides = [],
  placement,
  rotationIntervalSeconds = 5
}) => {
  // Build slide pool
  const pool: AdSlide[] = [];
  if (slides && slides.length > 0) {
    slides.forEach(s => {
      if (s.active !== false && s.imageUrl) pool.push(s);
    });
  }
  if (pool.length === 0 && placement && placement.enabled && placement.imageUrl) {
    pool.push({
      id: `side-${position}-default`,
      imageUrl: placement.imageUrl,
      destinationUrl: placement.destinationUrl,
      alt: placement.alt,
      active: true
    });
  }

  const activeSlides = pool;
  const [currentIndex, setCurrentIndex] = useState(position === 'right' && activeSlides.length > 1 ? 1 : 0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeSlides.length);
    }, rotationIntervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [activeSlides.length, isPaused, rotationIntervalSeconds]);

  if (activeSlides.length === 0) return null;

  const currentSlide = activeSlides[currentIndex % activeSlides.length];

  return (
    <aside
      aria-label={`Sponsor Announcement ${position}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="hidden lg:flex flex-col items-center justify-center w-36 xl:w-44 2xl:w-52 h-[75vh] max-h-[680px] flex-shrink-0 z-20 select-none group"
    >
      <a
        href={currentSlide.destinationUrl || 'https://urdhvascens.com'}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-full h-full rounded-2xl overflow-hidden border border-zinc-850 bg-zinc-950 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between p-2 shadow-2xl block"
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between px-1 pt-1 z-10">
          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-black text-emerald-400 border border-emerald-500/30">
            SPONSORED
          </span>
          <span className="p-1 rounded bg-black text-zinc-500 group-hover:text-emerald-400 transition-colors">
            <ExternalLink className="w-2.5 h-2.5" />
          </span>
        </div>

        {/* Ad Image Container with Auto-Slideshow */}
        <div className="relative flex-1 w-full my-2 rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
          <img
            key={currentSlide.id || currentIndex}
            src={currentSlide.imageUrl}
            alt={currentSlide.alt || currentSlide.title || 'Partner sponsor'}
            loading="lazy"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/uploads/ad_side_1.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Bottom Title & Slideshow Indicator */}
        <div className="px-1.5 pb-1 z-10 space-y-1.5">
          {currentSlide.title && (
            <p className="text-[11px] font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-tight">
              {currentSlide.title}
            </p>
          )}

          {activeSlides.length > 1 && (
            <div className="flex items-center justify-center space-x-1 pt-1">
              {activeSlides.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1 rounded-full transition-all ${
                    idx === (currentIndex % activeSlides.length)
                      ? 'w-3.5 bg-emerald-400'
                      : 'w-1 bg-zinc-700'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </a>
    </aside>
  );
};
