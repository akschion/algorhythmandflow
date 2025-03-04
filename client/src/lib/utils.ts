import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get the base URL for GitHub Pages deployment
export function getBaseUrl(): string {
  // Only add the base path if we're using github.io
  if (import.meta.env.PROD && window.location.hostname.includes('github.io')) {
    return '/algorhythmandflow';
  }
  return '';
}

// Get the full URL for a static asset in the public directory
export function getAssetUrl(path: string): string {
  const baseUrl = getBaseUrl();
  // Remove any leading slash from the path to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
}

// Get the full URL for a page or post
export function getPageUrl(path: string): string {
  const baseUrl = getBaseUrl();
  // Remove any leading slash from the path to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
}