"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { site } from "@/data/site";
import DominicanFlag from "@/components/DominicanFlag";

/**
 * Full-viewport cinematic hero: looping interior footage of the Weston shop,
 * the brand mark, and a parallax drift as you scroll away.
 * Reduced motion gets the poster frame and a static logo.
 */
export default function HeroCinematic() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Background creeps slower than the page; text lifts away and fades.
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-38%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      aria-label="Otro Nivel Barbershop"
      className="relative flex min-h-svh items-end overflow-hidden"
    >
      {/* — backdrop — */}
      <motion.div
        style={reduceMotion ? undefined : { y: mediaY }}
        className="grain absolute inset-0 scale-[1.06]"
        aria-hidden="true"
      >
        {reduceMotion ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/media/hero-poster.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/media/hero-poster.jpg"
          >
            <source src="/media/hero-loop.mp4" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-ink/30" />
      </motion.div>

      {/* — copy — */}
      <motion.div
        style={reduceMotion ? undefined : { y: textY, opacity: textOpacity }}
        className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-44 sm:px-6"
      >
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.35em] text-gold"
        >
          <DominicanFlag size={20} title="Dominican-owned" className="rounded-[1px]" />
          Toronto · Weston Rd &amp; Keele St · Est. on another level
        </motion.p>

        <h1 aria-label={`${site.shortName} — ${site.tagline}`}>
          <motion.span
            aria-hidden="true"
            className="block"
            initial={reduceMotion ? false : { opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="/images/logo-circle.webp"
              alt=""
              width={1024}
              height={1024}
              priority
              className="h-auto w-[clamp(10rem,26vw,17rem)] drop-shadow-[0_8px_30px_rgba(0,0,0,0.55)]"
            />
          </motion.span>
          <motion.span
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-6 block max-w-2xl text-lg font-medium text-cream/90 sm:text-2xl"
          >
            {site.tagline}.{" "}
            <span lang="es" className="italic text-gold">
              Cortes a otro nivel.
            </span>
          </motion.span>
        </h1>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-9 flex flex-col gap-3 sm:flex-row"
        >
          <Link
            href="/book"
            className="group relative overflow-hidden rounded bg-red px-9 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-deep"
          >
            Book Now · Reservar
          </Link>
          <a
            href={site.phoneHref}
            className="rounded border border-cream/40 bg-ink/30 px-9 py-4 text-center text-sm font-bold uppercase tracking-wide text-cream backdrop-blur-sm transition-colors hover:border-cream hover:bg-cream/10"
          >
            Call {site.phone}
          </a>
        </motion.div>
      </motion.div>

      {/* — scroll cue — */}
      {!reduceMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="h-10 w-px bg-gradient-to-b from-transparent via-cream/70 to-transparent"
          />
        </motion.div>
      )}
    </section>
  );
}
