import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get the base URL for GitHub Pages deployment
export function getBaseUrl(): string {
  const isProd = import.meta.env.PROD;
  return isProd ? '/algorhythmandflow' : '';
}

// Get the full URL for an asset, considering the base path
export function getAssetUrl(path: string): string {
  const baseUrl = getBaseUrl();
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}