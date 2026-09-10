import React, { useState, useEffect } from 'react';
import type { AdSlide, SideAdPlacement } from '../types';
import { ExternalLink } from 'lucide-react';

export interface DesktopSideAdsProps {
  position?: 'left' | 'right';
  slides?: AdSlide[];
  leftAd?: SideAdPlacement;
  rightAd?: SideAdPlacement;
  placement?: SideAdPlacement;
  rotationIntervalSeconds?: number;
}

const DEFAULT_SIDE_SLIDES: AdSlide[] = [
  {
    id: 'default-side-1',
    title: 'Enterprise Digital Systems',
    alt: 'Ūrdhv Ascens Studio Engineering',
    destinationUrl: 'https://urdhvascens.pages.dev#contact',
    imageUrl: '/uploads/ad_side_1.png',
    active: true
  },
  {
    id: 'default-side-2',
    title: 'Visual AI Curriculum',
    alt: '12 Interactive Visual Modules',
    destinationUrl: 'https://urdhvascens.pages.dev',
    imageUrl: '/uploads/ad_side_2.png',
    active: true
  }
];

export const DesktopSideAds: React.FC<DesktopSideAdsProps> = ({
  position = 'left',
  slides = [],
  leftAd,
  rightAd,
  placement,
  rotationIntervalSeconds = 5
}) => {
  const pool: AdSlide[] = [];
  if (slides && slides.length > 0) {
    slides.forEach(s => {
      if (s.active !== false) pool.push(s);
    });
  }

  const activePlacement = placement || (position === 'left' ? leftAd : rightAd);
  if (pool.length === 0 && activePlacement && activePlacement.enabled !== false && activePlacement.imageUrl) {
    pool.push({
      id: `side-${position}-default`,
      imageUrl: activePlacement.imageUrl,
      destinationUrl: activePlacement.destinationUrl || 'https://urdhvascens.pages.dev',
      alt: activePlacement.alt || 'Studio Partner',
      title: activePlacement.alt || (position === 'left' ? 'Studio Engineering' : 'Visual Modules'),
      active: true
    });
  }

  const activeSlides = pool.length > 0 ? pool : DEFAULT_SIDE_SLIDES;
  const initialIndex = position === 'right' && activeSlides.length > 1 ? 1 : 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
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
    <div
      aria-label={`Partner Advertisement ${position}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full select-none"
    >
      <a
        href={currentSlide.destinationUrl || 'https://urdhvascens.pages.dev#contact'}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-[540px] max-h-[75vh] rounded-2xl overflow-hidden border border-zinc-850 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 hover:border-emerald-500/50 transition-all duration-300 p-2.5 group shadow-2xl flex flex-col justify-between"
      >
        <div className="flex items-center justify-between px-1 pt-1 z-10">
          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-black text-emerald-400 border border-emerald-500/30">
            SPONSORED
          </span>
          <ExternalLink className="w-2.5 h-2.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
        </div>

        <div className="relative flex-1 w-full my-2 rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
          {currentSlide.imageUrl && (
            <img
              key={currentSlide.id || currentIndex}
              src={currentSlide.imageUrl}
              alt={currentSlide.alt || currentSlide.title || 'Partner sponsor'}
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="px-1 pb-1 z-10 space-y-1">
          {currentSlide.title && (
            <p className="text-[11px] font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
              {currentSlide.title}
            </p>
          )}
          {activeSlides.length > 1 && (
            <div className="flex items-center justify-center space-x-1 pt-0.5">
              {activeSlides.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1 rounded-full transition-all ${
                    idx === (currentIndex % activeSlides.length)
                      ? 'w-3 bg-emerald-400'
                      : 'w-1 bg-zinc-700'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </a>
    </div>
  );
};

export const DesktopSideAd = DesktopSideAds;
