"use client";

import { useLayoutEffect, useRef, useState } from "react";
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
  const [ready, setReady] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const headRef = useRef<HTMLSpanElement>(null);
  const tailRef = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);

  // The green highlight is two shapes under the buttons. They leave the old button a beat apart
  // and a goo filter melts them together, so the green pours into the new button. Before the
  // first measurement (and without JS) the selected button paints its own green.
  useLayoutEffect(() => {
    const chip = chipRefs.current[selected];
    const head = headRef.current;
    const tail = tailRef.current;
    if (!chip || !head || !tail) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = placed.current && !reduce;
    const ease = "cubic-bezier(0.5, 0, 0.2, 1)";
    const move = (el: HTMLSpanElement, ms: number, delay: number) => {
      el.style.transition = animate
        ? `transform ${ms}ms ${ease} ${delay}ms, width ${ms}ms ${ease} ${delay}ms, height ${ms}ms ${ease} ${delay}ms`
        : "none";
      el.style.width = `${chip.offsetWidth}px`;
      el.style.height = `${chip.offsetHeight}px`;
      el.style.transform = `translate(${chip.offsetLeft}px, ${chip.offsetTop}px)`;
    };
    move(head, 260, 0);
    move(tail, 380, 70);
    placed.current = true;
    setReady(true);
  }, [selected]);

  // Buttons can re-wrap when the screen or text size changes: snap the highlight to the new spot.
  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const chip = chipRefs.current[selected];
      for (const el of [headRef.current, tailRef.current]) {
        if (!el || !chip) continue;
        el.style.transition = "none";
        el.style.width = `${chip.offsetWidth}px`;
        el.style.height = `${chip.offsetHeight}px`;
        el.style.transform = `translate(${chip.offsetLeft}px, ${chip.offsetTop}px)`;
      }
    });
    ro.observe(row);
    return () => ro.disconnect();
  }, [selected]);

  const suggested = packages[bedroomOptions[selected].index];

  return (
    <div className="rounded-lg border border-line bg-white/70 p-6">
      <h3 className="text-lg font-bold text-ink">How many totes do I need?</h3>

      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <filter id="tote-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b" />
            <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
          </filter>
        </defs>
      </svg>
      <div ref={rowRef} className="relative mt-4 flex flex-wrap gap-2">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ filter: "url(#tote-goo)" }}>
          <span ref={headRef} className="absolute left-0 top-0 rounded-full bg-crate" />
          <span ref={tailRef} className="absolute left-0 top-0 rounded-full bg-crate" />
        </div>
        {bedroomOptions.map((opt, i) => (
          <button
            key={opt.label}
            ref={(el) => {
              chipRefs.current[i] = el;
            }}
            type="button"
            aria-pressed={i === selected}
            onClick={() => setSelected(i)}
            className={`relative min-h-11 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors delay-100 ${
              i === selected
                ? `border-transparent text-paper ${ready ? "" : "bg-crate"}`
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
          {suggested.name}: {suggested.totes} totes
        </p>
        <p className="mt-1 text-sm text-ink/70">
          Starting at ${suggested.price} for a {suggested.days}-day rental.
        </p>
        <a
          href="#booking"
          className="mt-4 inline-flex min-h-11 items-center rounded-md bg-crate px-5 py-2 text-sm font-semibold text-paper hover:bg-crate-dark btn-edge"
        >
          Request this package
        </a>
      </div>

      <p className="mt-3 text-sm text-ink/70">14 days included. Need longer? Just pick later dates.</p>
    </div>
  );
}
