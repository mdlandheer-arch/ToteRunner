"use client";

import { useState } from "react";
import { addOns, customPackage, siteConfig } from "@/lib/site-config";
import { customQuote } from "@/lib/pricing";

// Add-ons that make sense on top of a custom build. Extra totes are left out:
// the tote count above already is the tote count.
const builderAddOns = addOns.filter((a) => a.id !== "extra-tote");

const weekOptions = Array.from(
  { length: customPackage.maxWeeks - customPackage.minWeeks + 1 },
  (_, i) => customPackage.minWeeks + i
);

// Event the booking form listens for, so "Request this package" carries the
// choices down into the form instead of making the customer re-enter them.
export const BUILD_EVENT = "toterunner:build";

export default function CustomPackageBuilder() {
  const [totes, setTotes] = useState(30);
  const [weeks, setWeeks] = useState(2);
  const [addOnQty, setAddOnQty] = useState<Record<string, number>>({});

  const quote = customQuote(totes, weeks);
  const addOnTotal = builderAddOns.reduce((sum, a) => sum + a.price * (addOnQty[a.id] ?? 0), 0);
  const total = quote.price + addOnTotal;

  function request() {
    window.dispatchEvent(
      new CustomEvent(BUILD_EVENT, { detail: { totes: quote.totes, weeks: quote.weeks, addOnQty } })
    );
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="mt-10 rounded-lg border border-crate/30 bg-white/70 p-6">
      <h3 className="text-xl font-bold text-ink">Build your own package</h3>
      <p className="mt-1 text-sm text-ink/70">
        Pick your tote count and how long you need them. The price updates as you go.
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="build-totes" className="text-sm font-medium text-ink/80">
                Number of totes
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Remove one tote"
                  onClick={() => setTotes(Math.max(customPackage.minTotes, totes - 1))}
                  disabled={totes <= customPackage.minTotes}
                  className="h-11 w-11 rounded-md border border-line text-lg leading-none text-ink disabled:opacity-30"
                >
                  −
                </button>
                <span className="w-10 text-center text-lg font-bold tabular-nums text-ink" aria-live="polite">
                  {totes}
                </span>
                <button
                  type="button"
                  aria-label="Add one tote"
                  onClick={() => setTotes(Math.min(customPackage.maxTotes, totes + 1))}
                  disabled={totes >= customPackage.maxTotes}
                  className="h-11 w-11 rounded-md border border-line text-lg leading-none text-ink disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>
            <input
              id="build-totes"
              type="range"
              min={customPackage.minTotes}
              max={customPackage.maxTotes}
              step={1}
              value={totes}
              onChange={(e) => setTotes(Number(e.target.value))}
              className="mt-3 w-full accent-[var(--crate-green)]"
            />
            <div className="flex justify-between text-xs text-ink/70">
              <span>{customPackage.minTotes}</span>
              <span>{customPackage.maxTotes}</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-ink/80">How long do you need them?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {weekOptions.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWeeks(w)}
                  aria-pressed={w === weeks}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    w === weeks
                      ? "border-crate bg-crate text-paper"
                      : "border-line text-ink/70 hover:border-crate/50"
                  }`}
                >
                  {w} week{w > 1 ? "s" : ""}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-ink/70">
              Most moves take 2–4 weeks once you count packing and unpacking.
            </p>
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-ink/80">Add-ons (optional)</legend>
            <div className="mt-2 space-y-2">
              {builderAddOns.map((a) => {
                const qty = addOnQty[a.id] ?? 0;
                const setQty = (n: number) =>
                  setAddOnQty({ ...addOnQty, [a.id]: Math.min(20, Math.max(0, n)) });
                return (
                  <div key={a.id} className="flex items-center justify-between rounded-md border border-line px-3 py-2">
                    <div className="text-sm">
                      <span className="text-ink/80">{a.name}</span>
                      <span className="ml-2 text-ink/70">${a.price} {a.unit !== "flat" ? a.unit : ""}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setQty(qty - 1)}
                        disabled={qty === 0}
                        aria-label={`Remove one ${a.name}`}
                        className="h-11 w-11 rounded-md border border-line text-lg leading-none text-ink disabled:opacity-30"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(qty + 1)}
                        aria-label={`Add one ${a.name}`}
                        className="h-11 w-11 rounded-md border border-line text-lg leading-none text-ink"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="self-start rounded-md border border-crate bg-crate/5 p-5">
          <p className="text-sm text-ink/70">Your price</p>
          <p className="mt-1 text-4xl font-extrabold text-ink">${total}</p>
          <div className="mt-4 space-y-1 border-t border-crate/20 pt-3 text-sm text-ink/75">
            <div className="flex justify-between">
              <span>
                {quote.totes} totes · {quote.weeks} week{quote.weeks > 1 ? "s" : ""}
              </span>
              <span>${quote.price}</span>
            </div>
            {builderAddOns.map((a) => {
              const qty = addOnQty[a.id] ?? 0;
              if (qty <= 0) return null;
              return (
                <div key={a.id} className="flex justify-between">
                  <span>{a.name}{qty > 1 ? ` × ${qty}` : ""}</span>
                  <span>${a.price * qty}</span>
                </div>
              );
            })}
          </div>
          <ul className="mt-4 space-y-1 border-t border-crate/20 pt-3 text-sm text-ink/80">
            <li className="flex gap-2"><span className="text-crate">✓</span>{quote.totes} labeled totes</li>
            <li className="flex gap-2">
              <span className="text-crate">✓</span>
              {quote.dollies} 4-wheel {quote.dollies > 1 ? "dollies" : "dolly"}
            </li>
            <li className="flex gap-2"><span className="text-crate">✓</span>Delivery + pickup</li>
          </ul>
          <p className="mt-3 text-xs text-ink/70">
            Free delivery and pickup within {siteConfig.freeDeliveryRadiusMiles} miles of Grand
            Rapids or Muskegon. Beyond that, ${siteConfig.perMileFeeBeyondRadius.toFixed(2)}/mile, shown on
            the request form. Estimate only; we confirm the final amount when we reply.
          </p>
          <button
            type="button"
            onClick={request}
            className="mt-4 w-full rounded-md bg-crate px-4 py-2.5 text-sm font-semibold text-paper hover:bg-crate-dark"
          >
            Request this package
          </button>
        </div>
      </div>
    </div>
  );
}
