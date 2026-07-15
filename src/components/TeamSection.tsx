import Image from "next/image";
import { team } from "@/data/site";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

/** Meet the team — barbershop loyalty is barber loyalty. */
export default function TeamSection() {
  return (
    <section aria-label="Meet the team" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Reveal>
        <SectionHeading
          eyebrow="The Team · El equipo"
          title="Who's behind the chair"
          titleEs="Quién está detrás de la silla"
        />
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member, i) => (
          <Reveal key={member.name} delay={i * 0.08}>
            <article className="overflow-hidden rounded-lg border border-edge bg-surface">
              <div className="relative h-48">
                <Image
                  src={member.photo}
                  alt={`${member.name} — ${member.role} at Otro Nivel Barbershop`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent"
                  aria-hidden="true"
                />
              </div>
              <div className="p-5">
                <h3 className="display text-xl text-cream">{member.name}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  {member.role}
                </p>
                <p lang="es" className="mt-0.5 text-xs italic text-muted">
                  {member.roleEs}
                </p>
                <p className="mt-3 text-sm text-muted">{member.bio}</p>
                <p lang="es" className="mt-2 text-sm italic text-muted/80">
                  {member.bioEs}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
