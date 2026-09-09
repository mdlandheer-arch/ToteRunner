// Change these once you have your real brand name, city, and contact info.
// Every page pulls from here — nothing else in the codebase needs editing.
export const siteConfig = {
  name: "ToteRunner",
  tagline: "Reusable moving totes, delivered and picked up.",
  domain: "https://www.example.com", // replace with your real domain before launch
  city: "Your City",
  region: "Your Region",
  serviceAreas: [
    "Your City",
    "Nearby Town A",
    "Nearby Town B",
    "Nearby Town C",
    "Nearby Town D",
    "Nearby Town E",
  ],
  freeDeliveryRadiusMiles: 10, // adjust to your real service radius
  perMileFeeBeyondRadius: 1.5, // USD per mile beyond the free radius — set to 0 to disable
  email: "hello@example.com",
  phone: "(555) 123-4567",
  gaMeasurementId: "G-XXXXXXXXXX", // replace with your GA4 ID
  // Other uses beyond moving day — shown in the "also great for" section.
  otherUseCases: [
    "Temporary storage",
    "College move-in / move-out",
    "Office relocations",
    "Renovation & decluttering",
    "Business & bulk rentals",
  ],
};

export type Package = {
  id: string;
  name: string;
  totes: number;
  days: number;
  price: number; // USD
  blurb: string;
  popular?: boolean;
};

// Placeholder pricing — benchmarked against comparable tote-rental competitors,
// but still adjust to your actual delivery/tote costs before launch.
export const packages: Package[] = [
  {
    id: "apartment",
    name: "Apartment Pack",
    totes: 15,
    days: 7,
    price: 69,
    blurb: "Studios and 1-bedrooms.",
  },
  {
    id: "small-move",
    name: "Small Move",
    totes: 25,
    days: 7,
    price: 99,
    blurb: "1–2 bedroom homes.",
    popular: true,
  },
  {
    id: "home-move",
    name: "Home Move",
    totes: 40,
    days: 7,
    price: 149,
    blurb: "2–3 bedroom homes.",
  },
  {
    id: "large-move",
    name: "Large Move",
    totes: 60,
    days: 7,
    price: 199,
    blurb: "3+ bedrooms and big moves.",
  },
];

export type AddOn = {
  id: string;
  name: string;
  price: number;
  unit: string; // e.g. "/day", "each", "/roll"
};

export const addOns: AddOn[] = [
  { id: "extra-day", name: "Extra day rental", price: 15, unit: "/day" },
  { id: "extra-tote", name: "Extra tote", price: 5, unit: "each" },
  { id: "hand-truck", name: "2-wheel hand truck", price: 18, unit: "flat" },
  { id: "dolly", name: "4-wheel dolly", price: 12, unit: "each" },
  { id: "blankets-8", name: "Moving blankets (8-pack)", price: 18, unit: "flat" },
  { id: "blankets-12", name: "Moving blankets (12-pack)", price: 26, unit: "flat" },
  { id: "bubble-wrap", name: "Bubble wrap, 12\" x 250'", price: 32, unit: "/roll" },
  { id: "label-kit", name: "Label & marker kit", price: 8, unit: "flat" },
];
