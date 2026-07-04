import { trustPoints } from "@/data/site";

const ICONS: Record<string, React.ReactNode> = {
  walk: (
    <path
      d="M13 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-4 17 2.5-6L9 13.5V9.5C9 8 10 7 11.5 7c1 0 1.8.4 2.4 1.2L15.5 10l3 1.5-.8 1.7-3.7-1.7-1.2-1.3V13l2.7 2.8L16.7 22h-2l-1-5-2.2-2-1.6 7H8Z"
      fill="currentColor"
    />
  ),
  parking: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  kids: (
    <>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 21a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 7.5c.5.7 1.2 1 2 1s1.5-.3 2-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9.5 15.5 11 17l3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  chat: (
    <>
      <path
        d="M21 12a8 8 0 0 1-8 8H4l2-3.2A8 8 0 1 1 21 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
};

export default function TrustStrip() {
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-edge bg-edge sm:grid-cols-3 lg:grid-cols-5">
      {trustPoints.map((point) => (
        <li
          key={point.icon}
          className="flex flex-col items-center gap-2 bg-surface px-4 py-6 text-center last:col-span-2 sm:last:col-span-1"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-gold">
            {ICONS[point.icon]}
          </svg>
          <span className="text-sm font-semibold text-cream">{point.en}</span>
          <span lang="es" className="text-xs italic text-muted">
            {point.es}
          </span>
        </li>
      ))}
    </ul>
  );
}
