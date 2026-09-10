import React from 'react';
import type { SideAdConfig } from '../types';

interface DesktopSideAdsProps {
  leftAd?: SideAdConfig;
  rightAd?: SideAdConfig;
}

export const DesktopSideAds: React.FC<DesktopSideAdsProps> = ({ leftAd, rightAd }) => {
  return (
    <>
      {/* Left Banner */}
      {leftAd && leftAd.enabled && leftAd.imageUrl && (
        <aside
          aria-label="Partner Advertisement Left"
          className="hidden 2xl:block fixed left-4 top-24 bottom-24 w-40 z-30 pointer-events-auto"
        >
          <a
            href={leftAd.destinationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full w-full rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-900/50 hover:border-amber-500/50 transition-all group"
          >
            <img
              src={leftAd.imageUrl}
              alt={leftAd.alt || 'Partner sponsor'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </a>
        </aside>
      )}

      {/* Right Banner */}
      {rightAd && rightAd.enabled && rightAd.imageUrl && (
        <aside
          aria-label="Partner Advertisement Right"
          className="hidden 2xl:block fixed right-4 top-24 bottom-24 w-40 z-30 pointer-events-auto"
        >
          <a
            href={rightAd.destinationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full w-full rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-900/50 hover:border-amber-500/50 transition-all group"
          >
            <img
              src={rightAd.imageUrl}
              alt={rightAd.alt || 'Partner sponsor'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </a>
        </aside>
      )}
    </>
  );
};
