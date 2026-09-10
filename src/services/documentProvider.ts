/**
 * ŪRDHV ASCENS VIEWER — DOCUMENT PROVIDER ABSTRACTION
 * Reference: GODMODE Production Engineering §46
 * Decouples the viewer from specific CDN providers for resilient multi-cloud delivery.
 */

import type { Booklet, BookletManifest } from '../types';

export interface DocumentProvider {
  getManifest(booklet: Booklet): Promise<BookletManifest>;
  getPageUrl(booklet: Booklet, pageNumber: number): string;
  getThumbnailUrl(booklet: Booklet, pageNumber?: number): string;
  getCoverUrl(booklet: Booklet): string;
}

/**
 * Standard Multi-CDN / GitHub Pages / Edge CDN Document Provider
 */
export class StandardDocumentProvider implements DocumentProvider {
  async getManifest(booklet: Booklet): Promise<BookletManifest> {
    const manifestUrl = `${booklet.cdnBaseUrl}/manifest.json`;
    try {
      const res = await fetch(manifestUrl, {
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn(`[DocumentProvider] Failed fetching manifest from ${manifestUrl}, deriving fallback:`, e);
    }

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

  getPageUrl(booklet: Booklet, pageNumber: number): string {
    const pad = String(pageNumber).padStart(4, '0');
    return `${booklet.cdnBaseUrl}${booklet.pageDirectory || '/pages/'}${pad}.${booklet.pageFormat || 'webp'}`;
  }

  getThumbnailUrl(booklet: Booklet, pageNumber = 1): string {
    const pad = String(pageNumber).padStart(4, '0');
    return `${booklet.cdnBaseUrl}${booklet.thumbnailDirectory || '/thumbnails/'}${pad}.${booklet.pageFormat || 'webp'}`;
  }

  getCoverUrl(booklet: Booklet): string {
    if (booklet.customCoverUrl) return booklet.customCoverUrl;
    return `${booklet.cdnBaseUrl}${booklet.coverPath || '/preview/cover.webp'}`;
  }
}

export const defaultDocumentProvider = new StandardDocumentProvider();
