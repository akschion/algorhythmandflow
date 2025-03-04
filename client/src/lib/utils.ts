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

// Get the full URL for an asset
export function getAssetUrl(path: string): string {
  // Public directory assets are served at the root in both dev and prod
  // In prod, we need to prepend the GitHub Pages base path
  const baseUrl = getBaseUrl();
  // Always start with a forward slash and avoid double slashes
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}