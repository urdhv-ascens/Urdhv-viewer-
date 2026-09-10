/**
 * ŪRDHV ASCENS VIEWER — API SERVICE
 * Connects to Hostinger dynamic API with automatic fallback to static local manifests.
 */

import type { Booklet, BookletManifest, AdsConfig } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://gold-cat-133405.hostingersite.com/api';

/**
 * Fetch booklet catalog from Hostinger API with local static fallback
 */
export async function getBookletsCatalog(): Promise<Booklet[]> {
  try {
    const res = await fetch(`${API_BASE}/booklets.php`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {
    console.warn('⚠️ Hostinger API unreachable, using bundled booklet catalog fallback:', e);
  }

  // Fallback to bundled static catalog
  try {
    const fallbackRes = await fetch('/booklets-catalog.json', {
      signal: AbortSignal.timeout(4000)
    });
    if (fallbackRes.ok) {
      return await fallbackRes.json();
    }
  } catch (err) {
    console.error('Failed to load static catalog fallback:', err);
  }

  return [];
}

/**
 * Fetch advertisements configuration
 */
export async function getAdsConfig(): Promise<AdsConfig> {
  try {
    const res = await fetch(`${API_BASE}/ads.php`, {
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Hostinger ads API unreachable, using default sponsor config:', e);
  }

  // Safe fallback
  return {
    topBar: {
      enabled: true,
      rotationIntervalSeconds: 6,
      slides: [
        {
          id: 'default-01',
          title: 'ŪRDHV ASCENS STUDIO — Bespoke Digital Solutions',
          subtitle: 'Precision Engineered. Distinctly Elevated.',
          destinationUrl: 'https://urdhvascens.pages.dev',
          active: true,
          displayOrder: 1
        }
      ]
    },
    sideAds: {
      enabled: true,
      rotationIntervalSeconds: 5,
      slides: [
        {
          id: 'default-side-01',
          title: 'Enterprise Digital Systems',
          imageUrl: '/uploads/ad_side_1.webp',
          destinationUrl: 'https://urdhvascens.pages.dev#contact',
          alt: 'Ūrdhv Ascens Studio Engineering',
          active: true,
          displayOrder: 1
        },
        {
          id: 'default-side-02',
          title: 'Visual AI Curriculum',
          imageUrl: '/uploads/ad_side_2.webp',
          destinationUrl: 'https://urdhvascens.pages.dev',
          alt: 'Visual AI Curriculum Modules',
          active: true,
          displayOrder: 2
        }
      ],
      leftAd: {
        enabled: true,
        imageUrl: '/uploads/ad_side_1.webp',
        destinationUrl: 'https://urdhvascens.pages.dev#contact',
        alt: 'Ūrdhv Ascens Studio Partner'
      },
      rightAd: {
        enabled: true,
        imageUrl: '/uploads/ad_side_2.webp',
        destinationUrl: 'https://urdhvascens.pages.dev',
        alt: 'Ūrdhv Ascens Studio Partner'
      }
    },
    mobileBanner: {
      enabled: true,
      rotationIntervalSeconds: 5,
      slides: [
        {
          id: 'default-mob-01',
          title: 'Ūrdhv Ascens Studio Flagship',
          imageUrl: '/uploads/ad_mobile_1.webp',
          destinationUrl: 'https://urdhvascens.pages.dev#contact',
          alt: 'Ūrdhv Ascens Studio',
          active: true,
          displayOrder: 1
        },
        {
          id: 'default-mob-02',
          title: 'Visual AI Curriculum Modules',
          imageUrl: '/uploads/ad_mobile_2.webp',
          destinationUrl: 'https://urdhvascens.pages.dev',
          alt: 'Visual AI Educational Track',
          active: true,
          displayOrder: 2
        }
      ]
    }
  };
}

/**
 * Fetch booklet manifest contract from Booklet CDN
 */
export async function getBookletManifest(booklet: Booklet): Promise<BookletManifest> {
  const manifestUrl = `${booklet.cdnBaseUrl}/manifest.json`;
  try {
    const res = await fetch(manifestUrl, {
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn(`Could not fetch live manifest from ${manifestUrl}, constructing from metadata:`, e);
  }

  // Deterministic fallback derived from booklet record
  return {
    bookletId: booklet.id,
    title: booklet.title,
    version: booklet.version || '1.0.0',
    totalPages: booklet.totalPages,
    pageFormat: booklet.pageFormat || 'webp',
    pageDirectory: booklet.pageDirectory || '/pages/',
    thumbnailDirectory: booklet.thumbnailDirectory || '/thumbnails/',
    cover: booklet.coverPath || '/preview/cover.webp'
  };
}
