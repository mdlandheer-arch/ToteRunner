// SERVER-ONLY: the list of promo codes.
//
// Only import this from app/api/* route files. Anything imported by a
// "use client" component (like BookingForm or site-config) ships to the
// browser, where anyone could read every code. That's why these aren't in
// lib/site-config.ts.
//
// To add a code: copy a block, change the values, set active: true, push.
// To turn one off: set active: false (keep it here as a record), push.
//
// Rules applied to every code (see lib/promo.ts):
//   - discount comes off the base package price only, not add-ons, extra
//     days, or mileage fees, and never more than the package price
//   - one code per reservation request
//   - doesn't apply to "Not sure / custom quote" requests
//   - dates are Michigan time; endsOn is the last day it works

import type { PromoCode } from "@/lib/promo";

export const promoCodes: PromoCode[] = [
  {
    code: "TYLERCOOK",
    label: "$69 off your package",
    type: "flat",
    value: 69,
    active: true, // added Oct 5, 2026 — no end date
  },
  // Percent example:
  // {
  //   code: "WELCOME10",
  //   label: "10% off your package",
  //   type: "percent",
  //   value: 10,
  //   endsOn: "2026-12-31",
  //   active: true,
  // },
  // Flat-dollar example:
  // {
  //   code: "SAVE15",
  //   label: "$15 off your package",
  //   type: "flat",
  //   value: 15,
  //   startsOn: "2026-11-01",
  //   endsOn: "2026-11-30",
  //   active: true,
  // },
];
