import React, { useState, useEffect } from 'react';
import type { AdSlide } from '../types';
import { ExternalLink, Sparkles } from 'lucide-react';

interface MobileTopAdBannerProps {
  slides?: AdSlide[];
  rotationIntervalSeconds?: number;
}

const DEFAULT_SLIDES: AdSlide[] = [
  {
    id: 'default-mob-1',
    title: 'ŪRDHV ASCENS STUDIO',
    alt: 'Bespoke Digital Architecture & Flagships',
    destinationUrl: 'https://urdhvascens.pages.dev#contact',
    imageUrl: '/uploads/ad_mobile_1.png',
    active: true
  },
  {
    id: 'default-mob-2',
    title: 'VISUAL AI CURRICULUM',
    alt: '12 Interactive Open-Access Modules',
    destinationUrl: 'https://urdhvascens.pages.dev',
    imageUrl: '/uploads/ad_mobile_2.png',
    active: true
  }
];

export const MobileTopAdBanner: React.FC<MobileTopAdBannerProps> = ({
  slides = [],
  rotationIntervalSeconds = 5
}) => {
  const filtered = slides.filter(s => s.active !== false);
  const activeSlides = filtered.length > 0 ? filtered : DEFAULT_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeSlides.length);
    }, rotationIntervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [activeSlides.length, isPaused, rotationIntervalSeconds]);

  const currentSlide = activeSlides[currentIndex % activeSlides.length];

  return (
    <aside
      aria-label="Partner Sponsor Announcement"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full px-2 sm:px-3 py-1.5 select-none"
    >
      {/* Full-width wide mobile ad banner card */}
      <div className="relative w-full h-14 sm:h-16 rounded-xl overflow-hidden border border-zinc-800/90 hover:border-emerald-500/40 transition-colors bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 group shadow-lg">
        <a
          href={currentSlide.destinationUrl || 'https://urdhvascens.pages.dev#contact'}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full h-full flex items-center justify-between px-3 sm:px-4 py-1.5"
        >
          {/* Background Creative Image */}
          {currentSlide.imageUrl && (
            <img
              key={currentSlide.id || currentIndex}
              src={currentSlide.imageUrl}
              alt={currentSlide.alt || currentSlide.title || 'Partner sponsor'}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:opacity-25 transition-opacity"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          )}

          {/* High-contrast gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/90 pointer-events-none" />

          {/* Left: Sponsored Badge, Title, and Tagline */}
          <div className="relative z-10 flex flex-col justify-center max-w-[76%] sm:max-w-[80%] pr-2">
            <div className="flex items-center space-x-1.5 mb-0.5">
              <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold uppercase tracking-wider bg-black text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <Sparkles className="w-2 h-2 text-emerald-400" />
                <span>SPONSORED</span>
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-zinc-400 truncate">
                {currentSlide.title || 'Ūrdhv Ascens Studio'}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
              {currentSlide.alt || currentSlide.title || 'Bespoke Digital Systems & Flagships'}
            </p>
          </div>

          {/* Right: Prominent Action Button */}
          <div className="relative z-10 shrink-0 flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-zinc-900 group-hover:bg-emerald-400 text-zinc-300 group-hover:text-black border border-zinc-800 transition-colors text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow">
            <span>Open</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </a>

        {/* Carousel indicator dots */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1 z-10 pointer-events-none">
            {activeSlides.map((_, idx) => (
              <span
                key={idx}
                className={`h-0.5 rounded-full transition-all ${
                  idx === (currentIndex % activeSlides.length)
                    ? 'w-3.5 bg-emerald-400'
                    : 'w-1 bg-zinc-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
