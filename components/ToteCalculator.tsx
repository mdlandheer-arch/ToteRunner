"use client";

import { useState } from "react";
import { packages } from "@/lib/site-config";

const bedroomOptions = [
  { label: "Studio", index: 0 },
  { label: "1 bedroom", index: 0 },
  { label: "2 bedrooms", index: 1 },
  { label: "3 bedrooms", index: 2 },
  { label: "4+ bedrooms", index: 3 },
];

export default function ToteCalculator() {
  const [selected, setSelected] = useState(1); // default: 1 bedroom

  const suggested = packages[bedroomOptions[selected].index];

  return (
    <div className="rounded-lg border border-line bg-white/70 p-6">
      <h3 className="text-lg font-bold text-ink">How many totes do I need?</h3>

      <div className="mt-4 flex flex-wrap gap-2">
        {bedroomOptions.map((opt, i) => (
          <button
            key={opt.label}
            onClick={() => setSelected(i)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              i === selected
                ? "border-crate bg-crate text-paper"
                : "border-line text-ink/70 hover:border-crate/50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-md bg-crate/5 p-4">
        <p className="text-sm text-ink/70">Recommended:</p>
        <p className="mt-1 text-xl font-bold text-ink">
          {suggested.name} — {suggested.totes} totes
        </p>
        <p className="mt-1 text-sm text-ink/70">
          Starting at ${suggested.price} for a {suggested.days}-day rental.
        </p>
        <a
          href="#booking"
          className="mt-4 inline-block rounded-md bg-crate px-5 py-2 text-sm font-semibold text-paper hover:bg-crate-dark"
        >
          Request this package
        </a>
      </div>

      <p className="mt-3 text-sm text-steel">14 days included. Need longer? Just pick later dates.</p>
    </div>
  );
}
