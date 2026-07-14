import type { Metadata } from "next";
import Link from "next/link";
import { site, faqs } from "@/data/site";
import PricingTabs from "@/components/PricingTabs";
import FAQ from "@/components/FAQ";
import EsmiBanner from "@/components/EsmiBanner";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description:
    "Haircuts, beard trims, kids' cuts and the VIP Service. Clear pricing for both Toronto locations — Weston Rd and Keele St. Walk-ins welcome.",
  alternates: {
    canonical: "/services",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Services & Pricing"
          title="Every cut, a otro nivel"
          titleEs="Precios claros, cortes precisos"
          center
          crest
        />
        <p className="mx-auto mt-6 max-w-2xl text-center text-muted">
          Pricing differs slightly between our two shops — pick your location
          below. No deposit to book, no cancellation fee, and walk-ins are
          always welcome.
        </p>

        <div className="mt-12">
          <PricingTabs />
        </div>

        {/* Walk-in policy */}
        <Reveal>
          <aside
            aria-label="Walk-in policy"
            className="mt-12 rounded-lg border-l-4 border-red bg-surface p-6"
          >
            <h2 className="font-bold text-cream">
              Walk-ins always welcome — Saturdays are walk-in <em>only</em>
            </h2>
            <p className="mt-2 text-sm text-muted">
              We take appointments Monday–Friday and Sundays. No appointments
              on Saturdays — first come, first served. Weekends get busy, so
              come early or visit during the week for the shortest wait.
            </p>
            <p lang="es" className="mt-2 text-sm italic text-muted">
              Los sábados atendemos solo sin cita — por orden de llegada.
            </p>
          </aside>
        </Reveal>

        <Reveal>
          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/book"
              className="rounded bg-red px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-deep"
            >
              Book an Appointment
            </Link>
            <a
              href={site.phoneHref}
              className="rounded border border-edge px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-cream transition-colors hover:border-cream"
            >
              Call {site.esmi.name} 24/7
            </a>
          </div>
        </Reveal>
      </div>

      {/* FAQ */}
      <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Good to Know"
            title="Frequently asked questions"
            titleEs="Preguntas frecuentes"
          />
        </Reveal>
        <Reveal>
          <div className="mt-8">
            <FAQ />
          </div>
        </Reveal>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <Reveal>
          <EsmiBanner />
        </Reveal>
      </div>
    </>
  );
}
