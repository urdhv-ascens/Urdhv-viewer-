import React, { useState, useEffect } from 'react';
import type { AdSlide, SideAdPlacement } from '../types';

interface DesktopReaderSideAdsProps {
  position: 'left' | 'right';
  slides?: AdSlide[];
  placement?: SideAdPlacement;
  rotationIntervalSeconds?: number;
}

const DEFAULT_READER_SIDE_SLIDES: AdSlide[] = [
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
      if (s.active !== false) pool.push(s);
    });
  }
  if (pool.length === 0 && placement && placement.enabled !== false && placement.imageUrl) {
    pool.push({
      id: `side-${position}-default`,
      imageUrl: placement.imageUrl,
      destinationUrl: placement.destinationUrl,
      alt: placement.alt || 'Partner sponsor',
      title: placement.alt || 'Partner sponsor',
      active: true
    });
  }

  const activeSlides = pool.length > 0 ? pool : DEFAULT_READER_SIDE_SLIDES;
  const [currentIndex, setCurrentIndex] = useState(position === 'right' && activeSlides.length > 1 ? 1 : 0);
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
      aria-label={`Advertisement ${position}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="hidden lg:flex flex-col items-center justify-center w-36 xl:w-44 2xl:w-52 h-[75vh] max-h-[680px] flex-shrink-0 z-20 select-none group"
    >
      <a
        href={currentSlide.destinationUrl || 'https://gold-cat-133405.hostingersite.com'}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-full h-full rounded-2xl overflow-hidden border border-zinc-850 bg-black hover:border-emerald-500/50 transition-all duration-300 shadow-2xl block group"
      >
        {currentSlide.imageUrl && (
          <img
            key={currentSlide.id || currentIndex}
            src={currentSlide.imageUrl}
            alt={currentSlide.alt || 'Advertisement'}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        )}
      </a>
    </aside>
  );
};
