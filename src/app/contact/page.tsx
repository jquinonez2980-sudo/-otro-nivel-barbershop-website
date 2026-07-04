import type { Metadata } from "next";
import Image from "next/image";
import { site, locations } from "@/data/site";
import { locationsJsonLd } from "@/lib/jsonld";
import OpenBadge from "@/components/OpenBadge";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import EsmiBanner from "@/components/EsmiBanner";

export const metadata: Metadata = {
  title: "Contact & Locations",
  description:
    "Two Toronto locations: 2851 Weston Rd and 2266 Keele St, North York. Hours, directions, free parking. Call or text (647) 340-7187 — answered 24/7 in English & Spanish.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationsJsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Contact & Locations"
          title="Come through — we're easy to find"
          titleEs="Aquí te esperamos"
          center
        />

        {/* Contact channels */}
        <Reveal>
          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
            <a
              href={site.phoneHref}
              className="rounded-lg border border-edge bg-surface p-5 text-center transition-colors hover:border-gold/50"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                Call or Text
              </p>
              <p className="mt-2 font-semibold text-cream">{site.phone}</p>
              <p className="mt-1 text-xs text-muted">
                Answered 24/7 · English &amp; Español
              </p>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="rounded-lg border border-edge bg-surface p-5 text-center transition-colors hover:border-gold/50"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                Email
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-cream">
                {site.email}
              </p>
            </a>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-edge bg-surface p-5 text-center transition-colors hover:border-gold/50"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                Instagram
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-cream">
                {site.instagram.handle}
              </p>
              <p className="mt-1 text-xs text-muted">Fresh cuts daily</p>
            </a>
          </div>
        </Reveal>

        {/* Locations */}
        <div id="locations" className="mt-16 grid gap-8 lg:grid-cols-2">
          {locations.map((loc, i) => (
            <Reveal key={loc.id} delay={i * 0.1}>
              <article
                aria-labelledby={`loc-${loc.id}`}
                className="overflow-hidden rounded-lg border border-edge bg-surface"
              >
                <div className="relative h-52">
                  <Image
                    src={loc.photo}
                    alt={loc.photoAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent"
                    aria-hidden="true"
                  />
                  <h2
                    id={`loc-${loc.id}`}
                    className="display absolute bottom-3 left-5 text-3xl text-cream"
                  >
                    {loc.name}
                    <span className="ml-2 text-sm font-normal normal-case tracking-normal text-muted">
                      {loc.area}
                    </span>
                  </h2>
                </div>

                <div className="space-y-5 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-cream">{loc.fullAddress}</p>
                    <OpenBadge location={loc} />
                  </div>

                  <table className="w-full text-sm">
                    <caption className="sr-only">
                      Opening hours — {loc.name}
                    </caption>
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

                  <p className="text-xs text-muted">
                    Free parking · Walk-ins welcome · Saturdays walk-in only
                  </p>

                  <a
                    href={loc.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded bg-red px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-deep"
                  >
                    Get Directions
                  </a>

                  <iframe
                    src={loc.mapsEmbedUrl}
                    title={`Map — ${site.legalName}, ${loc.fullAddress}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-56 w-full rounded border border-edge"
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-10 text-center text-sm text-muted">
            {site.holidayNote}{" "}
            <span lang="es" className="italic">
              Abierto casi todos los días festivos.
            </span>
          </p>
        </Reveal>

        <div className="mt-16">
          <Reveal>
            <EsmiBanner />
          </Reveal>
        </div>
      </div>
    </>
  );
}
