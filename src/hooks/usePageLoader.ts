/**
 * ŪRDHV ASCENS VIEWER — SMART PAGE DELIVERY & BOUNDED LRU CACHE
 * Reference: Spec §5.4 & §5.5
 * - Bounded memory cache: at most 5 pages retained in memory
 * - Smart bidirectional prefetch: current + 1, current - 1
 * - Direct Canvas rendering: avoids exposing raw img URLs in the DOM
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Booklet } from '../types';
import { defaultDocumentProvider } from '../services/documentProvider';

const MAX_CACHED_PAGES = 5;

interface CachedPage {
  pageIndex: number;
  url: string;
  img: HTMLImageElement;
  lastAccessed: number;
}

export function usePageLoader(booklet: Booklet | null, currentPage: number) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Map<number, CachedPage>>(new Map());

  // Calculates deterministic page URL via DocumentProvider abstraction
  const getPageUrl = useCallback((index: number) => {
    if (!booklet) return '';
    return defaultDocumentProvider.getPageUrl(booklet, index);
  }, [booklet]);

  // Evict page furthest from the current page if cache exceeds MAX_CACHED_PAGES
  const evictIfNecessary = useCallback((activePage: number) => {
    const cache = cacheRef.current;
    if (cache.size <= MAX_CACHED_PAGES) return;

    let furthestPage = -1;
    let maxDistance = -1;

    for (const [pageIdx] of cache.entries()) {
      const distance = Math.abs(pageIdx - activePage);
      if (distance > maxDistance) {
        maxDistance = distance;
        furthestPage = pageIdx;
      }
    }

    if (furthestPage !== -1) {
      cache.delete(furthestPage);
    }
  }, []);

  // Fetch a single page and cache its HTMLImageElement
  const loadPageImage = useCallback(async (pageIdx: number): Promise<HTMLImageElement> => {
    const cache = cacheRef.current;
    const existing = cache.get(pageIdx);
    if (existing) {
      existing.lastAccessed = Date.now();
      return existing.img;
    }

    const url = getPageUrl(pageIdx);
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      let timer: ReturnType<typeof setTimeout> | null = null;
      const cleanup = () => {
        if (timer) clearTimeout(timer);
        img.onload = null;
        img.onerror = null;
      };

      timer = setTimeout(() => {
        cleanup();
        reject(new Error(`Page ${pageIdx} request timed out. Please verify network connection.`));
      }, 12000);

      img.onload = () => {
        cleanup();
        evictIfNecessary(currentPage);
        cache.set(pageIdx, {
          pageIndex: pageIdx,
          url,
          img,
          lastAccessed: Date.now()
        });
        resolve(img);
      };

      img.onerror = () => {
        cleanup();
        reject(new Error(`Failed to load page ${pageIdx} from ${url}`));
      };

      img.src = url;
    });
  }, [getPageUrl, evictIfNecessary, currentPage]);

  // Load active page and trigger prefetch
  useEffect(() => {
    if (!booklet || currentPage < 1 || currentPage > booklet.totalPages) {
      return;
    }

    let isCancelled = false;
    setLoading(true);
    setError(null);

    loadPageImage(currentPage)
      .then(() => {
        if (!isCancelled) {
          setLoading(false);
          // Smart prefetch: next page
          if (currentPage < booklet.totalPages) {
            loadPageImage(currentPage + 1).catch(() => {});
          }
          // Smart prefetch: previous page
          if (currentPage > 1) {
            loadPageImage(currentPage - 1).catch(() => {});
          }
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(err.message || 'Error loading page. Please check your connection.');
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [booklet, currentPage, loadPageImage]);

  // Expose render function for Canvas
  const renderToCanvas = useCallback((canvas: HTMLCanvasElement, zoomLevel = 1.0) => {
    const cached = cacheRef.current.get(currentPage);
    if (!cached || !cached.img || !canvas) return;

    const img = cached.img;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions based on image natural aspect ratio and zoom
    const targetWidth = img.naturalWidth * zoomLevel;
    const targetHeight = img.naturalHeight * zoomLevel;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // High quality canvas rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  }, [currentPage]);

  const retry = useCallback(() => {
    if (!booklet) return;
    setLoading(true);
    setError(null);
    loadPageImage(currentPage)
      .then(() => setLoading(false))
      .catch((err) => {
        setError(err.message || 'Retry failed. Connection error.');
        setLoading(false);
      });
  }, [booklet, currentPage, loadPageImage]);

  return {
    loading,
    error,
    renderToCanvas,
    retry
  };
}
