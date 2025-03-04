import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get the base URL for GitHub Pages deployment
export function getBaseUrl(): string {
  // Only add the base path in production
  return import.meta.env.PROD ? '/algorhythmandflow' : '';
}

// Get the full URL for a static asset in the public directory
export function getAssetUrl(path: string): string {
  // Public directory assets are always served from the root
  const baseUrl = getBaseUrl();
  // Remove any leading slash from the path
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // In development, serve from root. In production, serve from the GitHub Pages base path
  return baseUrl ? `${baseUrl}/${cleanPath}` : `/${cleanPath}`;
}