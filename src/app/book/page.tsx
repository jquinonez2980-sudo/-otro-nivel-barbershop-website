import type { Metadata } from "next";
import { site } from "@/data/site";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import BookingWizard from "@/components/BookingWizard";

export const metadata: Metadata = {
  title: "Book Now",
  description:
    "Book online or call Esmi 24/7. Weston or Keele — English and Spanish. No deposit. Saturdays walk-in only.",
  alternates: {
    canonical: "/book",
  },
};

export default function BookPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Book Now · Reservar"
        title="Booked in 60 seconds — day or night"
        titleEs="Reserva en un minuto, a cualquier hora"
        center
        crest
      />
      <p className="mx-auto mt-6 max-w-2xl text-center text-muted">
        Book online below, or call/text Esmi — same calendars, no double-booking.{" "}
        {site.esmi.blurb}
      </p>

      {/* Phone / text equal citizen CTAs */}
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
        <p className="mt-3 text-center text-sm text-muted">
          Prefer to talk?{" "}
          <strong className="text-cream">{site.esmi.name}</strong> answers 24/7
          in English or Spanish.
        </p>
      </Reveal>

      {/* Online wizard */}
      <div className="mt-16">
        <Reveal>
          <SectionHeading
            eyebrow="Online · En línea"
            title="Book your cut online"
            titleEs="Reserva tu corte en línea"
            center
          />
        </Reveal>
        <BookingWizard />
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
              <span lang="es" className="italic">
                Sábados solo sin cita.
              </span>
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
