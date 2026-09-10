import React, { useState, useEffect } from 'react';
import type { AdSlide } from '../types';
import { ExternalLink } from 'lucide-react';

interface MobileTopAdBannerProps {
  slides: AdSlide[];
  rotationIntervalSeconds?: number;
}

export const MobileTopAdBanner: React.FC<MobileTopAdBannerProps> = ({
  slides,
  rotationIntervalSeconds = 5
}) => {
  const activeSlides = slides.filter(s => s.active !== false && s.imageUrl);
  const [currentIndex, setCurrentIndex] = useState(0);
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
      aria-label="Mobile Sponsor Announcement Bar"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="block lg:hidden w-full px-2 sm:px-4 py-1.5 z-30 bg-black border-b border-zinc-850"
    >
      <div className="relative w-full max-w-xl mx-auto h-16 sm:h-20 rounded-xl overflow-hidden border border-zinc-850 bg-zinc-950 group">
        <a
          href={currentSlide.destinationUrl || 'https://urdhvascens.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full h-full block"
        >
          {/* Ad Creative Image */}
          <img
            key={currentSlide.id || currentIndex}
            src={currentSlide.imageUrl}
            alt={currentSlide.alt || currentSlide.title || 'Partner sponsor'}
            loading="lazy"
            className="w-full h-full object-cover transition-opacity duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/uploads/ad_mobile_1.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40 pointer-events-none" />

          {/* SPONSORED Tag Overlay */}
          <div className="absolute top-2 left-2 flex items-center space-x-1.5">
            <span className="px-2 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold uppercase tracking-wider bg-black text-emerald-400 border border-emerald-500/30">
              SPONSORED
            </span>
          </div>

          {/* Title on Left Bottom */}
          {currentSlide.title && (
            <div className="absolute bottom-2 left-2.5 max-w-[70%] z-10">
              <p className="text-[10px] sm:text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate drop-shadow-md">
                {currentSlide.title}
              </p>
            </div>
          )}

          {/* Action indicator on Right */}
          <div className="absolute bottom-2 right-2 flex items-center space-x-1 px-2 py-1 rounded bg-black border border-zinc-800 text-[10px] font-semibold text-emerald-400">
            <span>Open</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </div>
        </a>

        {/* Carousel indicators */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1 z-10 pointer-events-none">
            {activeSlides.map((_, idx) => (
              <span
                key={idx}
                className={`h-0.5 rounded-full transition-all ${
                  idx === (currentIndex % activeSlides.length)
                    ? 'w-3 bg-emerald-400'
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
