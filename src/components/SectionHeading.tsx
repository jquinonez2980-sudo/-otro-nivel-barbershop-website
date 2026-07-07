/** Consistent section header: blue eyebrow, display title, optional Spanish echo, brand-accent keyline. */
export default function SectionHeading({
  eyebrow,
  title,
  titleEs,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  titleEs?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      {eyebrow && (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-blue-bright">
          {eyebrow}
        </p>
      )}
      <h2 className="display text-3xl text-cream sm:text-4xl">{title}</h2>
      {titleEs && (
        <p lang="es" className="mt-2 text-lg italic text-gold">
          {titleEs}
        </p>
      )}
      <div
        className={`brand-accent mt-4 h-1 w-20 rounded-full ${center ? "mx-auto" : ""}`}
        aria-hidden="true"
      />
    </div>
  );
}
