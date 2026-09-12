"use client";

import { useEffect, useRef, useState } from "react";
import { packages, addOns, siteConfig } from "@/lib/site-config";
import { lookupZip, haversineMiles, calculateDeliveryFee, type ZipInfo } from "@/lib/geo";
import AddressAutocomplete, { type ParsedAddress } from "@/components/AddressAutocomplete";

type FormState = {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  deliveryDate: string;
  pickupDate: string;
  packageId: string;
  // Pickup is often the new home, so it's captured separately when it differs.
  pickupStreet: string;
  pickupCity: string;
  pickupState: string;
  pickupZip: string;
  honeypot: string; // hidden field — bots tend to fill every input
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  deliveryDate: "",
  pickupDate: "",
  packageId: packages[1]?.id ?? packages[0].id,
  pickupStreet: "",
  pickupCity: "",
  pickupState: "",
  pickupZip: "",
  honeypot: "",
};

type ZipStatus = "idle" | "checking" | "verified" | "not-found";

export default function BookingForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [addOnQty, setAddOnQty] = useState<Record<string, number>>({});
  const [differentPickup, setDifferentPickup] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [zipStatus, setZipStatus] = useState<ZipStatus>("idle");
  const [zipInfo, setZipInfo] = useState<ZipInfo | null>(null);
  const [distanceMiles, setDistanceMiles] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Verify the zip as the person types (debounced) and auto-fill city/state.
  // This is a live estimate for the person's benefit — the actual delivery
  // fee is always recalculated server-side at checkout, since a client-side
  // number could be tampered with before it reaches the payment step.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!/^\d{5}$/.test(form.zip)) {
      setZipStatus("idle");
      setZipInfo(null);
      setDistanceMiles(null);
      return;
    }

    setZipStatus("checking");
    debounceRef.current = setTimeout(async () => {
      const [customerZip, businessZip] = await Promise.all([
        lookupZip(form.zip),
        lookupZip(siteConfig.businessZip),
      ]);

      if (!customerZip) {
        setZipStatus("not-found");
        setZipInfo(null);
        setDistanceMiles(null);
        return;
      }

      setZipStatus("verified");
      setZipInfo(customerZip);
      setForm((f) => ({ ...f, city: customerZip.city, state: customerZip.stateAbbreviation }));

      if (businessZip) {
        const miles = haversineMiles(
          customerZip.latitude,
          customerZip.longitude,
          businessZip.latitude,
          businessZip.longitude
        );
        setDistanceMiles(miles);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.zip]);

  const estimatedFee =
    distanceMiles !== null
      ? calculateDeliveryFee(distanceMiles, siteConfig.freeDeliveryRadiusMiles, siteConfig.perMileFeeBeyondRadius)
      : 0;

  // Running total so nobody reaches Stripe surprised by the amount. The
  // server recalculates everything independently at checkout — this is a
  // preview, not the source of truth.
  const selectedPackage = packages.find((p) => p.id === form.packageId);

  // Rental length comes from the dates the customer picked — the dates are the
  // single source of truth, so there's nothing for them to keep in sync. Any
  // time past the package's included period is billed in whole weeks.
  const rentalDays =
    form.deliveryDate && form.pickupDate
      ? Math.max(
          0,
          Math.round(
            (new Date(form.pickupDate).getTime() - new Date(form.deliveryDate).getTime()) /
              86_400_000
          )
        )
      : null;
  const includedDays = selectedPackage?.days ?? 14;
  const extraDays =
    rentalDays !== null && rentalDays > includedDays ? rentalDays - includedDays : 0;
  const addOnTotal = Object.entries(addOnQty).reduce((sum, [id, qty]) => {
    const a = addOns.find((x) => x.id === id);
    return a && qty > 0 ? sum + a.price * qty : sum;
  }, 0);
  const extraDaysTotal = (selectedPackage?.dailyRate ?? 0) * extraDays;
  const estimatedTotal = (selectedPackage?.price ?? 0) + extraDaysTotal + addOnTotal + estimatedFee;

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email.";
    if (!/^[\d\s()+-]{7,}$/.test(form.phone)) next.phone = "Enter a valid phone number.";
    if (!form.street.trim()) next.street = "Street address is required.";
    if (!/^\d{5}$/.test(form.zip)) next.zip = "Enter a 5-digit zip code.";
    else if (zipStatus === "not-found") next.zip = "We couldn't verify this zip code.";
    else if (zipStatus !== "verified") next.zip = "Still verifying — wait a moment and try again.";
    if (!form.city.trim()) next.city = "City is required.";
    if (!form.state.trim()) next.state = "State is required.";
    if (!form.deliveryDate) next.deliveryDate = "Pick a delivery date.";
    if (!form.pickupDate) next.pickupDate = "Pick a pickup date.";
    if (form.deliveryDate && form.pickupDate && form.pickupDate < form.deliveryDate) {
      next.pickupDate = "Pickup date must be on or after delivery date.";
    }
    if (differentPickup) {
      if (!form.pickupStreet.trim()) next.pickupStreet = "Pickup street address is required.";
      if (!form.pickupCity.trim()) next.pickupCity = "Pickup city is required.";
      if (!form.pickupState.trim()) next.pickupState = "Pickup state is required.";
      if (!/^\d{5}$/.test(form.pickupZip)) next.pickupZip = "Enter a 5-digit zip code.";
    }
    if (!agreed) next.agreed = "Please review and accept the rental agreement.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const address = `${form.street}, ${form.city}, ${form.state} ${form.zip}`;
      const pickupAddress = differentPickup
        ? `${form.pickupStreet}, ${form.pickupCity}, ${form.pickupState} ${form.pickupZip}`
        : address;
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, address, pickupAddress, agreed, addOnQuantities: addOnQty }),
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
    <section id="booking">
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
              <input id="name" autoComplete="name" className={inputClass} value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <p className={errorClass}>{errors.name}</p>}
            </div>
            <div>
              <label className={labelClass} htmlFor="email">Email</label>
              <input id="email" type="email" autoComplete="email" className={inputClass} value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="phone">Phone</label>
            <input id="phone" type="tel" autoComplete="tel" className={inputClass} value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            {errors.phone && <p className={errorClass}>{errors.phone}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="street">Street address</label>
            <AddressAutocomplete
              id="street"
              className={inputClass}
              value={form.street}
              onChange={(street) => setForm({ ...form, street })}
              onAddressSelected={(addr: ParsedAddress) =>
                setForm((f) => ({
                  ...f,
                  street: addr.street || f.street,
                  city: addr.city || f.city,
                  state: addr.state || f.state,
                  zip: addr.zip || f.zip,
                }))
              }
            />
            {errors.street && <p className={errorClass}>{errors.street}</p>}
          </div>

          <div className="grid gap-5 sm:grid-cols-[1fr_5rem_7rem]">
            <div>
              <label className={labelClass} htmlFor="city">City</label>
              <input id="city" autoComplete="address-level2" className={inputClass} value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })} />
              {errors.city && <p className={errorClass}>{errors.city}</p>}
            </div>
            {/* State and zip share a row on mobile instead of stacking as
                narrow orphans; they sit inline with city from sm up. */}
            <div className="grid grid-cols-2 gap-5 sm:contents">
              <div>
                <label className={labelClass} htmlFor="state">State</label>
                <input id="state" maxLength={2} autoComplete="address-level1"
                  className={`${inputClass} uppercase`} value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })} />
                {errors.state && <p className={errorClass}>{errors.state}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="zip">Zip code</label>
                <input id="zip" inputMode="numeric" maxLength={5} autoComplete="postal-code"
                  className={inputClass} value={form.zip}
                  onChange={(e) => setForm({ ...form, zip: e.target.value.replace(/\D/g, "") })} />
                {errors.zip && <p className={errorClass}>{errors.zip}</p>}
              </div>
            </div>
          </div>

          <div className="text-sm">
            {zipStatus === "checking" && <p className="text-steel">Checking zip code…</p>}
            {zipStatus === "not-found" && (
              <p className="text-red-600">We couldn&apos;t verify that zip code — double check it.</p>
            )}
            {zipStatus === "verified" && zipInfo && (
              <p className="text-crate">
                ✓ Verified: {zipInfo.city}, {zipInfo.stateAbbreviation}
                {distanceMiles !== null && (
                  <>
                    {" "}·{" "}
                    {distanceMiles <= siteConfig.freeDeliveryRadiusMiles ? (
                      <span className="text-ink/70">within our free {siteConfig.freeDeliveryRadiusMiles}-mile delivery zone</span>
                    ) : (
                      <span className="text-ink/70">
                        ~{Math.round(distanceMiles)} mi from our hub — an estimated ${estimatedFee.toFixed(2)} delivery fee applies
                      </span>
                    )}
                  </>
                )}
              </p>
            )}
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

          <div className="rounded-md border border-line bg-white/60 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={differentPickup}
                onChange={(e) => setDifferentPickup(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--crate-green)]"
              />
              <span className="text-sm text-ink/80">
                <span className="font-medium text-ink">Pick up from a different address</span>
                <span className="mt-0.5 block text-steel">
                  Most people unpack at the new place — tell us where to collect the empties.
                </span>
              </span>
            </label>

            {differentPickup && (
              <div className="mt-4 space-y-4 border-t border-line pt-4">
                <div>
                  <label className={labelClass} htmlFor="pickupStreet">Pickup street address</label>
                  <input id="pickupStreet" autoComplete="off" className={inputClass} value={form.pickupStreet}
                    onChange={(e) => setForm({ ...form, pickupStreet: e.target.value })} />
                  {errors.pickupStreet && <p className={errorClass}>{errors.pickupStreet}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-[1fr_5rem_7rem]">
                  <div>
                    <label className={labelClass} htmlFor="pickupCity">City</label>
                    <input id="pickupCity" className={inputClass} value={form.pickupCity}
                      onChange={(e) => setForm({ ...form, pickupCity: e.target.value })} />
                    {errors.pickupCity && <p className={errorClass}>{errors.pickupCity}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:contents">
                    <div>
                      <label className={labelClass} htmlFor="pickupState">State</label>
                      <input id="pickupState" maxLength={2} className={`${inputClass} uppercase`} value={form.pickupState}
                        onChange={(e) => setForm({ ...form, pickupState: e.target.value.toUpperCase() })} />
                      {errors.pickupState && <p className={errorClass}>{errors.pickupState}</p>}
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="pickupZip">Zip code</label>
                      <input id="pickupZip" inputMode="numeric" maxLength={5} className={inputClass} value={form.pickupZip}
                        onChange={(e) => setForm({ ...form, pickupZip: e.target.value.replace(/\D/g, "") })} />
                      {errors.pickupZip && <p className={errorClass}>{errors.pickupZip}</p>}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-steel">
                  Delivery pricing is based on your delivery address above.
                </p>
              </div>
            )}
          </div>

          {rentalDays !== null && rentalDays > 0 && (
            <div className="rounded-md border border-line bg-white/60 p-3 text-sm">
              {extraDays === 0 ? (
                <p className="text-ink/80">
                  <span className="font-semibold text-crate">{rentalDays}-day rental</span> — covered
                  by the {includedDays} days included in your package.
                </p>
              ) : (
                <p className="text-ink/80">
                  <span className="font-semibold text-ink">{rentalDays}-day rental</span> —{" "}
                  {includedDays} days included, plus {extraDays} extra day
                  {extraDays > 1 ? "s" : ""} at $
                  {(selectedPackage?.dailyRate ?? 0).toFixed(0)}/day.
                </p>
              )}
            </div>
          )}

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
            <div className="mt-2 space-y-2">
              {addOns.map((a) => {
                const qty = addOnQty[a.id] ?? 0;
                const setQty = (n: number) =>
                  setAddOnQty({ ...addOnQty, [a.id]: Math.min(20, Math.max(0, n)) });
                return (
                  <div key={a.id} className="flex items-center justify-between rounded-md border border-line px-3 py-2">
                    <div className="text-sm">
                      <span className="text-ink/80">{a.name}</span>
                      <span className="ml-2 text-steel">
                        ${a.price} {a.unit !== "flat" ? a.unit : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setQty(qty - 1)}
                        disabled={qty === 0}
                        aria-label={`Remove one ${a.name}`}
                        className="h-9 w-9 rounded-md border border-line text-lg leading-none text-ink disabled:opacity-30"
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
                        className="h-9 w-9 rounded-md border border-line text-lg leading-none text-ink"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </fieldset>

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <div>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--crate-green)]"
              />
              <span className="text-sm text-ink/80">
                I have reviewed and agree to the{" "}
                <a href="/rental-agreement" target="_blank" rel="noopener noreferrer" className="font-medium text-crate underline">
                  rental agreement
                </a>
                ,{" "}
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="font-medium text-crate underline">
                  terms
                </a>
                , and{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-crate underline">
                  privacy policy
                </a>
                .
              </span>
            </label>
            {errors.agreed && <p className={errorClass}>{errors.agreed}</p>}
          </div>

          <div className="rounded-md border border-crate bg-crate/5 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-ink">Estimated total</span>
              <span className="text-2xl font-extrabold text-ink">${estimatedTotal.toFixed(2)}</span>
            </div>
            <div className="mt-2 space-y-1 text-sm text-ink/70">
              {selectedPackage && (
                <div className="flex justify-between">
                  <span>{selectedPackage.name} ({selectedPackage.totes} totes)</span>
                  <span>${selectedPackage.price.toFixed(2)}</span>
                </div>
              )}
              {extraDays > 0 && (
                <div className="flex justify-between">
                  <span>
                    +{extraDays} day{extraDays > 1 ? "s" : ""} @ ${(selectedPackage?.dailyRate ?? 0).toFixed(0)}/day
                  </span>
                  <span>${extraDaysTotal.toFixed(2)}</span>
                </div>
              )}
              {addOns.map((a) => {
                const qty = addOnQty[a.id] ?? 0;
                if (qty <= 0) return null;
                return (
                  <div key={a.id} className="flex justify-between">
                    <span>
                      {a.name}
                      {qty > 1 ? ` × ${qty}` : ""}
                    </span>
                    <span>${(a.price * qty).toFixed(2)}</span>
                  </div>
                );
              })}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>
                  {zipStatus !== "verified"
                    ? "Enter zip"
                    : estimatedFee > 0
                      ? `$${estimatedFee.toFixed(2)}`
                      : "Free"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-crate px-6 py-3 font-semibold text-paper hover:bg-crate-dark disabled:opacity-60"
          >
            {submitting ? "Redirecting to checkout…" : "Continue to payment"}
          </button>
          <p className="text-xs text-steel">
            Payment is processed securely by Stripe. We never see or store your card details.
            {siteConfig.perMileFeeBeyondRadius > 0 && " Delivery fees beyond our free zone are calculated automatically at checkout."}
          </p>
        </form>
      </div>
    </section>
  );
}
