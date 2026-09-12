"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { lookupZip, haversineMiles, calculateDeliveryFee } from "@/lib/geo";

type Result =
  | { kind: "free"; city: string; state: string }
  | { kind: "fee"; city: string; state: string; miles: number; fee: number }
  | { kind: "not-found" }
  | null;

export default function ServiceAreaChecker() {
  const [zip, setZip] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<Result>(null);

  async function check() {
    if (!/^\d{5}$/.test(zip)) return;
    setChecking(true);
    setResult(null);

    const [customerZip, businessZip] = await Promise.all([
      lookupZip(zip),
      lookupZip(siteConfig.businessZip),
    ]);

    if (!customerZip || !businessZip) {
      setResult({ kind: "not-found" });
      setChecking(false);
      return;
    }

    const miles = haversineMiles(
      customerZip.latitude,
      customerZip.longitude,
      businessZip.latitude,
      businessZip.longitude
    );

    if (miles <= siteConfig.freeDeliveryRadiusMiles) {
      setResult({ kind: "free", city: customerZip.city, state: customerZip.stateAbbreviation });
    } else {
      setResult({
        kind: "fee",
        city: customerZip.city,
        state: customerZip.stateAbbreviation,
        miles,
        fee: calculateDeliveryFee(miles, siteConfig.freeDeliveryRadiusMiles, siteConfig.perMileFeeBeyondRadius),
      });
    }
    setChecking(false);
  }

  return (
    <div className="rounded-lg border border-line bg-white/60 p-6">
      <h3 className="text-lg font-bold text-ink">Do we deliver to you?</h3>
      <p className="mt-1 text-sm text-ink/70">Enter your zip code to check.</p>

      <div className="mt-4 flex gap-2">
        <input
          inputMode="numeric"
          maxLength={5}
          value={zip}
          onChange={(e) => {
            setZip(e.target.value.replace(/\D/g, ""));
            setResult(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="49544"
          aria-label="Zip code"
          className="w-32 rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-crate"
        />
        <button
          onClick={check}
          disabled={checking || !/^\d{5}$/.test(zip)}
          className="rounded-md bg-crate px-5 py-2 text-sm font-semibold text-paper hover:bg-crate-dark disabled:opacity-50"
        >
          {checking ? "Checking…" : "Check"}
        </button>
      </div>

      {result?.kind === "free" && (
        <div className="mt-4 rounded-md bg-crate/10 p-4 text-sm">
          <p className="font-semibold text-crate">
            Yes — we deliver to {result.city}, {result.state}.
          </p>
          <p className="mt-1 text-ink/70">Free delivery and pickup included.</p>
          <a href="#booking" className="mt-3 inline-block rounded-md bg-crate px-5 py-2 text-sm font-semibold text-paper hover:bg-crate-dark">
            Reserve your totes
          </a>
        </div>
      )}

      {result?.kind === "fee" && (
        <div className="mt-4 rounded-md bg-safety/10 p-4 text-sm">
          <p className="font-semibold text-ink">
            Yes — we can deliver to {result.city}, {result.state}.
          </p>
          <p className="mt-1 text-ink/70">
            You&apos;re about {Math.round(result.miles)} miles out, past our free{" "}
            {siteConfig.freeDeliveryRadiusMiles}-mile zone, so an estimated ${result.fee.toFixed(2)}{" "}
            delivery fee applies. The exact amount is calculated at checkout.
          </p>
          <a href="#booking" className="mt-3 inline-block rounded-md bg-crate px-5 py-2 text-sm font-semibold text-paper hover:bg-crate-dark">
            Reserve your totes
          </a>
        </div>
      )}

      {result?.kind === "not-found" && (
        <p className="mt-4 text-sm text-red-600">
          We couldn&apos;t look up that zip code. Double check it, or{" "}
          <a href={`mailto:${siteConfig.email}`} className="underline">email us</a> and we&apos;ll confirm.
        </p>
      )}
    </div>
  );
}
