import Image from "next/image";
import Link from "next/link";
import type { Location } from "@/data/site";
import OpenBadge from "@/components/OpenBadge";

export default function LocationCard({ location }: { location: Location }) {
  return (
    <article className="overflow-hidden rounded-lg border border-edge bg-surface transition-colors hover:border-gold/50">
      <div className="relative h-48">
        <Image
          src={location.photo}
          alt={location.photoAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent" aria-hidden="true" />
        <h3 className="display absolute bottom-3 left-4 text-2xl text-cream">
          {location.name}
          <span className="ml-2 text-sm font-normal normal-case tracking-normal text-muted">
            {location.area}
          </span>
        </h3>
      </div>
      <div className="space-y-3 p-5">
        <p className="text-sm text-muted">{location.fullAddress}</p>
        <OpenBadge location={location} />
        <p className="text-xs text-muted">Free parking · Walk-ins welcome</p>
        <div className="flex gap-3 pt-1">
          <a
            href={location.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded border border-edge px-4 py-2.5 text-center text-sm font-semibold text-cream transition-colors hover:border-cream"
          >
            Get Directions
          </a>
          <Link
            href="/contact#locations"
            className="flex-1 rounded border border-edge px-4 py-2.5 text-center text-sm font-semibold text-cream transition-colors hover:border-cream"
          >
            Hours &amp; Info
          </Link>
        </div>
      </div>
    </article>
  );
}
