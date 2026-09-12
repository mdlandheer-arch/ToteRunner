// Change these once you have your real brand name, city, and contact info.
// Every page pulls from here — nothing else in the codebase needs editing.
export const siteConfig = {
  name: "ToteRunner",
  tagline: "We run the totes. You run the move.",
  // Plain description used where a tagline would be too clever (meta tags, SEO)
  descriptor: "Reusable moving totes, delivered and picked up.",
  domain: "https://www.example.com", // replace with your real domain before launch
  city: "Grand Rapids",
  region: "Greater Grand Rapids",
  serviceAreas: [
    "Grand Rapids",
    "Wyoming",
    "Kentwood",
    "East Grand Rapids",
    "Grandville",
    "Walker",
    "Byron Center",
    "Jenison",
    "Hudsonville",
    "Rockford",
    "Cascade",
    "Ada",
  ],
  freeDeliveryRadiusMiles: 15, // adjust to your real service radius
  perMileFeeBeyondRadius: 1.5, // USD per mile beyond the free radius — set to 0 to disable
  businessZip: "49544", // origin point for the delivery-distance calculation
  email: "hello@toterunner.com",
  phone: "(616) 402-8504",
  gaMeasurementId: "G-XXXXXXXXXX", // replace with your GA4 ID
  // Set these once you have real accounts — leave "#" to hide a broken link risk.
  social: {
    facebook: "#",
    instagram: "#",
    tiktok: "#",
  },
  // Placeholder referral terms — decide your real commission structure before launch.
  realtorReferral: {
    commissionPerReferral: 15, // USD, or switch copy to a % if you prefer
  },
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
  includes: string[]; // bundled items shown on the pricing card
  popular?: boolean;
};

// Placeholder pricing — benchmarked against comparable tote-rental competitors,
// but still adjust to your actual delivery/tote costs before launch.
// Every package now bundles a dolly + labels; dollies come back to you, so the
// real recurring cost of the bundle is mostly the labels.
export const packages: Package[] = [
  {
    id: "studio",
    name: "Studio / 1 Bedroom",
    totes: 15,
    days: 7,
    price: 69,
    blurb: "Apartments and smaller spaces.",
    includes: ["1 dolly", "15 labels", "Delivery + pickup"],
  },
  {
    id: "two-bedroom",
    name: "2 Bedroom",
    totes: 25,
    days: 7,
    price: 99,
    blurb: "The most common home size.",
    includes: ["1 dolly", "25 labels", "Delivery + pickup"],
    popular: true,
  },
  {
    id: "three-bedroom",
    name: "3 Bedroom",
    totes: 40,
    days: 7,
    price: 149,
    blurb: "Most single-family homes.",
    includes: ["2 dollies", "40 labels", "Delivery + pickup"],
  },
  {
    id: "four-bedroom",
    name: "4+ Bedroom",
    totes: 60,
    days: 7,
    price: 199,
    blurb: "Large homes and full-estate moves.",
    includes: ["3 dollies", "60 labels", "Delivery + pickup"],
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
  { id: "extra-dolly", name: "Extra 4-wheel dolly", price: 12, unit: "each" },
];

// Published so customers see it before booking — reduces support emails.
// These are placeholders: decide your real numbers before launch.
export const cancellationPolicy = {
  freeCancellationHours: 48,
  lateCancellationFee: 25, // USD, inside the free window
  postDeliveryRestockingFee: 49, // USD, if totes already delivered
};
