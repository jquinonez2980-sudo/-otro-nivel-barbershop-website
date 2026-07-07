type DominicanFlagProps = {
  /** Rendered width in pixels. Height is derived from the flag's official 5:8 ratio. */
  size?: number;
  className?: string;
  /**
   * Pass only when the flag conveys meaning not already present in adjacent
   * visible text — this makes it an accessible image with this name.
   * Omit to keep it purely decorative (aria-hidden).
   */
  title?: string;
};

/**
 * Dominican Republic civil flag: a white cross extending to the edges,
 * quartering blue (upper hoist / lower fly) and red (upper fly / lower
 * hoist). Plain-cross variant — no coat of arms, stays legible at small
 * decorative sizes. Official proportion: 5:8 (height:width).
 */
export default function DominicanFlag({ size = 32, className, title }: DominicanFlagProps) {
  const height = Math.round((size * 5) / 8);

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 320 200"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {/* Blue field — shows through as upper-hoist (top-left) & lower-fly (bottom-right) */}
      <rect width="320" height="200" fill="var(--color-blue)" />
      {/* Red quadrants: upper fly (top-right), lower hoist (bottom-left) */}
      <rect x="180" y="0" width="140" height="80" fill="var(--color-red)" />
      <rect x="0" y="120" width="140" height="80" fill="var(--color-red)" />
      {/* Cream cross, edge to edge, centered on both axes */}
      <rect x="140" y="0" width="40" height="200" fill="var(--color-cream)" />
      <rect x="0" y="80" width="320" height="40" fill="var(--color-cream)" />
    </svg>
  );
}
