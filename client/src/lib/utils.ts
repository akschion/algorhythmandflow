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
export function getAssetUrl(assetPath: string): string {
  const baseUrl = getBaseUrl();
  // Remove leading slash if present to avoid double slashes
  const cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  // In development, serve from root, in production prepend the base URL
  return `${baseUrl}/${cleanPath}`;
}