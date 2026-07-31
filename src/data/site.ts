/**
 * Single source of truth for all business data.
 * Prices, hours, addresses, and contact info live here ONLY —
 * every page, table, and JSON-LD block is generated from this file.
 */

export type Service = {
  /** Stable id shared with Esmi booking API (e.g. regular-haircut, vip-package) */
  id: string;
  name: string;
  nameEs: string;
  price: string;
  duration: string;
  /** Duration in minutes for calendar slot length */
  durationMin: number;
  featured?: boolean;
  badge?: string;
};

export type DayRange = {
  /** 0 = Sunday … 6 = Saturday */
  open: number;
  close: number;
};

export type Location = {
  id: "weston" | "keele";
  name: string;
  area: string;
  address: string;
  city: string;
  postalCode: string;
  fullAddress: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
  /** WGS84 coordinates for JSON-LD geo + maps */
  geo: { lat: number; lng: number };
  /** Indexed 0 (Sunday) → 6 (Saturday), 24h decimal hours */
  weekHours: DayRange[];
  hoursDisplay: { label: string; value: string }[];
  /**
   * Days that accept online/phone appointments (JS getDay: 0=Sun … 6=Sat).
   * Saturdays are open for walk-ins but excluded here.
   */
  bookingDays: number[];
  services: Service[];
  photo: string;
  photoAlt: string;
};

/** Days of week (JS getDay) that accept appointments — Mon–Fri + Sun. */
export const APPOINTMENT_DAYS = [0, 1, 2, 3, 4, 5] as const;

export const site = {
  legalName: "A Otro Nivel Barber Shop",
  name: "Otro Nivel Barbershop",
  shortName: "Otro Nivel",
  /** Visible brand tagline — includes primary local SEO cities. */
  tagline: "The Premier Latino Barbershop in Toronto & North York",
  taglineEs: "La barbería latina de Toronto y North York",
  url: "https://otronivelbarbershop.com",
  /**
   * Canonical on-site NAP phone for both shops.
   * Never list 416-901-1218 (old directory listing).
   * Note: GOOGLE-PROFILE.md lists (647) 340-7187 for GBP — owner must align
   * Google Business Profile and the website to the same primary number.
   */
  phone: "(437) 292-3949",
  phoneE164: "+14372923949",
  phoneHref: "tel:+14372923949",
  smsHref: "sms:+14372923949",
  email: "info@otronivelbarbershop.com",
  instagram: {
    handle: "@aotronivelbarbershop02",
    url: "https://www.instagram.com/aotronivelbarbershop02",
  },
  tiktok: {
    handle: "@aotronivelbarbers",
    url: "https://www.tiktok.com/@aotronivelbarbers",
  },
  facebook: {
    label: "A Otro Nivel Barbershop",
    url: "https://www.facebook.com/a.otro.nivel.barbershop",
  },
  youtube: {
    handle: "@AOtroNivelBarbershop",
    url: "https://www.youtube.com/@AOtroNivelBarbershop",
    subscribers: "22k+",
  },
  esmi: {
    name: "Esmi",
    blurb:
      "Esmi is our AI receptionist. She answers every call and text, day or night, in English or Spanish — and books you in about 60 seconds.",
    blurbEs: "Esmi contesta 24/7 en inglés o español.",
  },
  holidayNote:
    "Open on most statutory holidays. Closed Christmas Day and New Year's Day.",
  owners: "Dawna Temporal & Freilin De Los Santos",
  /**
   * Google review short links — fill from GBP → Ask for reviews.
   * Used by Esmi post-visit SMS and contact CTAs once configured.
   */
  googleReviewUrl: {
    weston: "https://g.page/r/CUTNDAMw16SqEBM/review",
    keele: "https://g.page/r/CSO_S7k7Pm8gEBM/review",
  },
  /**
   * Verified per-location Google review stats, pulled directly from each
   * shop's Google Business Profile (checked 2026-07-30). JSON-LD
   * aggregateRating is emitted per shop from these — never invent numbers.
   */
  reviews: {
    weston: { ratingValue: "4.9", reviewCount: 148 },
    keele: { ratingValue: "4.9", reviewCount: 465 },
  },
} as const;

/** Combined rating across both shops, weighted by review count. */
export const reviewsSummary = (() => {
  const stats = Object.values(site.reviews);
  const reviewCount = stats.reduce((sum, s) => sum + s.reviewCount, 0);
  const weighted = stats.reduce((sum, s) => sum + Number(s.ratingValue) * s.reviewCount, 0);
  return { ratingValue: (weighted / reviewCount).toFixed(1), reviewCount };
})();

export const locations: Location[] = [
  {
    id: "weston",
    name: "Weston",
    area: "Toronto",
    address: "2851 Weston Road",
    city: "Toronto, ON",
    postalCode: "M9M 2S1",
    fullAddress: "2851 Weston Road, Toronto, ON M9M 2S1",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=A+Otro+Nivel+Barber+Shop+2851+Weston+Road+Toronto+ON+M9M+2S1",
    mapsEmbedUrl:
      "https://www.google.com/maps?q=2851+Weston+Road,+Toronto,+ON+M9M+2S1&output=embed",
    geo: { lat: 43.72105, lng: -79.53704 },
    weekHours: [
      { open: 10, close: 17 }, // Sun
      { open: 10, close: 19 }, // Mon
      { open: 10, close: 20 }, // Tue
      { open: 10, close: 20 }, // Wed
      { open: 10, close: 20 }, // Thu
      { open: 10, close: 20 }, // Fri
      { open: 10, close: 20 }, // Sat
    ],
    hoursDisplay: [
      { label: "Monday", value: "10:00 AM – 7:00 PM" },
      { label: "Tuesday – Saturday", value: "10:00 AM – 8:00 PM" },
      { label: "Sunday", value: "10:00 AM – 5:00 PM" },
    ],
    bookingDays: [0, 1, 2, 3, 4, 5],
    services: [
      { id: "regular-haircut", name: "Haircut", nameEs: "Corte", price: "$40", duration: "35 min", durationMin: 35, featured: true },
      { id: "fade", name: "Fade", nameEs: "Fade", price: "$40–$45", duration: "40 min", durationMin: 40, featured: true },
      { id: "fade-beard", name: "Fade and Beard Trim", nameEs: "Fade y barba", price: "$50–$55", duration: "40 min", durationMin: 40, featured: true },
      { id: "beard-trim", name: "Beard Trim and Line Up", nameEs: "Barba y contorno", price: "$25", duration: "20 min", durationMin: 20 },
      { id: "line-up", name: "Line-Up", nameEs: "Contorno", price: "$20", duration: "15 min", durationMin: 15 },
      {
        id: "vip-package",
        name: "VIP Service (Haircut, Hot Towel, Cream Facial, Beard Trim)",
        nameEs: "Servicio VIP (Corte, Toalla Caliente, Facial de Crema, Barba)",
        price: "$60",
        duration: "45 min",
        durationMin: 45,
        featured: true,
        badge: "Weston Exclusive",
      },
      { id: "kids-haircut", name: "Kids Haircut (10 and under)", nameEs: "Corte para niños (10 años o menos)", price: "$30", duration: "35 min", durationMin: 35 },
    ],
    photo: "/media/weston-hall.jpg",
    photoAlt:
      "Inside the Weston Road shop — hexagon ceiling lights, gold barber chairs, and the red, white and blue Dominican wall",
  },
  {
    id: "keele",
    name: "Keele",
    area: "North York",
    address: "2266 Keele Street",
    city: "North York, ON",
    postalCode: "M6M 3Y9",
    fullAddress: "2266 Keele Street, North York, ON M6M 3Y9",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=A+Otro+Nivel+Barber+Shop+2266+Keele+Street+North+York+ON+M6M+3Y9",
    mapsEmbedUrl:
      "https://www.google.com/maps?q=2266+Keele+Street,+North+York,+ON+M6M+3Y9&output=embed",
    geo: { lat: 43.70234, lng: -79.47694 },
    weekHours: [
      { open: 10, close: 19 }, // Sun
      { open: 10, close: 19 }, // Mon
      { open: 10, close: 21 }, // Tue
      { open: 10, close: 21 }, // Wed
      { open: 10, close: 21 }, // Thu
      { open: 10, close: 21 }, // Fri
      { open: 10, close: 21 }, // Sat
    ],
    hoursDisplay: [
      { label: "Monday", value: "10:00 AM – 7:00 PM" },
      { label: "Tuesday – Saturday", value: "10:00 AM – 9:00 PM" },
      { label: "Sunday", value: "10:00 AM – 7:00 PM" },
    ],
    bookingDays: [0, 1, 2, 3, 4, 5],
    services: [
      { id: "regular-haircut", name: "Haircut", nameEs: "Corte", price: "$35", duration: "35 min", durationMin: 35, featured: true },
      { id: "fade", name: "Fade", nameEs: "Fade", price: "$35–$40", duration: "40 min", durationMin: 40, featured: true },
      { id: "fade-beard", name: "Fade and Beard Trim", nameEs: "Fade y barba", price: "$50", duration: "40 min", durationMin: 40, featured: true },
      { id: "beard-trim", name: "Beard Trim and Line Up", nameEs: "Barba y contorno", price: "$20", duration: "20 min", durationMin: 20 },
      { id: "line-up", name: "Line-Up", nameEs: "Contorno", price: "$20", duration: "15 min", durationMin: 15 },
      { id: "kids-haircut", name: "Kids Haircut (10 and under)", nameEs: "Corte para niños (10 años o menos)", price: "$30", duration: "35 min", durationMin: 35 },
    ],
    photo: "/media/keele-hall.jpg",
    photoAlt:
      "Barbers working side by side at the Keele Street shop in North York",
  },
];

/**
 * Parse a price string like "$40–$50", "from $35", or "$60" into min/max dollars.
 * Used so homepage teaser prices always match location service tables.
 */
function parsePriceBounds(price: string): { min: number; max: number } | null {
  const nums = price.match(/\d+/g)?.map(Number);
  if (!nums || nums.length === 0) return null;
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

function fromPriceLabel(prices: string[]): string {
  const bounds = prices
    .map(parsePriceBounds)
    .filter((b): b is { min: number; max: number } => b !== null);
  if (bounds.length === 0) return "";
  const min = Math.min(...bounds.map((b) => b.min));
  const max = Math.max(...bounds.map((b) => b.max));
  if (min === max) return `$${min}`;
  return `from $${min}`;
}

/**
 * Homepage service teaser — prices derived from location.services so they
 * cannot drift from the services page or booking wizard.
 */
export const featuredServices = [
  {
    name: "Fade",
    nameEs: "Fade",
    from: fromPriceLabel(
      locations.flatMap((l) =>
        l.services.filter((s) => s.id === "fade").map((s) => s.price),
      ),
    ),
    description:
      "Skin, taper, drop — blended to the line. Weston $40–$45 · Keele $35–$40.",
  },
  {
    name: "VIP Service",
    nameEs: "Servicio VIP",
    from: fromPriceLabel(
      locations.flatMap((l) =>
        l.services.filter((s) => s.id === "vip-package").map((s) => s.price),
      ),
    ),
    description: "Haircut, hot towel service, cream facial, and beard trim.",
    badge: "Weston Exclusive",
  },
  {
    name: "Beard Trim and Line Up",
    nameEs: "Barba y contorno",
    from: fromPriceLabel(
      locations.flatMap((l) =>
        l.services.filter((s) => s.id === "beard-trim").map((s) => s.price),
      ),
    ),
    description: "Shaped, lined, and conditioned. Both locations.",
  },
  {
    name: "Kids' Haircut",
    nameEs: "Corte para niños",
    from: fromPriceLabel(
      locations.flatMap((l) =>
        l.services.filter((s) => s.id === "kids-haircut").map((s) => s.price),
      ),
    ),
    description: "Kids and babies welcome — patient barbers, clean cuts.",
  },
];

/** Meet the team — loyalty is barber loyalty. Expand as portraits land. */
export const team = [
  {
    name: "Freilin De Los Santos",
    role: "Owner / Master Barber",
    roleEs: "Dueño / Barbero maestro",
    bio: "Co-owner and the hands behind the flagship look — fades, designs, and the VIP standard that put Weston on the map.",
    bioEs: "Co-dueño y la mano detrás del estilo insignia — fades, diseños y el estándar VIP de Weston.",
    photo: "/media/weston-gold-chairs.jpg",
  },
  {
    name: "Dawna Temporal",
    role: "Owner / Operations",
    roleEs: "Dueña / Operaciones",
    bio: "Co-owner keeping both shops running sharp — the culture, the community, and the standard that every chair has to hit.",
    bioEs: "Co-dueña que mantiene ambos locales al nivel — la cultura, la comunidad y el estándar de cada silla.",
    photo: "/media/weston-hall.jpg",
  },
  {
    name: "The Crew",
    role: "Barbers — Weston & Keele",
    roleEs: "Barberos — Weston y Keele",
    bio: "Dominican-rooted barbers who speak English and Spanish, welcome kids, and treat every fade like it's going on the feed.",
    bioEs: "Barberos de raíz dominicana que hablan inglés y español, reciben niños y tratan cada fade como si fuera al feed.",
    photo: "/media/keele-hall.jpg",
  },
] as const;

export const trustPoints = [
  { en: "Walk-ins Welcome", es: "Sin cita, bienvenido", icon: "walk" },
  { en: "Free Parking", es: "Estacionamiento gratis", icon: "parking" },
  { en: "Kids & Babies Welcome", es: "Niños y bebés bienvenidos", icon: "kids" },
  { en: "Open 7 Days a Week", es: "Abierto los 7 días", icon: "calendar" },
  { en: "English & Español", es: "Inglés y español", icon: "chat" },
] as const;

export const faqs = [
  {
    q: "Do I need an appointment?",
    a: "Walk-ins are always welcome at both locations. If you'd like to guarantee a time, we book appointments Monday through Friday and on Sundays. Saturdays are walk-in only — no appointments.",
  },
  {
    q: "How long is the wait on weekends?",
    a: "Weekends are our busiest time, especially Saturdays. Come early, or visit during the week for the shortest wait.",
  },
  {
    q: "Is parking free?",
    a: "Yes — free parking at both the Weston Road and Keele Street locations.",
  },
  {
    q: "Do you cut kids' and babies' hair?",
    a: "Yes! We do haircuts for kids and babies at both locations. Our barbers are patient and great with little ones.",
  },
  {
    q: "Do I need a deposit to book?",
    a: "No deposit required — and no cancellation fee. If your plans change, a courtesy heads-up is always appreciated.",
  },
  {
    q: "Are you open on holidays?",
    a: "Yes, we're open on most statutory holidays. The only days we close are Christmas Day and New Year's Day.",
  },
  {
    q: "¿Hablan español?",
    a: "¡Claro que sí! Our barbers speak Spanish and English, and Esmi — our phone receptionist — answers 24/7 in both languages.",
  },
  {
    q: "Which location should I go to?",
    a: "Whichever is closer! Weston Road (Toronto) and Keele Street (North York) both take walk-ins every day. Hours and some prices differ slightly — check the tables above.",
  },
  {
    q: "Where can I find a Latino barbershop in Toronto?",
    a: "A Otro Nivel Barber Shop is a Dominican-owned Latino barbershop at 2851 Weston Road, Toronto (M9M 2S1). Walk-ins welcome 7 days a week for fades, haircuts, beard trims, and kids' cuts — English and Spanish spoken.",
  },
  {
    q: "Where is the best barbershop in North York for a fade?",
    a: "Our North York shop is at 2266 Keele Street (M6M 3Y9). Same Otro Nivel standard as Toronto — expert fades, beard work, and kids' cuts — with free parking, walk-ins every day, and hours until 9 PM most nights.",
  },
];

export type Testimonial = {
  quote: string;
  /** Reviewer first + last-initial, or omitted for a Google-curated highlight snippet. */
  author?: string;
  locationId: "weston" | "keele";
};

/**
 * Verbatim quotes pulled from each shop's Google reviews (checked 2026-07-30).
 * Only complete, untruncated quotes — never partial "…more" text.
 */
export const testimonials: Testimonial[] = [
  { quote: "Excellent hair cut, friendly staff and artistic hair cut.", locationId: "weston" },
  {
    quote:
      "It was a very good experience. Great job in the haircut. I will definitely come back I found my new barber.",
    author: "Michael M.",
    locationId: "weston",
  },
  { quote: "You can't beat the price for the quality!!", locationId: "weston" },
  { quote: "Clean place, friendly service, 3 languages — Spanish, English, Turkish sometimes.", locationId: "keele" },
  {
    quote:
      "Fantastic experience. The shop was clean and had a great vibe. They took the time to understand exactly what I wanted and gave me one of the cleanest fades I've ever had. Super professional and no long wait. Highly recommend!",
    author: "Daniel A.",
    locationId: "keele",
  },
  { quote: "Amazing haircut and beard services, definitely will come again.", locationId: "keele" },
];

/** Shared SEO copy driven from NAP so titles/meta cannot invent locations. */
export const seoCopy = {
  home: {
    title: "Latino Barbershop in Toronto & North York — Fades, Beards & Walk-ins",
    description:
      "A Otro Nivel Barber Shop — premium Latino barbershop with two locations: 2851 Weston Road (Toronto) and 2266 Keele Street (North York). Expert fades, beard trims, kids' cuts. Walk-ins welcome. English & Spanish.",
  },
  services: {
    title: "Barber Services & Pricing — Toronto & North York",
    description:
      "Haircuts, beard trims, kids' cuts and VIP Service. Clear pricing for our Toronto barbershop on Weston Road and North York shop on Keele Street. Walk-ins welcome.",
  },
  contact: {
    title: "Contact & Barbershop Locations — Toronto & North York",
    description:
      "Find our barbers: 2851 Weston Rd, Toronto and 2266 Keele St, North York. Hours, directions, free parking. Call or text (437) 292-3949 — answered 24/7 in English & Spanish.",
  },
} as const;

/** Hand-curated barbering videos from the shop's YouTube channel.
 *  The channel mixes in personal/viral clips, so NEVER auto-embed latest
 *  uploads — every id here was reviewed as actual barbering content. */
export const featuredVideos: { id: string; title: string; titleEs: string }[] = [
  {
    id: "ykrO8yr-9Wo",
    title: "Inside the shop — A Otro Nivel",
    titleEs: "Dentro de la barbería",
  },
  {
    id: "qdhjxBgHRz4",
    title: "Fresh fade, happy client",
    titleEs: "Fade fresco, cliente feliz",
  },
  {
    id: "5jHbCGuSVkI",
    title: "Razor line-up, every detail",
    titleEs: "Línea con navaja, cada detalle",
  },
  {
    id: "Fmd1Rv070Ww",
    title: "Scissor work & precision",
    titleEs: "Tijera y precisión",
  },
];
