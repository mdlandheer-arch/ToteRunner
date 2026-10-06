// Promo code math — safe to import anywhere (browser or server).
// The list of real codes lives in lib/promo-codes.ts, which is server-only.

export type PromoType = "percent" | "flat";

export type PromoCode = {
  code: string; // what the customer types — matching ignores case and spaces
  label: string; // shown on the estimate, e.g. "10% off your package"
  type: PromoType; // "percent" = % off the package price, "flat" = $ off the package price
  value: number; // 10 = 10% (percent) or $10 (flat)
  startsOn?: string; // optional, "YYYY-MM-DD" — first day the code works (Michigan time)
  endsOn?: string; // optional, "YYYY-MM-DD" — last day the code works (Michigan time)
  active: boolean; // false = turned off, no matter the dates
};

// What the browser gets back after a code is accepted. The code list itself
// never leaves the server.
export type AppliedPromo = Pick<PromoCode, "code" | "label" | "type" | "value">;

export function normalizeCode(raw: unknown): string {
  return typeof raw === "string" ? raw.replace(/\s+/g, "").toUpperCase().slice(0, 40) : "";
}

/**
 * Dollar discount for a promo on a given package price.
 * Applies to the BASE PACKAGE PRICE only (same rule as the realtor discount):
 * not add-ons, extra days, or mileage fees. Never more than the package price.
 */
export function promoDiscount(promo: Pick<PromoCode, "type" | "value">, packagePrice: number): number {
  if (packagePrice <= 0 || promo.value <= 0) return 0;
  const raw = promo.type === "percent" ? (packagePrice * promo.value) / 100 : promo.value;
  return Math.round(Math.min(raw, packagePrice) * 100) / 100;
}

/** Today's date as "YYYY-MM-DD" in Michigan time, so codes expire at local midnight. */
export function todayInMichigan(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Detroit",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export type PromoLookup = { ok: true; promo: AppliedPromo } | { ok: false; error: string };

/** Finds a code in the list and checks it's switched on and inside its dates. */
export function findPromo(list: PromoCode[], raw: unknown, now: Date = new Date()): PromoLookup {
  const code = normalizeCode(raw);
  if (!code) return { ok: false, error: "Enter a promo code." };

  const match = list.find((p) => normalizeCode(p.code) === code);
  if (!match || !match.active) return { ok: false, error: "That code isn't valid." };

  const today = todayInMichigan(now);
  if (match.startsOn && today < match.startsOn) return { ok: false, error: "That code isn't active yet." };
  if (match.endsOn && today > match.endsOn) return { ok: false, error: "That code has expired." };

  return {
    ok: true,
    promo: { code: normalizeCode(match.code), label: match.label, type: match.type, value: match.value },
  };
}
