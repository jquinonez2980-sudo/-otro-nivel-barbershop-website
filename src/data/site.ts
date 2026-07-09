/**
 * Single source of truth for all business data.
 * Prices, hours, addresses, and contact info live here ONLY —
 * every page, table, and JSON-LD block is generated from this file.
 */

export type Service = {
  name: string;
  nameEs: string;
  price: string;
  duration: string;
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
  /** Indexed 0 (Sunday) → 6 (Saturday), 24h decimal hours */
  weekHours: DayRange[];
  hoursDisplay: { label: string; value: string }[];
  services: Service[];
  photo: string;
  photoAlt: string;
};

export const site = {
  legalName: "A Otro Nivel Barber Shop",
  name: "Otro Nivel Barbershop",
  shortName: "Otro Nivel",
  tagline: "The Premier Latino Barbershop in Toronto",
  taglineEs: "La barbería latina de Toronto",
  url: "https://otronivelbarbershop.com",
  phone: "(647) 340-7187",
  phoneHref: "tel:+16473407187",
  smsHref: "sms:+16473407187",
  email: "info@otronivelbarbershop.com",
  instagram: {
    handle: "@aotronivelbarbershop02",
    url: "https://www.instagram.com/aotronivelbarbershop02",
  },
  facebook: {
    label: "A Otro Nivel Barbershop",
    url: "https://www.facebook.com/a.otro.nivel.barbershop",
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
    services: [
      { name: "Regular Haircut", nameEs: "Corte normal", price: "$40", duration: "45 min" },
      { name: "Fade", nameEs: "Fade", price: "$50", duration: "45 min", featured: true },
      { name: "Fade + Beard", nameEs: "Fade con barba", price: "$60", duration: "1 hr", featured: true },
      { name: "Beard Trim", nameEs: "Barba", price: "$20", duration: "30 min" },
      {
        name: "VIP Package",
        nameEs: "Paquete VIP",
        price: "$70",
        duration: "1 hr 15 min",
        featured: true,
        badge: "Weston Exclusive",
      },
      { name: "Children's Haircut", nameEs: "Corte para niños", price: "$30–$35", duration: "45 min" },
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
    services: [
      { name: "Regular Haircut", nameEs: "Corte normal", price: "$35", duration: "45 min" },
      { name: "Fade", nameEs: "Fade", price: "$35–$40", duration: "45 min", featured: true },
      { name: "Beard Trim", nameEs: "Barba", price: "$20", duration: "25 min" },
      { name: "Children's Haircut", nameEs: "Corte para niños", price: "$30", duration: "40 min" },
    ],
    photo: "/media/keele-hall.jpg",
    photoAlt:
      "Barbers working side by side at the Keele Street shop in North York",
  },
];

/** Featured services for the homepage teaser, with "from" pricing across locations. */
export const featuredServices = [
  {
    name: "Fade",
    nameEs: "Fade",
    from: "from $35",
    description: "Our signature. Skin, taper, drop — blended to the line.",
  },
  {
    name: "VIP Package",
    nameEs: "Paquete VIP",
    from: "$70",
    description: "The full treatment — haircut, beard, and premium finish.",
    badge: "Weston Exclusive",
  },
  {
    name: "Beard Trim",
    nameEs: "Barba",
    from: "$20",
    description: "Shaped, lined, and conditioned. Both locations.",
  },
  {
    name: "Kids' Haircut",
    nameEs: "Corte para niños",
    from: "from $30",
    description: "Kids and babies welcome — patient barbers, clean cuts.",
  },
];

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
