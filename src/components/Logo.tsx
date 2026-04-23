import React from 'react';
import { cn } from '@/lib/utils';
import { LOGO_BASE64 } from '@/lib/constants';
interface LogoProps {
  className?: string;
  alt?: string;
  src?: string;
}
export function Logo({ className, alt, src }: LogoProps) {
  const imageSource = src || LOGO_BASE64;
  // If there is an image source (Base64 or URL), render an img tag for high-fidelity brand assets
  if (imageSource && imageSource.startsWith('data:image') || imageSource.startsWith('http')) {
    return (
      <div className={cn('relative flex-shrink-0 group', className)}>
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />
        <img
          src={imageSource}
          alt={alt || "Stone Cold Logo"}
          className="relative z-10 w-full h-full object-contain brightness-110 drop-shadow-[0_0_8px_rgba(0,191,255,0.4)]"
        />
      </div>
    );
  }
  // Fallback to the original SVG path logic if no valid image source is available
  return (
    <svg
      className={cn('text-primary flex-shrink-0 drop-shadow-[0_0_8px_rgba(0,191,255,0.4)]', className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-hidden="true"
    >
      {alt && <title>{alt}</title>}
      <path d="M2 19l-2 2m22 0l-2-2M8 22h2m-4 0h2m8 0h2m4 0h2m-10-16h2m4 0l-2 2m4 0l-4 4m4-9l-2 2m4 0l-2 2m4 0l-2 2"/>
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 9v6m3-3h-6"/>
    </svg>
  );
}