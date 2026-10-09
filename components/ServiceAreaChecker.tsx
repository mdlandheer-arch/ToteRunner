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
  // Show the "5 digits" message after a Check attempt or when leaving a half-typed zip;
  // it disappears as soon as the zip is valid. The typed zip is never cleared.
  const [showFormatError, setShowFormatError] = useState(false);
  const formatInvalid = !/^\d{5}$/.test(zip);
  const formatError = showFormatError && formatInvalid ? "Enter a 5-digit zip code, like 49544." : null;
  const notFound = result?.kind === "not-found";
  const invalid = Boolean(formatError) || notFound;

  async function check() {
    if (checkingRef.current) return;
    if (formatInvalid) {
      setShowFormatError(true);
      document.getElementById("zipcheck")?.focus();
      return;
    }
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
          onBlur={() => zip && setShowFormatError(true)}
          id="zipcheck"
          aria-invalid={invalid ? true : undefined}
          aria-describedby={invalid ? "zipcheck-error" : undefined}
          placeholder="49544"
          aria-label="Zip code"
          className={`min-h-11 w-32 rounded-md border border-line bg-white px-3 py-2 text-base text-ink sm:text-sm focus:border-crate${invalid ? " border-red-600! bg-red-50/40" : ""}`}
        />
        <button
          onClick={check}
          disabled={checking}
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

      {formatError && (
        <p id="zipcheck-error" className="mt-2 text-sm text-red-700">{formatError}</p>
      )}

      {notFound && (
        <p id="zipcheck-error" className="mt-2 text-sm text-red-700">
          We couldn&apos;t find that zip code. Check it for a typo and try again, or{" "}
          <a href={`mailto:${siteConfig.email}`} className="underline">email us</a>.
        </p>
      )}
    </div>
  );
}
