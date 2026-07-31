function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5 text-gold" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6L10 14.7l-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

/** Small "★★★★★ 4.9 on Google · N reviews" trust indicator, optionally linking to the shop's Google listing. */
export default function GoogleRatingBadge({
  ratingValue,
  reviewCount,
  mapsUrl,
  className = "",
}: {
  ratingValue: string;
  reviewCount: number;
  mapsUrl?: string;
  className?: string;
}) {
  const inner = (
    <>
      <Stars rating={Number(ratingValue)} />
      <span className="font-bold text-cream">{ratingValue}</span>
      <span className="text-muted">on Google · {reviewCount.toLocaleString()} reviews</span>
    </>
  );

  const classes = `inline-flex items-center gap-2 text-sm ${className}`;

  if (mapsUrl) {
    return (
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${classes} underline-offset-4 hover:underline`}
      >
        {inner}
      </a>
    );
  }

  return <div className={classes}>{inner}</div>;
}
