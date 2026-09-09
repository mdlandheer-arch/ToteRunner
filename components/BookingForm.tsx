"use client";

import { useState } from "react";
import { packages, addOns } from "@/lib/site-config";

type FormState = {
  name: string;
  email: string;
  phone: string;
  address: string;
  deliveryDate: string;
  pickupDate: string;
  packageId: string;
  honeypot: string; // hidden field — bots tend to fill every input
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  deliveryDate: "",
  pickupDate: "",
  packageId: packages[1]?.id ?? packages[0].id,
  honeypot: "",
};

export default function BookingForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [addOnQty, setAddOnQty] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email.";
    if (!/^[\d\s()+-]{7,}$/.test(form.phone)) next.phone = "Enter a valid phone number.";
    if (!form.address.trim()) next.address = "Moving address is required.";
    if (!form.deliveryDate) next.deliveryDate = "Pick a delivery date.";
    if (!form.pickupDate) next.pickupDate = "Pick a pickup date.";
    if (form.deliveryDate && form.pickupDate && form.pickupDate < form.deliveryDate) {
      next.pickupDate = "Pickup date must be on or after delivery date.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, addOnQuantities: addOnQty }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setServerError("Network error — please try again.");
      setSubmitting(false);
    }
  }

  const inputClass = "mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-crate";
  const labelClass = "text-sm font-medium text-ink/80";
  const errorClass = "mt-1 text-xs text-red-600";

  return (
    <section id="booking" className="bg-white/60">
      <div className="mx-auto max-w-2xl px-5 py-16">
        <h2 className="text-3xl font-bold text-ink">Reserve your totes</h2>
        <p className="mt-2 text-ink/70">Fill this out and you&apos;ll be taken to secure checkout.</p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          {/* Honeypot — hidden from real users via CSS, invisible to screen readers */}
          <div aria-hidden="true" className="hidden">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              tabIndex={-1}
              autoComplete="off"
              value={form.honeypot}
              onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="name">Full name</label>
              <input id="name" className={inputClass} value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <p className={errorClass}>{errors.name}</p>}
            </div>
            <div>
              <label className={labelClass} htmlFor="email">Email</label>
              <input id="email" type="email" className={inputClass} value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="phone">Phone</label>
              <input id="phone" type="tel" className={inputClass} value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              {errors.phone && <p className={errorClass}>{errors.phone}</p>}
            </div>
            <div>
              <label className={labelClass} htmlFor="address">Moving address</label>
              <input id="address" className={inputClass} value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })} />
              {errors.address && <p className={errorClass}>{errors.address}</p>}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="deliveryDate">Delivery date</label>
              <input id="deliveryDate" type="date" className={inputClass} value={form.deliveryDate}
                onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} />
              {errors.deliveryDate && <p className={errorClass}>{errors.deliveryDate}</p>}
            </div>
            <div>
              <label className={labelClass} htmlFor="pickupDate">Pickup date</label>
              <input id="pickupDate" type="date" className={inputClass} value={form.pickupDate}
                onChange={(e) => setForm({ ...form, pickupDate: e.target.value })} />
              {errors.pickupDate && <p className={errorClass}>{errors.pickupDate}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="packageId">Package</label>
            <select id="packageId" className={inputClass} value={form.packageId}
              onChange={(e) => setForm({ ...form, packageId: e.target.value })}>
              {packages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.totes} totes — ${p.price}
                </option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className={labelClass}>Add-ons (optional)</legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {addOns.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-md border border-line px-3 py-2">
                  <span className="text-sm text-ink/80">{a.name} (${a.price} {a.unit !== "flat" ? a.unit : ""})</span>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    className="w-16 rounded-md border border-line px-2 py-1 text-sm"
                    value={addOnQty[a.id] ?? 0}
                    onChange={(e) =>
                      setAddOnQty({ ...addOnQty, [a.id]: Math.max(0, Number(e.target.value)) })
                    }
                    aria-label={`Quantity for ${a.name}`}
                  />
                </div>
              ))}
            </div>
          </fieldset>

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-crate px-6 py-3 font-semibold text-paper hover:bg-crate-dark disabled:opacity-60"
          >
            {submitting ? "Redirecting to checkout…" : "Continue to payment"}
          </button>
          <p className="text-xs text-steel">
            Payment is processed securely by Stripe. We never see or store your card details.
          </p>
        </form>
      </div>
    </section>
  );
}
