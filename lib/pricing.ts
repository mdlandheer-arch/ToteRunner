// Pricing for the "Build your own package" option. Used by the builder on the
// pricing section, the booking form estimate, and the /api/reserve route, so
// all three always agree.
//
// Method: the 2-week price and the per-day rate are blended (straight line)
// between the four package points, so 15/25/40/60 totes match the packages
// exactly. Below 15 totes the first segment's slope is continued. Weeks past 2
// cost 7 days at the blended daily rate. 1 week = oneWeekFactor x the 2-week
// price. Dollies follow the smallest package that holds the tote count.
import { packages, customPackage } from "./site-config";

type Point = [number, number];

function blend(points: Point[], x: number): number {
  const pts = [...points].sort((a, b) => a[0] - b[0]);
  // Pick the segment containing x; outside the range, extend the end segment.
  let i = 0;
  while (i < pts.length - 2 && x > pts[i + 1][0]) i++;
  const [x0, y0] = pts[i];
  const [x1, y1] = pts[i + 1];
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

const priceCurve: Point[] = packages.map((p) => [p.totes, p.price]);
const dailyCurve: Point[] = packages.map((p) => [p.totes, p.dailyRate]);

// Anything longer than this is quoted by hand; it also caps tampered input.
export const MAX_PRICED_WEEKS = 26;

export function customDollies(totes: number): number {
  const fit = [...packages].sort((a, b) => a.totes - b.totes).find((p) => p.totes >= totes);
  return fit ? fit.dollies : Math.max(...packages.map((p) => p.dollies));
}

export function clampTotes(totes: number): number {
  const n = Number.isFinite(totes) ? Math.round(totes) : customPackage.minTotes;
  return Math.min(customPackage.maxTotes, Math.max(customPackage.minTotes, n));
}

export function customQuote(totesIn: number, weeksIn: number) {
  const totes = clampTotes(totesIn);
  const weeks = Math.min(
    MAX_PRICED_WEEKS,
    Math.max(1, Number.isFinite(weeksIn) ? Math.round(weeksIn) : 1)
  );
  const twoWeek = blend(priceCurve, totes);
  const dailyRate = blend(dailyCurve, totes);
  const raw =
    weeks === 1
      ? twoWeek * customPackage.oneWeekFactor
      : twoWeek + (weeks - 2) * 7 * dailyRate;
  return {
    totes,
    weeks,
    dollies: customDollies(totes),
    dailyRate,
    price: Math.round(raw),
  };
}
