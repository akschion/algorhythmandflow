import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get the base URL for GitHub Pages deployment
export function getBaseUrl(): string {
  const isProd = import.meta.env.PROD;
  const hostname = window.location.hostname;
  return (isProd && (hostname === 'algorhythmandflow.com' || hostname.endsWith('github.io'))) 
    ? '/algorhythmandflow' 
    : '';
}

// Get the full URL for an asset, considering the base path
export function getAssetUrl(path: string): string {
  const baseUrl = getBaseUrl();
  // Remove leading slash if present to avoid double slashes
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}/${normalizedPath}`;
}