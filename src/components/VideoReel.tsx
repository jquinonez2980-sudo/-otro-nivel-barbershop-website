"use client";

import { useState } from "react";
import { site, featuredVideos } from "@/data/site";

/**
 * Lite YouTube embeds: a static thumbnail + play button per video, swapped
 * for a youtube-nocookie iframe only on click. No third-party JS or cookies
 * load until a visitor actually plays something.
 */
function LiteVideo({
  id,
  title,
  titleEs,
}: {
  id: string;
  title: string;
  titleEs: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border border-edge bg-surface">
      <div className="relative aspect-video">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-ink/30 transition-colors group-hover:bg-ink/10" />
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-110">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5-11-6.5Z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <p className="px-4 py-3 text-sm font-semibold text-cream">
        {title}{" "}
        <span lang="es" className="font-normal italic text-muted">
          · {titleEs}
        </span>
      </p>
    </div>
  );
}

export default function VideoReel() {
  return (
    <div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {featuredVideos.map((v) => (
          <LiteVideo key={v.id} {...v} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <a
          href={site.youtube.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded border border-gold px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-gold transition-colors hover:bg-gold hover:text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.5 12 4.5 12 4.5s-7 0-8.9.6A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.6 8.9.6 8.9.6s7 0 8.9-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.5 12 31 31 0 0 0 23 7.2ZM9.8 15.3V8.7L15.9 12l-6.1 3.3Z" />
          </svg>
          {site.youtube.subscribers} on YouTube — Subscribe
        </a>
      </div>
    </div>
  );
}
