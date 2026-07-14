import Link from "next/link";
import Image from "next/image";
import { site, locations } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-edge bg-surface">
      <div className="brand-accent h-0.5 w-full" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <Image
            src="/images/logo-circle.webp"
            alt={`${site.legalName} logo`}
            width={96}
            height={96}
            className="mb-4 h-24 w-24 object-contain"
          />
          <p className="display text-lg text-cream">Otro Nivel</p>
          <p className="mt-1 text-sm text-muted">
            {site.tagline}.{" "}
            <span lang="es" className="italic">
              {site.taglineEs}.
            </span>
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gold">
            Pages
          </h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="text-muted transition-colors hover:text-cream">Home</Link></li>
            <li><Link href="/services" className="text-muted transition-colors hover:text-cream">Services &amp; Pricing</Link></li>
            <li><Link href="/contact" className="text-muted transition-colors hover:text-cream">Contact &amp; Locations</Link></li>
            <li><Link href="/book" className="text-muted transition-colors hover:text-cream">Book Now</Link></li>
          </ul>
        </nav>

        {locations.map((loc) => (
          <div key={loc.id}>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gold">
              {loc.name} · {loc.area}
            </h2>
            <p className="text-sm text-muted">
              {loc.address}
              <br />
              {loc.city} {loc.postalCode}
            </p>
            <ul className="mt-3 space-y-1 text-sm text-muted">
              {loc.hoursDisplay.map((h) => (
                <li key={h.label}>
                  <span className="text-cream">{h.label}:</span> {h.value}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-edge">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-muted sm:px-6 md:flex-row">
          <div className="flex items-center gap-5">
            <a href={site.phoneHref} className="transition-colors hover:text-cream">
              {site.phone}
            </a>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram — ${site.instagram.handle}`}
              className="transition-colors hover:text-cream"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
              </svg>
            </a>
            <a
              href={site.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`TikTok — ${site.tiktok.handle}`}
              className="transition-colors hover:text-cream"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M16.5 3v9.8a3.2 3.2 0 1 1-2.5-3.12V7.1a5.7 5.7 0 1 0 4.9 5.64V9.6a6.9 6.9 0 0 0 3.6 1.02V8.1a4.1 4.1 0 0 1-3.3-2.02A4.4 4.4 0 0 1 18.5 3h-2Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              href={site.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook page"
              className="transition-colors hover:text-cream"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M14 8.5V7a1.5 1.5 0 0 1 1.5-1.5H17V2.5h-2.5A4.5 4.5 0 0 0 10 7v1.5H8V12h2v9.5h4V12h2.5l.5-3.5h-3Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href={site.youtube.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`YouTube — ${site.youtube.handle}`}
              className="transition-colors hover:text-cream"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2.5" y="6" width="19" height="12.5" rx="3" stroke="currentColor" strokeWidth="1.8" />
                <path d="M10.5 9.75v5l4.5-2.5-4.5-2.5Z" fill="currentColor" />
              </svg>
            </a>
          </div>
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p className="text-xs">
            {site.holidayNote} · Powered by {site.esmi.name}, our 24/7 AI receptionist
          </p>
        </div>
      </div>
    </footer>
  );
}
