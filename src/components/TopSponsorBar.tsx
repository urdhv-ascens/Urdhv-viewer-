import React, { useState, useEffect } from 'react';
import type { TopBarSlide } from '../types';
import { ExternalLink } from 'lucide-react';

interface TopSponsorBarProps {
  slides: TopBarSlide[];
  rotationIntervalSeconds?: number;
}

const DEFAULT_TOP_SLIDES: TopBarSlide[] = [
  {
    id: 'default-top-01',
    title: 'ŪRDHV ASCENS STUDIO — Bespoke Digital Solutions & Architecture',
    subtitle: 'Accepting select high-impact projects for 2026',
    destinationUrl: 'https://gold-cat-133405.hostingersite.com#contact',
    active: true,
    displayOrder: 1
  }
];

export const TopSponsorBar: React.FC<TopSponsorBarProps> = ({
  slides = [],
  rotationIntervalSeconds = 6
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const filtered = slides.filter(s => s.active !== false);
  const activeSlides = filtered.length > 0 ? filtered : DEFAULT_TOP_SLIDES;

  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, rotationIntervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [activeSlides.length, isPaused, rotationIntervalSeconds]);

  const currentSlide = activeSlides[currentIndex % activeSlides.length];

  return (
    <aside
      aria-label="Partner Sponsor Announcement"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full bg-zinc-950 border-b border-zinc-850 px-4 py-2 flex items-center justify-between text-xs sm:text-sm text-zinc-300 transition-all z-40"
    >
      <div className="flex-1 flex items-center justify-center space-x-2 text-center truncate">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-black text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
          Sponsored
        </span>
        <span className="font-medium text-white truncate">{currentSlide.title}</span>
        {currentSlide.subtitle && (
          <span className="hidden md:inline text-zinc-400 truncate">- {currentSlide.subtitle}</span>
        )}
        {currentSlide.destinationUrl && (
          <a
            href={currentSlide.destinationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-0.5 text-emerald-400 hover:text-emerald-300 font-medium ml-2 transition-colors"
          >
            <span>Learn More</span>
            <ExternalLink className="w-3 h-3 ml-0.5 inline" />
          </a>
        )}
      </div>

      <div className="flex items-center space-x-2 pl-2">
        {activeSlides.length > 1 && (
          <div className="flex space-x-1">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-emerald-400 w-3' : 'bg-zinc-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
