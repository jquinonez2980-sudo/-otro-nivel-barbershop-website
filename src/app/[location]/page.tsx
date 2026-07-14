import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site, locations } from "@/data/site";
import { locationJsonLd } from "@/lib/jsonld";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import OpenBadge from "@/components/OpenBadge";

/** Local-SEO landing page per shop: /weston and /keele. */

export const dynamicParams = false;

export function generateStaticParams() {
  return locations.map((loc) => ({ location: loc.id }));
}

function getLocation(slug: string) {
  return locations.find((l) => l.id === slug);
}

const COPY = {
  weston: {
    h1: "Barbershop on Weston Road, Toronto",
    intro:
      "Our flagship shop at 2851 Weston Road — hexagon ceiling lights, gold chairs, and the full Otro Nivel experience. Home of the VIP Service. Walk in any day, or book a chair in 60 seconds.",
    faq: [
      {
        q: "Where do I park at the Weston Road shop?",
        a: "Free parking is available right at the shop — no meters, no fuss.",
      },
      {
        q: "Do I need an appointment at Weston?",
        a: "Walk-ins are welcome every day. Appointments are available Monday–Friday and Sundays; Saturdays are walk-in only.",
      },
      {
        q: "What's the VIP Service?",
        a: "Weston's exclusive full treatment — haircut, hot towel service, and beard trim, about 1 hour 15 minutes for $60.",
      },
    ],
  },
  keele: {
    h1: "Barbershop on Keele Street, North York",
    intro:
      "Our Keele Street shop at 2266 Keele — the same Otro Nivel standard with North York's friendliest prices and late hours until 9 PM most nights. Walk in any day, or book a chair in 60 seconds.",
    faq: [
      {
        q: "Where do I park at the Keele Street shop?",
        a: "Free parking is available at the shop.",
      },
      {
        q: "Do I need an appointment at Keele?",
        a: "Walk-ins are welcome every day. Appointments are available Monday–Friday and Sundays; Saturdays are walk-in only.",
      },
      {
        q: "How late is the Keele shop open?",
        a: "Until 9:00 PM Tuesday through Saturday — one of the latest cuts you can get in North York.",
      },
    ],
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string }>;
}): Promise<Metadata> {
  const { location } = await params;
  const loc = getLocation(location);
  if (!loc) return {};
  const copy = COPY[loc.id];
  return {
    title: copy.h1,
    description: `${site.legalName} at ${loc.fullAddress}. Fades, haircuts, beard trims and kids' cuts. Walk-ins welcome 7 days, free parking, English & Spanish. Book by phone or online.`,
    alternates: { canonical: `/${loc.id}` },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location } = await params;
  const loc = getLocation(location);
  if (!loc) notFound();
  const copy = COPY[loc.id];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationJsonLd(loc)) }}
      />

      <SectionHeading
        as="h1"
        eyebrow={`${loc.area} · Walk-ins welcome · Se habla español`}
        title={copy.h1}
        titleEs={`Barbería en ${loc.address}`}
        center
        crest
      />
      <p className="mx-auto mt-6 max-w-2xl text-center text-muted">{copy.intro}</p>

      {/* Photo + status */}
      <Reveal>
        <div className="relative mt-10 h-64 overflow-hidden rounded-lg border border-edge sm:h-96">
          <Image
            src={loc.photo}
            alt={loc.photoAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent"
            aria-hidden="true"
          />
          <div className="absolute bottom-4 left-5 flex flex-wrap items-center gap-3">
            <p className="text-lg font-bold text-cream">{loc.fullAddress}</p>
            <OpenBadge location={loc} />
          </div>
        </div>
      </Reveal>

      {/* CTAs */}
      <Reveal>
        <div className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
          <Link
            href="/book"
            className="flex-1 rounded bg-red px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-deep"
          >
            Book {loc.name} Online
          </Link>
          <a
            href={site.phoneHref}
            className="flex-1 rounded border border-gold px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-gold transition-colors hover:bg-gold hover:text-ink"
          >
            Call {site.phone}
          </a>
        </div>
      </Reveal>

      {/* Hours + prices */}
      <div className="mt-16 grid gap-8 md:grid-cols-2">
        <Reveal>
          <div className="rounded-lg border border-edge bg-surface p-6">
            <h2 className="display text-2xl text-cream">Hours</h2>
            <table className="mt-4 w-full text-sm">
              <caption className="sr-only">Opening hours — {loc.name}</caption>
              <tbody>
                {loc.hoursDisplay.map((h) => (
                  <tr key={h.label} className="border-b border-edge/60 last:border-0">
                    <th scope="row" className="py-2.5 pr-4 text-left font-medium text-cream">
                      {h.label}
                    </th>
                    <td className="py-2.5 text-right text-muted">{h.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-muted">
              {site.holidayNote} Saturdays are walk-in only.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-lg border border-edge bg-surface p-6">
            <h2 className="display text-2xl text-cream">Prices at {loc.name}</h2>
            <table className="mt-4 w-full text-sm">
              <caption className="sr-only">Services and prices — {loc.name}</caption>
              <tbody>
                {loc.services.map((s) => (
                  <tr key={s.id} className="border-b border-edge/60 last:border-0">
                    <th scope="row" className="py-2.5 pr-4 text-left font-medium text-cream">
                      {s.name}
                      <span lang="es" className="ml-2 text-xs font-normal italic text-muted">
                        {s.nameEs}
                      </span>
                    </th>
                    <td className="py-2.5 text-right text-gold">{s.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link
              href="/services"
              className="mt-4 inline-block text-sm font-semibold text-gold underline-offset-4 hover:underline"
            >
              Full services &amp; details →
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Map */}
      <Reveal>
        <div className="mt-8">
          <iframe
            src={loc.mapsEmbedUrl}
            title={`Map — ${site.legalName}, ${loc.fullAddress}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-72 w-full rounded-lg border border-edge"
          />
          <a
            href={loc.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-semibold text-gold underline-offset-4 hover:underline"
          >
            Get directions on Google Maps →
          </a>
        </div>
      </Reveal>

      {/* Location FAQ */}
      <div className="mt-16">
        <Reveal>
          <SectionHeading
            eyebrow="Good to Know"
            title={`${loc.name} questions, answered`}
            titleEs="Preguntas frecuentes"
          />
        </Reveal>
        <div className="mt-8 space-y-4">
          {copy.faq.map((f) => (
            <Reveal key={f.q}>
              <div className="rounded-lg border border-edge bg-surface p-5">
                <h3 className="font-bold text-cream">{f.q}</h3>
                <p className="mt-2 text-sm text-muted">{f.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Cross-link to the other shop */}
      {locations
        .filter((l) => l.id !== loc.id)
        .map((other) => (
          <Reveal key={other.id}>
            <aside className="mt-16 rounded-lg border-l-4 border-gold bg-surface p-6">
              <p className="text-sm text-muted">
                Closer to {other.area}?{" "}
                <Link
                  href={`/${other.id}`}
                  className="font-semibold text-gold underline-offset-4 hover:underline"
                >
                  Visit our {other.name} shop at {other.fullAddress} →
                </Link>
              </p>
            </aside>
          </Reveal>
        ))}
    </div>
  );
}
