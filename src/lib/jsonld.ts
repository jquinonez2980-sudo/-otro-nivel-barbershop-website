import { site, locations, type Location } from "@/data/site";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function toIsoTime(decimalHour: number): string {
  const h = Math.floor(decimalHour);
  const m = Math.round((decimalHour - h) * 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function locationJsonLd(loc: Location) {
  const graph: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    "@id": `${site.url}/${loc.id}#shop`,
    name: `${site.legalName} — ${loc.name}`,
    alternateName: [site.name, site.shortName, "A Otro Nivel Barbershop"],
    image: `${site.url}${loc.photo}`,
    url: `${site.url}/${loc.id}`,
    hasMap: loc.mapsUrl,
    telephone: site.phoneE164,
    email: site.email,
    priceRange: "$20–$60",
    address: {
      "@type": "PostalAddress",
      streetAddress: loc.address,
      addressLocality: loc.city.replace(", ON", ""),
      addressRegion: "ON",
      postalCode: loc.postalCode,
      addressCountry: "CA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: loc.geo.lat,
      longitude: loc.geo.lng,
    },
    openingHoursSpecification: loc.weekHours.map((h, day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAY_NAMES[day],
      opens: toIsoTime(h.open),
      closes: toIsoTime(h.close),
    })),
    sameAs: [site.instagram.url, site.tiktok.url, site.facebook.url, site.youtube.url],
  };

  // Only emit aggregateRating when real review stats are configured (never invent).
  if (site.reviews?.ratingValue && site.reviews?.reviewCount) {
    graph.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: site.reviews.ratingValue,
      reviewCount: site.reviews.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return graph;
}

/** LocalBusiness JSON-LD for every location — one entry per shop. */
export const locationsJsonLd = locations.map(locationJsonLd);
