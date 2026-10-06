import { NextRequest, NextResponse } from "next/server";
import { findPromo } from "@/lib/promo";
import { promoCodes } from "@/lib/promo-codes";

// Checks a promo code for the booking form. Returns the code's label and
// discount rule (never the list of codes). The reserve route re-checks the
// code on submit, so the browser can't invent its own discount.

const recent = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_TRIES = 10; // slows down anyone trying to guess codes

function isRateLimited(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => t > now - WINDOW_MS);
  if (hits.length >= MAX_TRIES) return true;
  hits.push(now);
  recent.set(ip, hits);
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many tries. Wait a minute and try again." }, { status: 429 });
  }

  let code: unknown;
  try {
    ({ code } = await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Enter a promo code." }, { status: 400 });
  }

  const result = findPromo(promoCodes, code);
  return NextResponse.json(result, { status: result.ok ? 200 : 404 });
}
