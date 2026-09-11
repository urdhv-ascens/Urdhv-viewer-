import React, { useState, useEffect } from 'react';
import type { AdSlide, SideAdPlacement } from '../types';

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
    imageUrl: '/uploads/ad_side_1.webp',
    active: true
  },
  {
    id: 'default-side-2',
    title: 'Visual AI Curriculum',
    alt: '12 Interactive Visual Modules',
    destinationUrl: 'https://urdhvascens.pages.dev',
    imageUrl: '/uploads/ad_side_2.webp',
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
      aria-label={`Advertisement ${position}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full select-none"
    >
      <a
        href={currentSlide.destinationUrl || 'https://urdhvascens.pages.dev#contact'}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-[540px] max-h-[75vh] rounded-2xl overflow-hidden border border-zinc-850 bg-black hover:border-emerald-500/50 transition-all duration-300 group shadow-2xl"
      >
        {currentSlide.imageUrl && (
          <img
            key={currentSlide.id || currentIndex}
            src={currentSlide.imageUrl}
            alt={currentSlide.alt || 'Advertisement'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        )}
      </a>
    </div>
  );
};

export const DesktopSideAd = DesktopSideAds;
