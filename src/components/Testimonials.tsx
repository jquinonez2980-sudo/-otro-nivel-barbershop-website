import { locations, reviewsSummary, site, testimonials } from "@/data/site";
import GoogleRatingBadge from "@/components/GoogleRatingBadge";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function Testimonials() {
  return (
    <section aria-labelledby="reviews-heading" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Google Reviews"
            title={`${reviewsSummary.reviewCount} reviews, one standard`}
            titleEs="Reseñas de verdad, un mismo estándar"
          />
          <GoogleRatingBadge
            ratingValue={reviewsSummary.ratingValue}
            reviewCount={reviewsSummary.reviewCount}
          />
        </div>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => {
          const loc = locations.find((l) => l.id === t.locationId)!;
          return (
            <Reveal key={t.quote} delay={i * 0.06}>
              <figure className="flex h-full flex-col justify-between rounded-lg border border-edge bg-surface p-6">
                <blockquote className="text-sm text-cream/90">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gold">{t.author ?? "Google review"}</span>
                  <span className="text-muted">{loc.name} shop</span>
                </figcaption>
              </figure>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-center">
        {locations.map((loc) => (
          <GoogleRatingBadge
            key={loc.id}
            ratingValue={site.reviews[loc.id].ratingValue}
            reviewCount={site.reviews[loc.id].reviewCount}
            mapsUrl={loc.mapsUrl}
            className="justify-center"
          />
        ))}
      </div>
    </section>
  );
}
