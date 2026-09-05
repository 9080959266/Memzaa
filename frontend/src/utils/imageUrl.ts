// frontend/src/utils/imageUrl.ts

const RAW_API_URL = import.meta.env.VITE_API_URL || '';
const BACKEND_BASE = RAW_API_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');

const FALLBACK_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%2394a3b8'%3EMEMORA%3C/text%3E%3C/svg%3E";

export const getImageUrl = (url?: string | null): string => {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return FALLBACK_SVG;
  }

  let clean = url.trim();

  // 1. Force HTTP to HTTPS to prevent Vercel Mixed Content block
  if (clean.startsWith('http://') && !clean.includes('localhost') && !clean.includes('127.0.0.1')) {
    clean = clean.replace(/^http:\/\//i, 'https://');
  }

  // 2. If on a live production domain (Vercel) and URL has localhost:5000, swap to production backend
  const isProductionSite = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

  if (isProductionSite && (clean.includes('localhost:5000') || clean.includes('127.0.0.1:5000'))) {
    const relative = clean.replace(/https?:\/\/(localhost|127\.0\.0\.1):5000/, '');
    return BACKEND_BASE ? `${BACKEND_BASE}${relative}` : relative;
  }

  // 3. Resolve relative backend upload paths (/uploads/...)
  if (clean.startsWith('/uploads') || clean.startsWith('uploads/')) {
    const path = clean.startsWith('/') ? clean : `/${clean}`;
    return BACKEND_BASE ? `${BACKEND_BASE}${path}` : path;
  }

  // 4. Return valid HTTPS / Data URLs
  if (clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }

  return clean;
};