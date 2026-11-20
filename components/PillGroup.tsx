"use client";

import { useLayoutEffect, useRef, useState } from "react";

// A row of pill buttons where one is selected. The green highlight is a single pill under the
// buttons: it stretches toward the newly selected one, then settles with a small spring.
// Reduced motion: it just jumps. Before the first measurement (and without JS) the selected
// button paints its own green, so nothing is ever unreadable.
export default function PillGroup({
  options,
  selected,
  onSelect,
  className = "mt-4",
}: {
  options: string[];
  selected: number;
  onSelect: (index: number) => void;
  className?: string;
}) {
  const [ready, setReady] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pillRef = useRef<HTMLSpanElement>(null);
  const prev = useRef<number | null>(null);
  const anim = useRef<Animation | null>(null);
  const selectedRef = useRef(selected);

  function rect(i: number) {
    const b = chipRefs.current[i]!;
    return { x: b.offsetLeft, y: b.offsetTop, w: b.offsetWidth, h: b.offsetHeight };
  }
  function frame(q: { x: number; y: number; w: number; h: number }): Keyframe {
    return { transform: `translate(${q.x}px, ${q.y}px)`, width: `${q.w}px`, height: `${q.h}px` };
  }
  function settle(i: number) {
    const el = pillRef.current;
    if (!el || !chipRefs.current[i]) return;
    const f = frame(rect(i));
    el.style.transform = f.transform as string;
    el.style.width = f.width as string;
    el.style.height = f.height as string;
  }

  useLayoutEffect(() => {
    const el = pillRef.current;
    if (!el || !chipRefs.current[selected]) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = prev.current;
    if (from !== null && from !== selected && !reduce && chipRefs.current[from]) {
      const a = rect(from);
      const z = rect(selected);
      const spring = "cubic-bezier(0.34, 1.45, 0.64, 1)";
      let mid: Keyframe;
      if (Math.abs(a.y - z.y) < 4) {
        // Same row: stretch to cover both buttons, then shrink onto the new one.
        const x0 = Math.min(a.x, z.x);
        const x1 = Math.max(a.x + a.w, z.x + z.w);
        mid = frame({ x: x0, y: a.y, w: x1 - x0, h: a.h });
      } else {
        // Different row: squash a little on the way across.
        mid = frame({ x: (a.x + z.x) / 2, y: (a.y + z.y) / 2, w: Math.max(a.w, z.w) * 1.1, h: a.h * 0.8 });
      }
      anim.current?.cancel();
      anim.current = el.animate([frame(a), { ...mid, offset: 0.42, easing: spring }, frame(z)], {
        duration: 480,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      });
    }
    settle(selected);
    prev.current = selected;
    selectedRef.current = selected;
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // Buttons can re-wrap when the screen or text size changes: snap the pill to the new spot.
  // Set up once (not per selection) and ignore the observer's first reading, or it would
  // cancel the stretch the moment a new button is picked.
  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row || typeof ResizeObserver === "undefined") return;
    let first = true;
    const ro = new ResizeObserver(() => {
      if (first) {
        first = false;
        return;
      }
      anim.current?.cancel();
      settle(selectedRef.current);
    });
    ro.observe(row);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={rowRef} className={`relative flex flex-wrap gap-2 ${className}`}>
      <span ref={pillRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 rounded-full bg-crate" />
      {options.map((label, i) => (
        <button
          key={label}
          ref={(el) => {
            chipRefs.current[i] = el;
          }}
          type="button"
          aria-pressed={i === selected}
          onClick={() => onSelect(i)}
          className={`relative min-h-11 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors delay-100 ${
            i === selected
              ? `border-transparent text-paper ${ready ? "" : "bg-crate"}`
              : "border-line text-ink/70 hover:border-crate/50"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
