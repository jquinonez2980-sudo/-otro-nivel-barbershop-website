import Image from "next/image";
import Link from "next/link";
import { site, featuredServices } from "@/data/site";
import { locationsJsonLd } from "@/lib/jsonld";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import TrustStrip from "@/components/TrustStrip";
import EsmiBanner from "@/components/EsmiBanner";
import HeroCinematic from "@/components/HeroCinematic";
import Marquee from "@/components/Marquee";
import ExperienceSection from "@/components/ExperienceSection";
import WorkGallery, { type WorkPhoto } from "@/components/WorkGallery";
import VideoReel from "@/components/VideoReel";
import StatsStrip from "@/components/StatsStrip";
import ShopsShowcase from "@/components/ShopsShowcase";

const WORK: WorkPhoto[] = [
  { src: "/media/cut-eagle-design.jpg", alt: "Freestyle eagle design razored into a low fade" },
  { src: "/media/cut-skin-fade.jpg", alt: "Crisp skin fade, side profile" },
  { src: "/media/cut-wave-design.jpg", alt: "Wave pattern design carved into a taper fade" },
  { src: "/media/cut-taper-beard.jpg", alt: "Taper fade blended into a full sculpted beard" },
  { src: "/media/cut-lightning-design.jpg", alt: "Lightning bolt design cut into the back of a fade" },
  { src: "/media/cut-razor-part.jpg", alt: "Hard razor part with a clean line-up" },
  { src: "/media/cut-pompadour.jpg", alt: "Slicked pompadour with a mid fade" },
  { src: "/media/cut-fade-tattoo.jpg", alt: "Low fade with a razor design behind the ear" },
  { src: "/media/cut-beard-sculpt.jpg", alt: "Full beard shaped and lined to the jaw" },
  { src: "/media/cut-crop-top.jpg", alt: "Textured crop with a high skin fade" },
  { src: "/media/cut-kids-fade.jpg", alt: "Kids' fade with a soft blended top" },
  { src: "/media/cut-waves-profile.jpg", alt: "Deep 360 waves with a sharp line-up" },
  { src: "/media/cut-crisp-line.jpg", alt: "High and tight fade with a crisp front line" },
  { src: "/media/cut-textured-crop.jpg", alt: "Wavy textured top with a clean taper" },
  { src: "/media/cut-fresh-fade.jpg", alt: "Fresh mid fade seen from the side" },
  { src: "/media/cut-design-lines.jpg", alt: "Double slash design over a drop fade" },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationsJsonLd) }}
      />

      <HeroCinematic />

      <Marquee />

      {/* ——— Trust strip ——— */}
      <section aria-label="Why Otro Nivel" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <TrustStrip />
        </Reveal>
      </section>

      {/* ——— The experience ——— */}
      <ExperienceSection />

      {/* ——— Services teaser ——— */}
      <section aria-labelledby="services-teaser" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Services"
              title="Cuts crafted with precision"
              titleEs="Cortes con precisión"
            />
            <Link
              href="/services"
              className="text-sm font-semibold text-gold underline-offset-4 hover:underline"
            >
              Full pricing by location →
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredServices.map((service, i) => (
            <Reveal key={service.name} delay={i * 0.08}>
              <Link
                href="/services"
                className="group flex h-full flex-col rounded-lg border border-edge bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:bg-surface-2 hover:shadow-[0_12px_40px_-12px_rgba(201,162,75,0.25)]"
              >
                <div className="flex items-start justify-between">
                  <span aria-hidden="true" className="display text-sm text-muted/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {service.badge && (
                    <span className="rounded-full border border-gold/60 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-gold">
                      {service.badge}
                    </span>
                  )}
                </div>
                <h3 className="display mt-3 text-xl text-cream">{service.name}</h3>
                <p lang="es" className="text-sm italic text-muted">
                  {service.nameEs}
                </p>
                <p className="mt-3 flex-1 text-sm text-muted">{service.description}</p>
                <p className="mt-4 text-lg font-bold text-gold">{service.from}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— Work gallery ——— */}
      <section
        aria-labelledby="work-heading"
        className="border-y border-edge bg-surface/40 py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow="The Work"
                title="The work speaks for itself"
                titleEs="El trabajo habla por sí solo"
              />
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-4 py-2 text-sm font-semibold text-gold transition-colors hover:border-gold hover:bg-gold/10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
                </svg>
                Fresh cuts daily — {site.instagram.handle}
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            </div>
          </Reveal>
          <div className="mt-10">
            <WorkGallery photos={WORK} />
          </div>
        </div>
      </section>

      {/* ——— YouTube reel ——— */}
      <section
        aria-label="Videos from our YouTube channel"
        className="mx-auto max-w-6xl px-4 py-20 sm:px-6"
      >
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow={`On YouTube · ${site.youtube.subscribers} subscribers`}
              title="Watch the work in motion"
              titleEs="Mira el trabajo en acción"
            />
          </div>
        </Reveal>
        <VideoReel />
      </section>

      {/* ——— Numbers ——— */}
      <section aria-label="Otro Nivel by the numbers" className="mx-auto max-w-6xl border-t border-edge px-4 py-20 sm:px-6">
        <Reveal>
          <StatsStrip />
        </Reveal>
      </section>

      {/* ——— Locations ——— */}
      <section aria-labelledby="locations-heading" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Two Shops, One Standard"
            title="Walk in — we're close by"
            titleEs="Dos locales en Toronto"
          />
        </Reveal>
        <div className="mt-10">
          <ShopsShowcase />
        </div>
      </section>

      {/* ——— Esmi ——— */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <Reveal>
          <EsmiBanner />
        </Reveal>
      </section>

      {/* ——— Final CTA ——— */}
      <section aria-labelledby="cta-heading" className="relative overflow-hidden">
        <Image
          src="/media/keele-hall-2.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-red/85 mix-blend-multiply" aria-hidden="true" />
        <div className="absolute inset-0 bg-ink/30" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
          <h2 id="cta-heading" className="display text-4xl text-white sm:text-6xl">
            Ready for a fresh cut?
          </h2>
          <p lang="es" className="-mt-3 text-xl italic text-white/90">
            ¿Listo para un corte fresco?
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/book"
              className="rounded bg-ink px-9 py-4 text-sm font-bold uppercase tracking-wide text-cream transition-colors hover:bg-black"
            >
              Book Now
            </Link>
            <a
              href={site.phoneHref}
              className="rounded border border-white/70 px-9 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
            >
              Call {site.phone}
            </a>
          </div>
          <p className="text-sm font-medium text-white">
            Walk-ins always welcome · Saturdays walk-in only
          </p>
        </div>
      </section>
    </>
  );
}
