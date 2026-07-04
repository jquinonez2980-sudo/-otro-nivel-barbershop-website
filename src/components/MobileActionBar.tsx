import Link from "next/link";
import { site } from "@/data/site";

/**
 * Persistent bottom bar on mobile: the three actions a customer
 * deciding where to get cut *today* actually needs.
 */
export default function MobileActionBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-edge bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <a
        href={site.phoneHref}
        className="flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold text-cream"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
        Call
      </a>
      <Link
        href="/book"
        className="flex h-16 flex-col items-center justify-center gap-1 bg-red text-xs font-bold text-white"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        Book
      </Link>
      <Link
        href="/contact#locations"
        className="flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold text-cream"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        Directions
      </Link>
    </nav>
  );
}
