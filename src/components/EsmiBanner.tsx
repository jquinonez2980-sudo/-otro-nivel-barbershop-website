import { site } from "@/data/site";

export default function EsmiBanner() {
  return (
    <section
      aria-labelledby="esmi-heading"
      className="rounded-lg border border-gold/40 bg-surface p-8 sm:p-10"
    >
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-gold">
            24/7 Booking · English &amp; Español
          </p>
          <h2 id="esmi-heading" className="display text-2xl text-cream sm:text-3xl">
            Never wait for opening hours — {site.esmi.name} answers anytime
          </h2>
          <p className="mt-3 max-w-xl text-muted">
            {site.esmi.blurb}{" "}
            <span lang="es" className="italic">
              {site.esmi.blurbEs}
            </span>
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row md:flex-col">
          <a
            href={site.phoneHref}
            className="rounded bg-red px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-deep"
          >
            Call {site.phone}
          </a>
          <a
            href={site.smsHref}
            className="rounded border border-gold px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-gold transition-colors hover:bg-gold hover:text-ink"
          >
            Text to Book
          </a>
        </div>
      </div>
    </section>
  );
}
