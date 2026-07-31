import Image from "next/image";
import DominicanFlag from "@/components/DominicanFlag";

/**
 * Editorial statement over a slow-parallax full-bleed interior shot,
 * with an oversized outlined ghost word drifting behind the copy.
 *
 * Both parallax layers are CSS scroll-driven animations (`.parallax-*` in
 * globals.css), so this renders on the server and costs no client JS.
 */
export default function ExperienceSection() {
  return (
    <section
      aria-labelledby="experience-heading"
      className="defer-paint relative overflow-hidden py-28 sm:py-40"
    >
      <div className="parallax-slow absolute inset-[-10%_0]" aria-hidden="true">
        <Image
          src="/media/weston-gold-chairs.jpg"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 1400px"
          quality={30}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/78" />
      </div>

      <span
        aria-hidden="true"
        className="display text-outline parallax-drift pointer-events-none absolute top-8 left-0 whitespace-nowrap text-[22vw] leading-none opacity-60 select-none"
      >
        A OTRO NIVEL
      </span>

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
        <div className="brand-accent mt-6 h-1 w-24 rounded-full" aria-hidden="true" />
        <div className="mt-8 grid max-w-4xl gap-8 sm:grid-cols-2">
          <p className="text-lg leading-relaxed text-cream/85">
            Hexagon lights overhead, custom epoxy floors underfoot, gold chairs
            in between. The name means{" "}
            <span lang="es" className="italic text-gold">
              “another level”
            </span>{" "}
            — and we built both shops to prove it.
          </p>
          <p className="flex items-start gap-3 text-lg leading-relaxed text-cream/85">
            <DominicanFlag size={30} className="mt-1.5 shrink-0 rounded-[2px]" />
            <span>
              Dominican barbering runs on craft and community. Music on,
              chairs full, familia in the lounge — every cut finished to the
              line before you leave the chair.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
