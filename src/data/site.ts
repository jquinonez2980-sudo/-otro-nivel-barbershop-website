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
  tagline: "The Premier Latino Barbershop in Toronto",
  taglineEs: "La barbería latina de Toronto",
  url: "https://otronivelbarbershop.com",
  /** Canonical public phone for both shops (NAP: never list 416-901-1218 on-site). */
  phone: "(647) 340-7187",
  phoneE164: "+16473407187",
  phoneHref: "tel:+16473407187",
  smsHref: "sms:+16473407187",
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
    weston: "" as string,
    keele: "" as string,
  },
  /**
   * Set from Google Business Profile when review volume is solid.
   * JSON-LD aggregateRating is emitted only when both fields are set.
   */
  reviews: null as null | { ratingValue: string; reviewCount: number },
} as const;

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
      { id: "regular-haircut", name: "Haircut", nameEs: "Corte", price: "$40–$50", duration: "45 min", durationMin: 45, featured: true },
      { id: "haircut-beard", name: "Haircut and Beard Trim", nameEs: "Corte y barba", price: "$55", duration: "1 hr", durationMin: 60, featured: true },
      { id: "beard-trim", name: "Beard Trim and Line Up", nameEs: "Barba y contorno", price: "$25", duration: "30 min", durationMin: 30 },
      {
        id: "vip-package",
        name: "VIP Service (Haircut, Hot Towel Service, Beard Trim)",
        nameEs: "Servicio VIP (Corte, Toalla Caliente, Barba)",
        price: "$60",
        duration: "1 hr 15 min",
        durationMin: 75,
        featured: true,
        badge: "Weston Exclusive",
      },
      { id: "kids-haircut", name: "Kids Haircut (11 years or younger)", nameEs: "Corte para niños (11 años o menos)", price: "$30", duration: "45 min", durationMin: 45 },
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
      { id: "regular-haircut", name: "Haircut", nameEs: "Corte", price: "$35–$40", duration: "45 min", durationMin: 45, featured: true },
      { id: "haircut-beard", name: "Haircut and Beard Trim", nameEs: "Corte y barba", price: "$50", duration: "1 hr", durationMin: 60, featured: true },
      { id: "beard-trim", name: "Beard Trim and Line Up", nameEs: "Barba y contorno", price: "$20", duration: "25 min", durationMin: 25 },
      { id: "kids-haircut", name: "Kids Haircut (11 years or younger)", nameEs: "Corte para niños (11 años o menos)", price: "$30", duration: "40 min", durationMin: 40 },
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
    name: "Haircut",
    nameEs: "Corte",
    from: fromPriceLabel(
      locations.flatMap((l) =>
        l.services.filter((s) => s.id === "regular-haircut").map((s) => s.price),
      ),
    ),
    description:
      "Skin, taper, drop — blended to the line. Weston $40–$50 · Keele $35–$40.",
  },
  {
    name: "VIP Service",
    nameEs: "Servicio VIP",
    from: fromPriceLabel(
      locations.flatMap((l) =>
        l.services.filter((s) => s.id === "vip-package").map((s) => s.price),
      ),
    ),
    description: "Haircut, hot towel service, and beard trim.",
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
];

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
