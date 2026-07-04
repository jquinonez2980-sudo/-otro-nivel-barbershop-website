"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Editorial statement over a slow-parallax full-bleed interior shot,
 * with an oversized outlined ghost word drifting behind the copy.
 */
export default function ExperienceSection() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const ghostX = useTransform(scrollYProgress, [0, 1], ["4%", "-8%"]);

  return (
    <section
      ref={ref}
      aria-labelledby="experience-heading"
      className="relative overflow-hidden py-28 sm:py-40"
    >
      <motion.div
        style={reduceMotion ? undefined : { y: imgY }}
        className="absolute inset-[-10%_0]"
        aria-hidden="true"
      >
        <Image
          src="/media/weston-gold-chairs.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/78" />
      </motion.div>

      <motion.span
        style={reduceMotion ? undefined : { x: ghostX }}
        aria-hidden="true"
        className="display text-outline pointer-events-none absolute top-8 left-0 whitespace-nowrap text-[22vw] leading-none opacity-60 select-none"
      >
        A OTRO NIVEL
      </motion.span>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-blue-bright">
          The Experience · La Experiencia
        </p>
        <h2
          id="experience-heading"
          className="display max-w-3xl text-4xl text-cream sm:text-6xl"
        >
          Built like nowhere else in the city
        </h2>
        <div className="tricolor mt-6 h-1 w-24 rounded-full" aria-hidden="true" />
        <div className="mt-8 grid max-w-4xl gap-8 sm:grid-cols-2">
          <p className="text-lg leading-relaxed text-cream/85">
            Hexagon lights overhead, custom epoxy floors underfoot, gold chairs
            in between. The name means{" "}
            <span lang="es" className="italic text-gold">
              “another level”
            </span>{" "}
            — and we built both shops to prove it.
          </p>
          <p className="text-lg leading-relaxed text-cream/85">
            Dominican barbering runs on craft and community. Music on, chairs
            full, familia in the lounge — every cut finished to the line before
            you leave the chair.
          </p>
        </div>
      </div>
    </section>
  );
}
