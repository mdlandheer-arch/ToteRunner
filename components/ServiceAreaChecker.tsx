"use client";

import { useRef, useState } from "react";
import Spinner from "@/components/Spinner";
import { siteConfig } from "@/lib/site-config";
import { lookupZip, nearestHub, calculateDeliveryFee } from "@/lib/geo";

type Result =
  | { kind: "free"; city: string; state: string }
  | { kind: "fee"; city: string; state: string; miles: number; fee: number }
  | { kind: "not-found" }
  | null;

export default function ServiceAreaChecker() {
  const [zip, setZip] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<Result>(null);

  // Blocks a second click or Enter in the same tick, before the button re-renders disabled.
  const checkingRef = useRef(false);

  async function check() {
    if (checkingRef.current || !/^\d{5}$/.test(zip)) return;
    checkingRef.current = true;
    setChecking(true);
    setResult(null);

    try {
      await runCheck();
    } catch {
      setResult({ kind: "not-found" });
    } finally {
      checkingRef.current = false;
      setChecking(false);
    }
  }

  async function runCheck() {
    const customerZip = await lookupZip(zip);

    if (!customerZip) {
      setResult({ kind: "not-found" });
      return;
    }

    const { hub, miles } = nearestHub(customerZip.latitude, customerZip.longitude);

    if (miles <= hub.freeRadiusMiles) {
      setResult({ kind: "free", city: customerZip.city, state: customerZip.stateAbbreviation });
    } else {
      setResult({
        kind: "fee",
        city: customerZip.city,
        state: customerZip.stateAbbreviation,
        miles,
        fee: calculateDeliveryFee(miles, hub.freeRadiusMiles, siteConfig.perMileFeeBeyondRadius),
      });
    }
  }

  return (
    <div className="rounded-lg border border-line bg-white/70 p-6">
      <h3 className="text-lg font-bold text-ink">Do we deliver to you?</h3>

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
          className="min-h-11 w-32 rounded-md border border-line bg-white px-3 py-2 text-base text-ink sm:text-sm focus:border-crate"
        />
        <button
          onClick={check}
          disabled={checking || !/^\d{5}$/.test(zip)}
          aria-busy={checking}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-crate px-5 py-2 text-sm font-semibold text-paper hover:bg-crate-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {checking && <Spinner className="h-3.5 w-3.5" />}
          {checking ? "Checking…" : "Check"}
        </button>
      </div>

      {result?.kind === "free" && (
        <div className="mt-4 rounded-md bg-crate/10 p-4 text-sm">
          <p className="font-semibold text-crate">
            Yes — we deliver to {result.city}, {result.state}.
          </p>
          <p className="mt-1 text-ink/70">Free delivery and pickup included.</p>
          <a href="#booking" className="mt-3 inline-flex min-h-11 items-center rounded-md bg-crate px-5 py-2 text-sm font-semibold text-paper hover:bg-crate-dark">
            Request your totes
          </a>
        </div>
      )}

      {result?.kind === "fee" && (
        <div className="mt-4 rounded-md bg-safety/10 p-4 text-sm">
          <p className="font-semibold text-ink">
            Yes — we can deliver to {result.city}, {result.state}.
          </p>
          <p className="mt-1 text-ink/70">
            ~{Math.round(result.miles)} mi out — about ${result.fee.toFixed(2)} for delivery.
          </p>
          <a href="#booking" className="mt-3 inline-flex min-h-11 items-center rounded-md bg-crate px-5 py-2 text-sm font-semibold text-paper hover:bg-crate-dark">
            Request your totes
          </a>
        </div>
      )}

      {result?.kind === "not-found" && (
        <p className="mt-4 text-sm text-red-600">
          Couldn&apos;t find that zip — double check it, or{" "}
          <a href={`mailto:${siteConfig.email}`} className="underline">email us</a>.
        </p>
      )}
    </div>
  );
}
