import type { CSSProperties, ReactNode } from "react";

/**
 * Fade-up as the element scrolls into view.
 *
 * Pure CSS (see `.reveal` in globals.css) — a scroll-driven animation, so this
 * stays a server component: no client bundle, no hydration, no observer. It
 * degrades to plain visible content where scroll-driven animations aren't
 * supported or the visitor prefers reduced motion.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  /** Cascade offset for siblings that scroll into view together, in seconds. */
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={className ? `reveal ${className}` : "reveal"}
      style={
        delay
          ? ({ "--reveal-stagger": `${Math.round(delay * 100)}%` } as CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}
