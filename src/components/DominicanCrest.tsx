type DominicanCrestProps = {
  /** Rendered width in pixels; height follows the shield's natural aspect ratio. */
  size?: number;
  className?: string;
  /**
   * Pass only when the crest conveys meaning not already present in adjacent
   * visible text — this makes it an accessible image with this name.
   * Omit to keep it purely decorative (aria-hidden).
   */
  title?: string;
};

/**
 * Simplified Dominican coat-of-arms mark: a quartered shield (echoing the
 * flag's blue/red/cream cross), flanked by laurel branches and knotted with
 * a ribbon — rendered in the site's own brand palette rather than
 * naturalistic heraldic colors, so it reads as a brand mark, not a literal
 * reproduction of the national emblem.
 */
export default function DominicanCrest({ size = 48, className, title }: DominicanCrestProps) {
  const height = Math.round((size * 140) / 120);

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 120 140"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}

      {/* Laurel branches flanking the shield */}
      <g fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round">
        <path d="M18,110 Q10,85 16,60 Q20,40 30,26" />
        <path d="M102,110 Q110,85 104,60 Q100,40 90,26" />
      </g>
      <g fill="var(--color-gold)">
        <ellipse cx="14" cy="98" rx="6" ry="3" transform="rotate(-30 14 98)" />
        <ellipse cx="12" cy="82" rx="6" ry="3" transform="rotate(-10 12 82)" />
        <ellipse cx="14" cy="66" rx="6" ry="3" transform="rotate(10 14 66)" />
        <ellipse cx="21" cy="50" rx="6" ry="3" transform="rotate(28 21 50)" />
        <ellipse cx="30" cy="34" rx="6" ry="3" transform="rotate(45 30 34)" />

        <ellipse cx="106" cy="98" rx="6" ry="3" transform="rotate(30 106 98)" />
        <ellipse cx="108" cy="82" rx="6" ry="3" transform="rotate(10 108 82)" />
        <ellipse cx="106" cy="66" rx="6" ry="3" transform="rotate(-10 106 66)" />
        <ellipse cx="99" cy="50" rx="6" ry="3" transform="rotate(-28 99 50)" />
        <ellipse cx="90" cy="34" rx="6" ry="3" transform="rotate(-45 90 34)" />
      </g>

      {/* Shield: quartered cross, clipped to a shield silhouette */}
      <defs>
        <clipPath id="crest-shield">
          <path d="M25,16 H95 V68 C95,96 60,116 60,116 C60,116 25,96 25,68 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#crest-shield)">
        <rect x="25" y="16" width="35" height="50" fill="var(--color-blue)" />
        <rect x="60" y="16" width="35" height="50" fill="var(--color-red)" />
        <rect x="25" y="66" width="35" height="50" fill="var(--color-red)" />
        <rect x="60" y="66" width="35" height="50" fill="var(--color-blue)" />
        <rect x="52" y="16" width="16" height="100" fill="var(--color-cream)" />
        <rect x="25" y="58" width="70" height="16" fill="var(--color-cream)" />
      </g>
      <path
        d="M25,16 H95 V68 C95,96 60,116 60,116 C60,116 25,96 25,68 Z"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="3"
      />

      {/* Ribbon knot beneath the shield */}
      <path
        d="M60,116 L38,128 L48,122 L38,132 L60,124 L82,132 L72,122 L82,128 Z"
        fill="var(--color-red)"
      />
    </svg>
  );
}
