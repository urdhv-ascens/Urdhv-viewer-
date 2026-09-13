import React, { useState, useEffect } from 'react';
import type { AdSlide } from '../types';

interface MobileBottomAdBannerProps {
  slides?: AdSlide[];
  rotationIntervalSeconds?: number;
}

const DEFAULT_SLIDES: AdSlide[] = [
  {
    id: 'default-bottom-1',
    title: 'ŪRDHV ASCENS STUDIO',
    alt: 'Bespoke Digital Architecture & Flagships',
    destinationUrl: 'https://urdhvascens.pages.dev#contact',
    imageUrl: '/uploads/ad_mobile_1.webp',
    active: true
  },
  {
    id: 'default-bottom-2',
    title: 'VISUAL AI CURRICULUM',
    alt: '12 Interactive Open-Access Modules',
    destinationUrl: 'https://urdhvascens.pages.dev',
    imageUrl: '/uploads/ad_mobile_2.webp',
    active: true
  }
];

export const MobileBottomAdBanner: React.FC<MobileBottomAdBannerProps> = ({
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
      aria-label="Bottom advertisement"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full px-2 sm:px-3 py-1 select-none"
    >
      {/* Compact bottom ad banner for reader view */}
      <div className="relative w-full h-[60px] sm:h-[72px] rounded-xl overflow-hidden border border-zinc-800/90 hover:border-emerald-500/40 transition-colors bg-black shadow-lg">
        <a
          href={currentSlide.destinationUrl || 'https://urdhvascens.pages.dev#contact'}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block w-full h-full"
        >
          {currentSlide.imageUrl && (
            <img
              key={currentSlide.id || currentIndex}
              src={currentSlide.imageUrl}
              alt={currentSlide.alt || 'Advertisement'}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          )}
        </a>
      </div>
    </aside>
  );
};
