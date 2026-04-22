import { cn } from '@/lib/utils';
interface LogoProps {
  className?: string;
  alt?: string;
}
export function Logo({ className, alt }: LogoProps) {
  return (
    <svg
      className={cn('text-primary flex-shrink-0', className)}
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