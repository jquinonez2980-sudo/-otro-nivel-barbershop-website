"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export type WorkPhoto = { src: string; alt: string };

/**
 * Horizontal snap gallery for the portfolio. Native scroll (touch/trackpad/keys)
 * plus arrow buttons; images warm from duotone to full color as you hover.
 */
export default function WorkGallery({ photos }: { photos: WorkPhoto[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEnds = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 24);
    setAtEnd(el.scrollLeft > el.scrollWidth - el.clientWidth - 24);
  };

  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        onScroll={updateEnds}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6"
      >
        {photos.map((photo, i) => (
          <li
            key={photo.src}
            className="relative aspect-[3/4] w-[72vw] shrink-0 snap-start overflow-hidden rounded-lg border border-edge sm:w-[44vw] lg:w-[23.5rem]"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 72vw, (max-width: 1024px) 44vw, 376px"
              className="object-cover transition-[transform,filter] duration-700 [filter:saturate(0.55)_contrast(1.05)] hover:scale-[1.04] hover:[filter:saturate(1)_contrast(1)]"
            />
            <span
              aria-hidden="true"
              className="display absolute left-3 top-2 text-lg text-cream/60"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">
          Drag or scroll <span aria-hidden="true">→</span>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => nudge(-1)}
            disabled={atStart}
            aria-label="Scroll gallery backward"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-edge text-cream transition-colors hover:border-gold disabled:opacity-30"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            disabled={atEnd}
            aria-label="Scroll gallery forward"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-edge text-cream transition-colors hover:border-gold disabled:opacity-30"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
