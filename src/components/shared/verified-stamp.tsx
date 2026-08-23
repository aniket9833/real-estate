import { cn } from '@/lib/utils';

/**
 * The site's signature visual element. A hand-stamped seal motif that ties
 * directly to the core promise - "Verified plots, honest guidance" - rather
 * than a generic checkmark badge. Used on property cards, the About page,
 * and documentation sections.
 */
export function VerifiedStamp({
  className,
  size = 'md',
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dims = { sm: 44, md: 60, lg: 84 }[size];

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center animate-stamp-in select-none',
        className,
      )}
      style={{ width: dims, height: dims }}
      role="img"
      aria-label="Verified property"
    >
      <svg
        viewBox="0 0 100 100"
        width={dims}
        height={dims}
        className="drop-shadow-sm"
      >
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="#B08A4E"
          strokeWidth="2.5"
        />
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="#B08A4E"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
        <path
          id="stampCirclePath"
          d="M 50,50 m -30,0 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0"
          fill="none"
        />
        <text
          fill="#B08A4E"
          fontSize="8.4"
          fontFamily="var(--font-plex-mono), monospace"
          letterSpacing="2.5"
        >
          <textPath href="#stampCirclePath" startOffset="3%">
            VERIFIED · AVASYA · VERIFIED ·
          </textPath>
        </text>
        <path
          d="M35 51 L45 61 L67 38"
          fill="none"
          stroke="#B08A4E"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
