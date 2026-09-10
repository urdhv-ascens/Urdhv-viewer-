import React, { useState, useEffect } from 'react';
import type { AdSlide, SideAdPlacement } from '../types';
import { ExternalLink } from 'lucide-react';

interface DesktopSideAdsProps {
  slides?: AdSlide[];
  leftAd?: SideAdPlacement;
  rightAd?: SideAdPlacement;
  rotationIntervalSeconds?: number;
}

const DEFAULT_SIDE_SLIDES: AdSlide[] = [
  {
    id: 'default-side-1',
    title: 'Enterprise Digital Systems',
    alt: 'Ūrdhv Ascens Studio Engineering',
    destinationUrl: 'https://gold-cat-133405.hostingersite.com#contact',
    imageUrl: '/uploads/ad_side_1.png',
    active: true
  },
  {
    id: 'default-side-2',
    title: 'Visual AI Curriculum',
    alt: '12 Interactive Visual Modules',
    destinationUrl: 'https://gold-cat-133405.hostingersite.com',
    imageUrl: '/uploads/ad_side_2.png',
    active: true
  }
];

export const DesktopSideAds: React.FC<DesktopSideAdsProps> = ({
  slides = [],
  leftAd,
  rightAd,
  rotationIntervalSeconds = 5
}) => {
  // Build slide pools
  const pool: AdSlide[] = [];
  if (slides && slides.length > 0) {
    slides.forEach(s => {
      if (s.active !== false) pool.push(s);
    });
  }
  if (pool.length === 0) {
    if (leftAd && leftAd.enabled !== false && leftAd.imageUrl) {
      pool.push({
        id: 'left-ad-default',
        imageUrl: leftAd.imageUrl,
        destinationUrl: leftAd.destinationUrl,
        alt: leftAd.alt || 'Studio Partner',
        title: leftAd.alt || 'Studio Engineering',
        active: true
      });
    }
    if (rightAd && rightAd.enabled !== false && rightAd.imageUrl) {
      pool.push({
        id: 'right-ad-default',
        imageUrl: rightAd.imageUrl,
        destinationUrl: rightAd.destinationUrl,
        alt: rightAd.alt || 'Studio Partner',
        title: rightAd.alt || 'Visual Modules',
        active: true
      });
    }
  }

  const activeSlides = pool.length > 0 ? pool : DEFAULT_SIDE_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeSlides.length);
    }, rotationIntervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [activeSlides.length, isPaused, rotationIntervalSeconds]);

  const leftSlide = activeSlides[currentIndex % activeSlides.length];
  const rightSlide = activeSlides[(currentIndex + 1) % activeSlides.length];

  return (
    <>
      {/* Left Banner */}
      <aside
        aria-label="Partner Advertisement Left"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="hidden xl:block fixed left-3 2xl:left-6 top-24 bottom-24 w-36 2xl:w-44 z-30 pointer-events-auto select-none"
      >
        <a
          href={leftSlide.destinationUrl || 'https://gold-cat-133405.hostingersite.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full w-full rounded-2xl overflow-hidden border border-zinc-850 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 hover:border-emerald-500/50 transition-all duration-300 p-2.5 group shadow-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between px-1 pt-1 z-10">
            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-black text-emerald-400 border border-emerald-500/30">
              SPONSORED
            </span>
            <ExternalLink className="w-2.5 h-2.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
          </div>

          <div className="relative flex-1 w-full my-2 rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
            {leftSlide.imageUrl && (
              <img
                key={leftSlide.id || currentIndex}
                src={leftSlide.imageUrl}
                alt={leftSlide.alt || leftSlide.title || 'Partner sponsor'}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {leftSlide.title && (
            <p className="text-[11px] font-bold text-white group-hover:text-emerald-400 transition-colors truncate px-1 pb-1">
              {leftSlide.title}
            </p>
          )}
        </a>
      </aside>

      {/* Right Banner */}
      <aside
        aria-label="Partner Advertisement Right"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="hidden xl:block fixed right-3 2xl:right-6 top-24 bottom-24 w-36 2xl:w-44 z-30 pointer-events-auto select-none"
      >
        <a
          href={rightSlide.destinationUrl || 'https://gold-cat-133405.hostingersite.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full w-full rounded-2xl overflow-hidden border border-zinc-850 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 hover:border-emerald-500/50 transition-all duration-300 p-2.5 group shadow-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between px-1 pt-1 z-10">
            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-black text-emerald-400 border border-emerald-500/30">
              SPONSORED
            </span>
            <ExternalLink className="w-2.5 h-2.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
          </div>

          <div className="relative flex-1 w-full my-2 rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
            {rightSlide.imageUrl && (
              <img
                key={rightSlide.id || (currentIndex + 1)}
                src={rightSlide.imageUrl}
                alt={rightSlide.alt || rightSlide.title || 'Partner sponsor'}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {rightSlide.title && (
            <p className="text-[11px] font-bold text-white group-hover:text-emerald-400 transition-colors truncate px-1 pb-1">
              {rightSlide.title}
            </p>
          )}
        </a>
      </aside>
    </>
  );
};
