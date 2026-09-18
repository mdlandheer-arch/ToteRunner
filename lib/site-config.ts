// Change these once you have your real brand name, city, and contact info.
// Every page pulls from here — nothing else in the codebase needs editing.
export const siteConfig = {
  name: "ToteRunner",
  tagline: "We run the totes. You run the move.",
  // Plain description used where a tagline would be too clever (meta tags, SEO)
  descriptor: "Reusable moving totes, delivered and picked up.",
  domain: "https://www.toterunnergr.com",
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
    "Caledonia",
    "Comstock Park",
    "Coopersville",
    "Cutlerville",
    "Allendale",
  ],
  freeDeliveryRadiusMiles: 15, // adjust to your real service radius
  perMileFeeBeyondRadius: 1.5, // USD per mile beyond the free radius — set to 0 to disable
  businessZip: "49544", // origin point for the delivery-distance calculation
  email: "toterunnergr@gmail.com",
  phone: "(616) 402-8504",
  gaMeasurementId: "G-XXXXXXXXXX", // replace with your GA4 ID
  // Set these once you have real accounts — leave "#" to hide a broken link risk.
  // Leave a platform empty to hide its icon — a dead link is worse than none.
  social: {
    facebook: "https://www.facebook.com/ToteRunnerGR",
    instagram: "",
    tiktok: "",
  },
  // Placeholder referral terms — decide your real commission structure before launch.
  realtorReferral: {
    commissionPerReferral: 15, // USD paid to the agent per completed booking
    clientDiscount: 10, // USD off the client's booking when they use an agent's code
    payoutMethod: "Venmo, Zelle, or check — your pick", // confirm before launch
    payoutTiming: "the first week of the following month",
  },
  // Owner story shown in the About section — rewrite this in your own voice.
  // Local trust matters more than polish for this kind of business.
  about: {
    ownerNames: "Mitchell",
    homeTown: "Grand Rapids",
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
  price: number; // USD — covers the full base rental period
  dailyRate: number; // USD per day beyond the base rental period
  blurb: string;
  includes: string[]; // bundled items shown on the pricing card
  popular?: boolean;
};

// Placeholder pricing — benchmarked against comparable tote-rental competitors,
// but still adjust to your actual delivery/tote costs before launch.
//
// Base period is 14 days because most moves run 2-4 weeks (pack + unpack).
// Past day 14, a per-day rate keeps short overruns cheap (nobody pays for a
// full week to keep totes two extra days).
//
// Daily rates are set to undercut Dragon Totes, the only reviewed competitor
// publishing a daily figure ($0.39/tote/day):
//   15 totes: $4/day  vs their $5.85
//   25 totes: $6/day  vs their $9.75
//   40 totes: $9/day  vs their $15.60
//   60 totes: $13/day vs their $23.40
// Verify against your real per-tote costs before launch — undercutting is only
// worth it if the margin survives it.
// Every package now bundles a dolly + labels; dollies come back to you, so the
// real recurring cost of the bundle is mostly the labels.
export const packages: Package[] = [
  {
    id: "studio",
    name: "Studio / 1 Bedroom",
    totes: 15,
    days: 14,
    price: 69,
    dailyRate: 4,
    blurb: "Apartments and smaller spaces.",
    includes: ["1 dolly", "15 labels", "Delivery + pickup"],
  },
  {
    id: "two-bedroom",
    name: "2 Bedroom",
    totes: 25,
    days: 14,
    price: 99,
    dailyRate: 6,
    blurb: "The most common home size.",
    includes: ["1 dolly", "25 labels", "Delivery + pickup"],
    popular: true,
  },
  {
    id: "three-bedroom",
    name: "3 Bedroom",
    totes: 40,
    days: 14,
    price: 149,
    dailyRate: 9,
    blurb: "Most single-family homes.",
    includes: ["2 dollies", "40 labels", "Delivery + pickup"],
  },
  {
    id: "four-bedroom",
    name: "4+ Bedroom",
    totes: 60,
    days: 14,
    price: 199,
    dailyRate: 13,
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
  { id: "extra-tote", name: "Extra tote", price: 5, unit: "each" },
  { id: "hand-truck", name: "2-wheel hand truck", price: 18, unit: "flat" },
  { id: "extra-dolly", name: "Extra 4-wheel dolly", price: 12, unit: "each" },
];

// Published so customers see it before booking — reduces support emails.
// These are placeholders: decide your real numbers before launch.
// Damage / loss fees, shown on the rental agreement and terms pages.
// Set from the owner's decisions — confirm with your attorney that these are
// enforceable as liquidated damages under Michigan consumer law.
// Shown on the legal pages. Bump this whenever you change legal copy.
export const legalLastUpdated = "September 12, 2026";

export const damageFees = {
  perTote: 15,
  perAccessory: 25,
  cleaning: 15,
};

export const cancellationPolicy = {
  freeCancellationHours: 48,
  lateCancellationFee: 25, // USD, inside the free window
  postDeliveryRestockingFee: 49, // USD, if totes already delivered
};
