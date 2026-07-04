const ITEMS = [
  "Fades",
  "Tapers",
  "Diseños",
  "Beard Sculpting",
  "Kids' Cuts",
  "Walk-ins Welcome",
  "Se Habla Español",
  "Open 7 Days",
];

/** Infinite editorial ticker — the list renders twice so the loop is seamless. */
export default function Marquee() {
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {ITEMS.map((item) => (
        <li key={item} className="flex shrink-0 items-center">
          <span className="display px-6 text-2xl text-cream/90 sm:px-8 sm:text-3xl">
            {item}
          </span>
          <span
            className="inline-block h-2 w-2 rotate-45 bg-red"
            aria-hidden="true"
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="marquee relative overflow-hidden border-y border-edge bg-surface py-4"
      aria-label="Fades, tapers, diseños, beard sculpting, kids' cuts — walk-ins welcome, se habla español, open 7 days"
    >
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
