import type { Metadata } from "next";
import { site, locations } from "@/data/site";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import OpenBadge from "@/components/OpenBadge";

export const metadata: Metadata = {
  title: "Book Now",
  description:
    "Book in 60 seconds, day or night. Call or text (647) 340-7187 — Esmi answers 24/7 in English and Spanish. No deposit. Saturdays walk-in only.",
  alternates: {
    canonical: "/book",
  },
};

const STEPS = [
  {
    title: "Call or text, any hour",
    body: `${site.esmi.name} picks up 24/7 — before work, after close, whenever. English o español.`,
  },
  {
    title: "Say what you need",
    body: "Your service, your location — Weston or Keele — and the day and time that works for you.",
  },
  {
    title: "Get your confirmation text",
    body: "Booked in about 60 seconds. You'll receive a confirmation text right away. No deposit required.",
  },
];

export default function BookPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Book Now · Reservar"
        title="Booked in 60 seconds — day or night"
        titleEs="Reserva en un minuto, a cualquier hora"
        center
      />
      <p className="mx-auto mt-6 max-w-2xl text-center text-muted">
        {site.esmi.blurb}
      </p>

      {/* Primary actions */}
      <Reveal>
        <div className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row">
          <a
            href={site.phoneHref}
            className="flex-1 rounded bg-red px-8 py-5 text-center text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-deep"
          >
            Call {site.phone}
          </a>
          <a
            href={site.smsHref}
            className="flex-1 rounded border border-gold px-8 py-5 text-center text-base font-bold uppercase tracking-wide text-gold transition-colors hover:bg-gold hover:text-ink"
          >
            Text to Book
          </a>
        </div>
      </Reveal>

      {/* How it works */}
      <div className="mt-16 grid gap-4 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.1}>
            <div className="h-full rounded-lg border border-edge bg-surface p-6">
              <p className="display text-3xl text-gold" aria-hidden="true">
                {i + 1}
              </p>
              <h2 className="mt-3 font-bold text-cream">{step.title}</h2>
              <p className="mt-2 text-sm text-muted">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Choose a location */}
      <div className="mt-16">
        <Reveal>
          <SectionHeading eyebrow="Step One" title="Pick your shop" />
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {locations.map((loc, i) => (
            <Reveal key={loc.id} delay={i * 0.1}>
              <div className="rounded-lg border border-edge bg-surface p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="display text-2xl text-cream">{loc.name}</h3>
                    <p className="mt-1 text-sm text-muted">{loc.fullAddress}</p>
                  </div>
                  <OpenBadge location={loc} />
                </div>
                <a
                  href={site.phoneHref}
                  className="mt-5 block rounded bg-red px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-deep"
                >
                  Book {loc.name} by Phone
                </a>
                <p className="mt-3 text-center text-xs text-muted">
                  Online calendar booking coming soon
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Booking notes */}
      <Reveal>
        <aside
          aria-label="Booking policies"
          className="mt-16 rounded-lg border-l-4 border-gold bg-surface p-6"
        >
          <h2 className="font-bold text-cream">Before you book</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <strong className="text-cream">Saturdays are walk-in only</strong> — no
              appointments, first come first served.{" "}
              <span lang="es" className="italic">Sábados solo sin cita.</span>
            </li>
            <li>Appointments available Monday–Friday and Sundays.</li>
            <li>No deposit required, no cancellation fee — a heads-up is appreciated.</li>
            <li>Walk-ins are welcome every day at both shops.</li>
            <li>Weekend waits run longer — weekdays are quickest.</li>
          </ul>
        </aside>
      </Reveal>
    </div>
  );
}
