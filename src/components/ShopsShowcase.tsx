import Image from "next/image";
import Link from "next/link";
import { locations } from "@/data/site";
import OpenBadge from "@/components/OpenBadge";
import Reveal from "@/components/Reveal";

const SHOP_MEDIA: Record<
  string,
  { src: string; alt: string; note: string; noteEs: string }
> = {
  weston: {
    src: "/media/weston-hall.jpg",
    alt: "Inside the Weston Road shop — hexagon LED ceiling, red leather benches, gold barber chairs on a marbled epoxy floor",
    note: "The flagship — rebuilt top to bottom in 2025.",
    noteEs: "La nave insignia.",
  },
  keele: {
    src: "/media/keele-hall.jpg",
    alt: "Inside the Keele Street shop — a long row of chairs under honeycomb lights and the red, white and blue wall",
    note: "The original — where it all started.",
    noteEs: "Donde todo empezó.",
  },
};

/** Two full-width editorial panels, one per shop, with live open status. */
export default function ShopsShowcase() {
  return (
    <div className="space-y-6">
      {locations.map((loc, i) => {
        const media = SHOP_MEDIA[loc.id];
        return (
          <Reveal key={loc.id} delay={i * 0.1}>
            <article className="group grid overflow-hidden rounded-xl border border-edge bg-surface md:grid-cols-[3fr_2fr]">
              <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[26rem]">
                <Image
                  src={media.src}
                  alt={media.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <span
                  aria-hidden="true"
                  className="display absolute bottom-4 left-5 text-6xl text-cream/95 sm:text-7xl"
                >
                  {loc.name}
                </span>
              </div>

              <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-bright">
                    {loc.area}
                  </p>
                  <h3 className="display mt-2 text-2xl text-cream">
                    {loc.address}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {loc.city} {loc.postalCode}
                  </p>
                  <div className="mt-4">
                    <OpenBadge location={loc} />
                  </div>
                  <p className="mt-4 text-sm text-cream/80">
                    {media.note}{" "}
                    <span lang="es" className="italic text-muted">
                      {media.noteEs}
                    </span>
                  </p>
                  <p className="mt-3 text-xs text-muted">
                    Free parking · Walk-ins welcome · English &amp; Español
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={loc.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded border border-edge px-5 py-3 text-center text-sm font-semibold text-cream transition-colors hover:border-gold"
                  >
                    Get Directions
                  </a>
                  <Link
                    href="/contact#locations"
                    className="flex-1 rounded border border-edge px-5 py-3 text-center text-sm font-semibold text-cream transition-colors hover:border-gold"
                  >
                    Hours &amp; Info
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
