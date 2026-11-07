import React from 'react';

/**
 * Resolves any product or asset image path to a valid public image URL.
 * Normalizes:
 * - Legacy paths in localStorage: '/src/assets/images/...' -> '/images/...'
 * - Direct public references: '/public/images/...' or 'public/images/...' -> '/images/...'
 * - Missing leading slash: 'images/...' -> '/images/...'
 * - Preserves data URLs and http/https external links
 */
export function getImageSrc(src?: string | null): string {
  if (!src) return '/images/hero_luxury_apparel_1793964581310.jpg';

  if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  let clean = src.trim();
  clean = clean.replace(/^\.?\/?src\/assets\/images\//, '/images/');
  clean = clean.replace(/^\.?\/?public\/images\//, '/images/');
  clean = clean.replace(/^\.?\/?public\//, '/');

  if (!clean.startsWith('/')) {
    clean = `/${clean}`;
  }

  return clean;
}

/**
 * Graceful image onError handler that automatically attempts to load from /images/<filename>
 * or falls back to a default atelier photography asset.
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string = '/images/hero_luxury_apparel_1793964581310.jpg'
) {
  const target = e.currentTarget;
  if (!target.dataset.fallbackTried) {
    target.dataset.fallbackTried = 'true';
    const filename = target.src.split('/').pop()?.split('?')[0];
    if (filename && (filename.endsWith('.jpg') || filename.endsWith('.png') || filename.endsWith('.webp'))) {
      target.src = `/images/${filename}`;
    } else {
      target.src = fallbackSrc;
    }
  }
}
