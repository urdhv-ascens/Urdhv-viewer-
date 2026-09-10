/**
 * ŪRDHV ASCENS VIEWER — TYPE DEFINITIONS
 * Mirrored from contracts/types.ts
 */

export type BookletCategory = 'student' | 'teacher';

export interface Booklet {
  id: string;
  courseId: string;
  title: string;
  shortDescription: string;
  category: BookletCategory;
  totalPages: number;
  pageFormat: 'webp';
  cdnBaseUrl: string;
  pageDirectory: string;
  thumbnailDirectory: string;
  coverPath: string;
  customCoverUrl?: string;
  version: string;
  active: boolean;
  displayOrder: number;
}

export interface BookletManifest {
  bookletId: string;
  title: string;
  version: string;
  totalPages: number;
  pageFormat: 'webp';
  pageDirectory: string;
  thumbnailDirectory: string;
  cover: string;
}

export interface Course {
  id: string;
  title: string;
  category: BookletCategory;
  description: string;
  bookletIds: string[];
  active: boolean;
  displayOrder: number;
}

export interface TopBarSlide {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  destinationUrl: string;
  active: boolean;
  displayOrder: number;
  startDate?: string;
  endDate?: string;
}

export interface SideAdConfig {
  enabled: boolean;
  imageUrl: string;
  destinationUrl: string;
  alt: string;
}

export interface AdsConfig {
  topBar: {
    enabled: boolean;
    slides: TopBarSlide[];
    rotationIntervalSeconds: number;
  };
  sideAds: {
    leftAd: SideAdConfig;
    rightAd: SideAdConfig;
  };
}
