"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";

// One calendar for both dates: tap the delivery day, then the pickup day.
// Values are plain "YYYY-MM-DD" strings in local time, the same shape the form
// and API already use, so nothing downstream changes.

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fromISO(iso: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const short = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
const withYear = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

function formatRange(from?: Date, to?: Date): string | null {
  if (!from) return null;
  if (!to) return `${withYear(from)} → pick pickup day`;
  if (toISO(from) === toISO(to)) return `${withYear(from)} (same-day pickup)`;
  if (from.getFullYear() === to.getFullYear()) return `${short(from)} – ${short(to)}, ${to.getFullYear()}`;
  return `${withYear(from)} – ${withYear(to)}`;
}

type Props = {
  /** Delivery date, "YYYY-MM-DD" or "". */
  delivery: string;
  /** Pickup date, "YYYY-MM-DD" or "". */
  pickup: string;
  onChange: (delivery: string, pickup: string) => void;
  /** Called when the calendar closes, so the form can show any date errors. */
  onClose?: () => void;
  /** Id of the trigger button. The label's htmlFor and focus-on-error point at it. */
  id: string;
  invalid?: boolean;
  describedBy?: string;
};

export default function DateRangePicker({ delivery, pickup, onChange, onClose, id, invalid, describedBy }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  const from = fromISO(delivery);
  const to = fromISO(pickup);
  const selected: DateRange | undefined = from ? { from, to } : undefined;

  function close(returnFocus: boolean) {
    setOpen(false);
    onClose?.();
    if (returnFocus) triggerRef.current?.focus();
  }

  // On a phone the trigger can sit low on screen; bring the calendar fully into view when it opens.
  useEffect(() => {
    if (open) dialogRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [open]);

  // Close on outside tap/click or Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        onClose?.();
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        onClose?.();
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const label = formatRange(from, to);
  const hint = !from ? "Tap your delivery day." : !to ? "Now tap your pickup day." : "Tap a new day to start over.";

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        aria-invalid={invalid ? true : undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? close(false) : setOpen(true))}
        className={`mt-1 flex min-h-11 w-full items-center justify-between gap-3 rounded-md border bg-white px-3 py-2 text-left text-base focus:border-crate sm:text-sm ${
          invalid ? "border-red-600 bg-red-50/40" : "border-line"
        }`}
      >
        <span className={label ? "text-ink" : "text-ink/60"}>{label ?? "Pick delivery and pickup days"}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="shrink-0 text-ink/60">
          <rect x="2" y="3.5" width="12" height="10.5" rx="1.5" />
          <path d="M2 7h12M5.5 2v3M10.5 2v3" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          ref={dialogRef}
          id={dialogId}
          role="dialog"
          aria-label="Choose delivery and pickup dates"
          className="absolute left-0 z-30 mt-2 max-w-full overflow-x-auto rounded-md border border-line bg-white p-2"
        >
          <p className="px-2 pb-1 pt-1 text-sm font-medium text-ink" aria-live="polite">
            {hint}
          </p>
          <DayPicker
            mode="range"
            className="tr-calendar"
            selected={selected}
            defaultMonth={from ?? new Date()}
            disabled={{ before: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) }}
            resetOnSelect
            autoFocus
            onSelect={(range) => {
              const f = range?.from;
              const t = range?.to;
              onChange(f ? toISO(f) : "", t ? toISO(t) : "");
              if (f && t) close(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
