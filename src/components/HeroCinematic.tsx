import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { reviewsSummary, site } from "@/data/site";
import DominicanFlag from "@/components/DominicanFlag";
import GoogleRatingBadge from "@/components/GoogleRatingBadge";
import HeroVideo from "@/components/HeroVideo";

/**
 * Full-viewport cinematic hero: looping interior footage of the Weston shop,
 * the brand mark, and a parallax drift as you scroll away.
 *
 * Server-rendered apart from the video itself — entrance and parallax are pure
 * CSS, with the parallax running on the compositor via scroll-driven
 * animations and simply not applying where those are unsupported.
 */
export default function HeroCinematic() {
  return (
    <section
      aria-label="Otro Nivel Barbershop"
      className="relative flex min-h-svh items-end overflow-hidden"
    >
      {/* — backdrop — */}
      <div
        className="grain hero-media absolute inset-0 scale-[1.06]"
        aria-hidden="true"
      >
        {/* The still is the LCP element: AVIF for the ~95% of browsers that
            decode it, WebP for the rest, preloaded at high priority in the
            layout so it starts as soon as the head is parsed. */}
        <picture>
          <source srcSet="/media/hero-poster.avif" type="image/avif" />
          <img
            src="/media/hero-poster.webp"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <HeroVideo />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-ink/30" />
      </div>

      {/* — copy — */}
      <div className="hero-copy relative mx-auto w-full max-w-6xl px-4 pb-24 pt-44 sm:px-6">
        <p className="rise-in mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.35em] text-gold">
          <DominicanFlag size={20} title="Dominican-owned" className="rounded-[1px]" />
          Toronto · Weston Rd &amp; Keele St · Est. on another level
        </p>

        <div className="rise-in" style={{ "--rise-delay": "0.06s" } as CSSProperties}>
          <GoogleRatingBadge
            ratingValue={reviewsSummary.ratingValue}
            reviewCount={reviewsSummary.reviewCount}
            className="mb-3 text-cream/90"
          />
        </div>

        <h1>
          <span className="rise-in-lg block">
            <Image
              src="/images/logo-circle.webp"
              alt={`${site.legalName} — Latino barbershop Toronto & North York`}
              width={1024}
              height={1024}
              sizes="(max-width: 640px) 160px, 272px"
              className="h-auto w-[clamp(10rem,26vw,17rem)] drop-shadow-[0_8px_30px_rgba(0,0,0,0.55)]"
            />
          </span>
          <span
            className="rise-in mt-6 block max-w-2xl text-lg font-medium text-cream/90 sm:text-2xl"
            style={{ "--rise-delay": "0.12s" } as CSSProperties}
          >
            {site.tagline}.{" "}
            <span lang="es" className="italic text-gold">
              Cortes a otro nivel.
            </span>
          </span>
        </h1>

        <div
          className="rise-in mt-9 flex flex-col flex-wrap gap-3 sm:flex-row"
          style={{ "--rise-delay": "0.18s" } as CSSProperties}
        >
          <Link
            href="/book"
            className="group relative overflow-hidden rounded bg-red px-9 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-deep"
          >
            Book Now · Reservar
          </Link>
          <a
            href={site.phoneHref}
            className="rounded border border-cream/40 bg-ink/30 px-6 py-4 text-center text-sm font-bold uppercase tracking-wide text-cream backdrop-blur-sm transition-colors hover:border-cream hover:bg-cream/10"
          >
            Call {site.phone}
          </a>
          <a
            href={site.esmiPhoneHref}
            className="rounded border border-cream/40 bg-ink/30 px-6 py-4 text-center text-sm font-bold uppercase tracking-wide text-cream backdrop-blur-sm transition-colors hover:border-cream hover:bg-cream/10"
          >
            Call {site.esmi.name} {site.esmiPhone}
          </a>
        </div>
        <p
          className="rise-in mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-cream/70"
          style={{ "--rise-delay": "0.24s" } as CSSProperties}
        >
          Booked in 60 seconds · No deposit · Walk-ins welcome
        </p>
      </div>

      {/* — scroll cue — */}
      <div
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
        aria-hidden="true"
      >
        <div className="scroll-cue h-10 w-px bg-gradient-to-b from-transparent via-cream/70 to-transparent" />
      </div>
    </section>
  );
}
