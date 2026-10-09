"use client";

import { useEffect, useRef, useState } from "react";
import { packages, addOns, siteConfig } from "@/lib/site-config";
import { lookupZip, nearestHub, calculateDeliveryFee, type ZipInfo } from "@/lib/geo";
import Spinner from "@/components/Spinner";
import AddressAutocomplete, { type ParsedAddress } from "@/components/AddressAutocomplete";
import { promoDiscount, type AppliedPromo } from "@/lib/promo";

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
  notes: string;
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
  notes: "",
  pickupStreet: "",
  pickupCity: "",
  pickupState: "",
  pickupZip: "",
  honeypot: "",
};

type ZipStatus = "idle" | "checking" | "verified" | "not-found";

// Order matches the page top-to-bottom, so the first error here is the first
// one the person meets when we scroll/focus to it.
const FIELD_ORDER = [
  "name", "email", "phone", "street", "city", "state", "zip",
  "deliveryDate", "pickupDate",
  "pickupStreet", "pickupCity", "pickupState", "pickupZip", "agreed",
] as const;

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Every message says what's wrong AND how to fix it.
function computeErrors(form: FormState, zipStatus: ZipStatus, agreed: boolean): Record<string, string> {
  const e: Record<string, string> = {};
  const phoneDigits = form.phone.replace(/\D/g, "");

  if (form.name.trim().length < 2) e.name = "Enter your full name so we know who to look for at delivery.";

  if (!form.email.trim()) e.email = "Enter your email — we'll send your confirmation there.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    e.email = "That email looks incomplete. Use the format name@example.com.";

  if (!form.phone.trim()) e.phone = "Enter a phone number we can call or text about your delivery.";
  else if (!(phoneDigits.length === 10 || (phoneDigits.length === 11 && phoneDigits.startsWith("1"))))
    e.phone = "Enter a 10-digit phone number with area code, like 616-555-0100.";

  if (!form.street.trim()) e.street = "Enter the street address where we should deliver, like 123 Main St.";
  if (!form.city.trim()) e.city = "Enter the city we're delivering to.";
  if (!/^[A-Za-z]{2}$/.test(form.state.trim())) e.state = "Use the 2-letter state code, like MI.";

  if (!/^\d{5}$/.test(form.zip)) e.zip = "Enter a 5-digit zip code, like 49544.";
  else if (zipStatus === "not-found") e.zip = "We couldn't find that zip code. Check it for a typo and try again.";
  else if (zipStatus !== "verified") e.zip = "We're still checking this zip code. Wait a second, then try again.";

  const today = todayISO();
  if (!form.deliveryDate) e.deliveryDate = "Pick the day you want the totes delivered.";
  else if (form.deliveryDate < today) e.deliveryDate = "That date has already passed. Pick today or a later date.";

  if (!form.pickupDate) e.pickupDate = "Pick the day you want the empty totes picked up.";
  else if (form.deliveryDate && form.pickupDate < form.deliveryDate)
    e.pickupDate = `Pickup can't be before delivery. Pick ${formatDate(form.deliveryDate)} or later.`;

  if (!form.pickupStreet.trim()) e.pickupStreet = "Enter the street address for pickup. Tap \"Same as delivery address\" if it's the same.";
  if (!form.pickupCity.trim()) e.pickupCity = "Enter the pickup city.";
  if (!/^[A-Za-z]{2}$/.test(form.pickupState.trim())) e.pickupState = "Use the 2-letter state code, like MI.";
  if (!/^\d{5}$/.test(form.pickupZip)) e.pickupZip = "Enter a 5-digit zip code, like 49544.";

  if (!agreed) e.agreed = "Check this box to confirm you've read the rental agreement, terms, and privacy policy.";
  return e;
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={`${id}-error`} className="mt-1 text-sm text-red-700">
      {msg}
    </p>
  );
}

export default function BookingForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [addOnQty, setAddOnQty] = useState<Record<string, number>>({});
  const [agreed, setAgreed] = useState(false);

  // Promo code: checked by /api/promo, re-checked on submit by /api/reserve.
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<AppliedPromo | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoChecking, setPromoChecking] = useState(false);

  // Errors are derived from what's typed, never stored, so they update as the person
  // fixes a field and nothing they typed is ever cleared. A field's error shows once
  // they leave it (touched) or after the first submit attempt.
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [attempted, setAttempted] = useState(false);
  // Field-specific problem reported by the server; hidden again once that field is edited.
  const [serverField, setServerField] = useState<{ field: string; msg: string; value: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Refs block a second click/Enter in the same tick, before React re-renders
  // the disabled button.
  const submittingRef = useRef(false);
  const promoCheckingRef = useRef(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [zipStatus, setZipStatus] = useState<ZipStatus>("idle");
  const [zipInfo, setZipInfo] = useState<ZipInfo | null>(null);
  // Distances are measured to whichever hub is nearest that address, so each
  // leg also carries that hub's free radius — hubs can have different ones.
  const [distanceMiles, setDistanceMiles] = useState<number | null>(null);
  const [distanceRadius, setDistanceRadius] = useState<number>(siteConfig.freeDeliveryRadiusMiles);
  const [pickupDistanceMiles, setPickupDistanceMiles] = useState<number | null>(null);
  const [pickupRadius, setPickupRadius] = useState<number>(siteConfig.freeDeliveryRadiusMiles);
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
      const customerZip = await lookupZip(form.zip);

      if (!customerZip) {
        setZipStatus("not-found");
        setZipInfo(null);
        setDistanceMiles(null);
        return;
      }

      setZipStatus("verified");
      setZipInfo(customerZip);
      setForm((f) => ({ ...f, city: customerZip.city, state: customerZip.stateAbbreviation }));

      const { hub, miles } = nearestHub(customerZip.latitude, customerZip.longitude);
      setDistanceMiles(miles);
      setDistanceRadius(hub.freeRadiusMiles);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.zip]);

  // Same lookup for the pickup address, so an out-of-area pickup is priced.
  useEffect(() => {
    if (!/^\d{5}$/.test(form.pickupZip)) {
      setPickupDistanceMiles(null);
      return;
    }
    let cancelled = false;
    const t = window.setTimeout(async () => {
      const pz = await lookupZip(form.pickupZip);
      if (cancelled || !pz) return;
      const { hub, miles } = nearestHub(pz.latitude, pz.longitude);
      setPickupDistanceMiles(miles);
      setPickupRadius(hub.freeRadiusMiles);
    }, 500);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [form.pickupZip]);

  // Each leg is priced on its own — delivery and pickup are separate trips, so
  // an address outside the free zone costs us the drive either way.
  const deliveryLegFee =
    distanceMiles !== null
      ? calculateDeliveryFee(distanceMiles, distanceRadius, siteConfig.perMileFeeBeyondRadius)
      : 0;
  const pickupLegFee =
    pickupDistanceMiles !== null
      ? calculateDeliveryFee(pickupDistanceMiles, pickupRadius, siteConfig.perMileFeeBeyondRadius)
      : 0;
  const estimatedFee = deliveryLegFee + pickupLegFee;

  // Running total shown as an estimate. The server recalculates it for the
  // owner's email; nothing here is a charge.
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
  // Promo comes off the base package price only, so it recalculates if the
  // customer switches packages after applying a code.
  const promoSavings = promo && selectedPackage ? promoDiscount(promo, selectedPackage.price) : 0;
  const subtotalBeforePromo = (selectedPackage?.price ?? 0) + extraDaysTotal + addOnTotal + estimatedFee;
  const estimatedTotal = subtotalBeforePromo - promoSavings;

  async function applyPromo() {
    if (promoCheckingRef.current) return;
    setPromoError(null);
    if (!promoInput.trim()) {
      setPromoError("Enter your promo code first, then tap Apply.");
      return;
    }
    promoCheckingRef.current = true;
    setPromoChecking(true);
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput }),
      });
      const data = await res.json();
      if (data.ok) {
        setPromo(data.promo);
        setPromoInput(data.promo.code);
      } else {
        setPromo(null);
        setPromoError((data.error ?? "That code isn't valid.") + (data.error ? "" : " Check the spelling and try again."));
      }
    } catch {
      setPromoError("Couldn't check that code. Try again.");
    } finally {
      promoCheckingRef.current = false;
      setPromoChecking(false);
    }
  }

  function removePromo() {
    setPromo(null);
    setPromoInput("");
    setPromoError(null);
  }

  const valueOf = (k: string): string => (k === "agreed" ? String(agreed) : (form as Record<string, string>)[k] ?? "");
  const rawErrors = computeErrors(form, zipStatus, agreed);
  const errors: Record<string, string> = {};
  for (const k of FIELD_ORDER) {
    if (rawErrors[k] && (attempted || touched[k])) errors[k] = rawErrors[k];
  }
  if (serverField && valueOf(serverField.field) === serverField.value && !errors[serverField.field]) {
    errors[serverField.field] = serverField.msg;
  }
  const errorCount = Object.keys(rawErrors).length;

  // Props every validated control shares: red state, screen-reader link to its message, mark touched on blur.
  const fp = (name: string) => ({
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    onBlur: () => setTouched((t) => (t[name] ? t : { ...t, [name]: true })),
  });
  const cls = (name: string, extra = "") =>
    `${inputClass}${extra}${errors[name] ? " border-red-600! bg-red-50/40" : ""}`;

  function focusField(name: string) {
    const el = document.getElementById(name);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus({ preventScroll: true });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submittingRef.current) return;
    setServerError(null);
    setServerField(null);
    setAttempted(true);
    const found = computeErrors(form, zipStatus, agreed);
    const first = FIELD_ORDER.find((k) => found[k]);
    if (first) {
      focusField(first);
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    try {
      const address = `${form.street}, ${form.city}, ${form.state} ${form.zip}`;
      const pickupAddress = `${form.pickupStreet}, ${form.pickupCity}, ${form.pickupState} ${form.pickupZip}`;
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, address, pickupAddress, agreed, addOnQuantities: addOnQty, promoCode: promo?.code ?? "" }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.field && (FIELD_ORDER as readonly string[]).includes(data.field)) {
          // The server flagged a specific field: show it there, keep everything typed.
          setServerField({ field: data.field, msg: data.error, value: valueOf(data.field) });
          focusField(data.field);
        } else {
          setServerError(data.error ?? "Something went wrong. Please try again.");
        }
        submittingRef.current = false;
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
      window.scrollTo({ top: document.getElementById("booking")?.offsetTop ?? 0, behavior: "smooth" });
    } catch {
      setServerError("Network error — please try again.");
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  // min-h-11 = 44px tap target; text-base on phones stops iOS Safari zooming in on focus.
  const inputClass = "mt-1 min-h-11 w-full rounded-md border border-line bg-white px-3 py-2 text-base text-ink focus:border-crate sm:text-sm";
  const labelClass = "text-sm font-medium text-ink/80";
  

  return (
    <section id="booking" className="bg-tint-green">
      <div className="mx-auto max-w-2xl px-5 py-16">
        <h2 className="text-3xl font-bold text-ink">Reserve your totes</h2>
        <p className="mt-2 text-ink/75">Send a request and we&apos;ll get back to you within one business day. No payment now.</p>

        {submitted ? (
          <div className="mt-8 rounded-lg border border-crate bg-white/70 p-8 text-center">
            <p className="text-2xl font-bold text-ink">Request sent</p>
            <p className="mx-auto mt-3 max-w-md text-ink/75">
              Thanks, {form.name.split(" ")[0]}. We&apos;ve emailed a copy to {form.email} and
              we&apos;ll get back to you within one business day to confirm your dates and sort out
              payment. Nothing has been charged.
            </p>
            <p className="mt-4 text-sm text-ink/70">
              Need it sooner? Call {siteConfig.phone}.
            </p>
          </div>
        ) : (
        <form onSubmit={handleSubmit} noValidate aria-busy={submitting} className="mt-8 space-y-5">
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
              <input id="name" {...fp("name")} autoComplete="name" className={cls("name")} value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <FieldError id="name" msg={errors.name} />
            </div>
            <div>
              <label className={labelClass} htmlFor="email">Email</label>
              <input id="email" {...fp("email")} type="email" autoComplete="email" className={cls("email")} value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <FieldError id="email" msg={errors.email} />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="phone">Phone</label>
            <input id="phone" {...fp("phone")} type="tel" autoComplete="tel" className={cls("phone")} value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <FieldError id="phone" msg={errors.phone} />
          </div>

          <div>
            <label className={labelClass} htmlFor="street">Street address</label>
            <AddressAutocomplete
              id="street"
              className={cls("street")}
              inputProps={fp("street")}
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
            <FieldError id="street" msg={errors.street} />
          </div>

          <div className="grid gap-5 sm:grid-cols-[1fr_5rem_7rem]">
            <div>
              <label className={labelClass} htmlFor="city">City</label>
              <input id="city" {...fp("city")} autoComplete="address-level2" className={cls("city")} value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <FieldError id="city" msg={errors.city} />
            </div>
            {/* State and zip share a row on mobile instead of stacking as
                narrow orphans; they sit inline with city from sm up. */}
            <div className="grid grid-cols-2 gap-5 sm:contents">
              <div>
                <label className={labelClass} htmlFor="state">State</label>
                <input id="state" {...fp("state")} maxLength={2} autoComplete="address-level1"
                  className={cls("state", " uppercase")} value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })} />
                <FieldError id="state" msg={errors.state} />
              </div>
              <div>
                <label className={labelClass} htmlFor="zip">Zip code</label>
                <input id="zip" {...fp("zip")} inputMode="numeric" maxLength={5} autoComplete="postal-code"
                  className={cls("zip")} value={form.zip}
                  onChange={(e) => setForm({ ...form, zip: e.target.value.replace(/\D/g, "") })} />
                <FieldError id="zip" msg={errors.zip} />
              </div>
            </div>
          </div>

          <div className="text-sm">
            {zipStatus === "checking" && <p className="text-ink/70">Checking zip code…</p>}
            {zipStatus === "verified" && zipInfo && (
              <p className="text-crate">
                ✓ Verified: {zipInfo.city}, {zipInfo.stateAbbreviation}
                {distanceMiles !== null && (
                  <>
                    {" "}·{" "}
                    {distanceMiles <= distanceRadius ? (
                      <span className="text-ink/70">within our free {distanceRadius}-mile delivery zone</span>
                    ) : (
                      <span className="text-ink/70">
                        ~{Math.round(distanceMiles)} mi from our nearest hub — an estimated ${estimatedFee.toFixed(2)} delivery fee applies
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
              <input id="deliveryDate" {...fp("deliveryDate")} type="date" className={cls("deliveryDate")} value={form.deliveryDate}
                onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} />
              <FieldError id="deliveryDate" msg={errors.deliveryDate} />
            </div>
            <div>
              <label className={labelClass} htmlFor="pickupDate">Pickup date</label>
              <input id="pickupDate" {...fp("pickupDate")} type="date" className={cls("pickupDate")} value={form.pickupDate}
                onChange={(e) => setForm({ ...form, pickupDate: e.target.value })} />
              <FieldError id="pickupDate" msg={errors.pickupDate} />
            </div>
          </div>

          <div className="rounded-md border border-line bg-white/70 p-4">
            <p className="font-medium text-ink">Where should we pick the empties up?</p>
<p className="mt-0.5 text-sm text-ink/70">Usually the new place.</p>
            <button
              type="button"
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  pickupStreet: f.street,
                  pickupCity: f.city,
                  pickupState: f.state,
                  pickupZip: f.zip,
                }))
              }
              className="mt-3 min-h-11 rounded-md border border-crate px-3 py-1.5 text-sm font-medium text-crate hover:bg-crate/5"
            >
              Same as delivery address
            </button>

            <div className="mt-4 space-y-4 border-t border-line pt-4">
              <div>
                <label className={labelClass} htmlFor="pickupStreet">Pickup street address</label>
                <input id="pickupStreet" {...fp("pickupStreet")} autoComplete="off" className={cls("pickupStreet")} value={form.pickupStreet}
                  onChange={(e) => setForm({ ...form, pickupStreet: e.target.value })} />
                <FieldError id="pickupStreet" msg={errors.pickupStreet} />
              </div>
              <div className="grid gap-4 sm:grid-cols-[1fr_5rem_7rem]">
                <div>
                  <label className={labelClass} htmlFor="pickupCity">City</label>
                  <input id="pickupCity" {...fp("pickupCity")} className={cls("pickupCity")} value={form.pickupCity}
                    onChange={(e) => setForm({ ...form, pickupCity: e.target.value })} />
                  <FieldError id="pickupCity" msg={errors.pickupCity} />
                </div>
                <div className="grid grid-cols-2 gap-4 sm:contents">
                  <div>
                    <label className={labelClass} htmlFor="pickupState">State</label>
                    <input id="pickupState" {...fp("pickupState")} maxLength={2} className={cls("pickupState", " uppercase")} value={form.pickupState}
                      onChange={(e) => setForm({ ...form, pickupState: e.target.value.toUpperCase() })} />
                    <FieldError id="pickupState" msg={errors.pickupState} />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="pickupZip">Zip code</label>
                    <input id="pickupZip" {...fp("pickupZip")} inputMode="numeric" maxLength={5} className={cls("pickupZip")} value={form.pickupZip}
                      onChange={(e) => setForm({ ...form, pickupZip: e.target.value.replace(/\D/g, "") })} />
                    <FieldError id="pickupZip" msg={errors.pickupZip} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {rentalDays !== null && rentalDays > 0 && (
            <div className="rounded-md border border-line bg-white/70 p-3 text-sm">
              {extraDays === 0 ? (
<p className="text-ink/80"><span className="font-semibold text-crate">{rentalDays}-day rental</span> — included.</p>
              ) : (
<p className="text-ink/80">
                  <span className="font-semibold text-ink">{rentalDays}-day rental</span> — {includedDays} included
                  + {extraDays} day{extraDays > 1 ? "s" : ""} at ${(selectedPackage?.dailyRate ?? 0).toFixed(0)}/day.
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
              <option value="custom">Not sure / need a custom quote</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="notes">
              Anything we should know?{" "}
              <span className="font-normal text-ink/70">(optional)</span>
            </label>
            <textarea
              id="notes"
              rows={3}
              className={inputClass}
              placeholder="e.g. need more totes than the packages above, tight stairwell, specific drop-off time..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
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
                      <span className="ml-2 text-ink/70">
                        ${a.price} {a.unit !== "flat" ? a.unit : ""}
                      </span>
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

          <div>
            <label className={labelClass} htmlFor="promoCode">Promo code (optional)</label>
            {promo ? (
              <div className="mt-1 flex items-center justify-between rounded-md border border-crate bg-white px-3 py-2 text-sm">
                <span className="text-ink">
                  <span className="font-semibold">{promo.code}</span>
                  <span className="text-ink/70"> applied: {promo.label}</span>
                </span>
                <button type="button" onClick={removePromo} className="min-h-11 px-2 font-medium text-crate hover:underline">
                  Remove
                </button>
              </div>
            ) : (
              <div className="mt-1 flex gap-2">
                <input
                  id="promoCode"
                  aria-invalid={promoError ? true : undefined}
                  aria-describedby={promoError ? "promoCode-error" : undefined}
                  className={`${inputClass} mt-0 uppercase${promoError ? " border-red-600! bg-red-50/40" : ""}`}
                  value={promoInput}
                  autoComplete="off"
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    setPromoError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyPromo();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  disabled={promoChecking}
                  aria-busy={promoChecking}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-crate px-4 text-sm font-semibold text-crate hover:bg-crate/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {promoChecking && <Spinner className="h-3.5 w-3.5" />}
                  {promoChecking ? "Checking…" : "Apply"}
                </button>
              </div>
            )}
            <FieldError id="promoCode" msg={promoError ?? undefined} />
            {promo && form.packageId === "custom" && (
              <p className="mt-1 text-xs text-ink/70">We&apos;ll apply this code to your custom quote when we reply.</p>
            )}
          </div>

          {serverError && <p role="alert" className="text-sm text-red-700">{serverError}</p>}

          <div>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                id="agreed"
                {...fp("agreed")}
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
            <FieldError id="agreed" msg={errors.agreed} />
          </div>

          <div className="rounded-md border border-crate bg-crate/5 p-4">
            {form.packageId === "custom" ? (
              <p className="text-sm text-ink/80">
                <span className="font-semibold text-ink">No estimate to show yet</span> — tell us
                what you need in the notes above and we&apos;ll send a real quote when we reply.
              </p>
            ) : (
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-ink">Estimated total</span>
                <span className="text-right">
                  {promoSavings > 0 && (
                    <span className="mr-2 text-sm text-ink/70 line-through">${subtotalBeforePromo.toFixed(2)}</span>
                  )}
                  <span className="text-2xl font-extrabold text-ink">${estimatedTotal.toFixed(2)}</span>
                </span>
              </div>
            )}
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
              {promoSavings > 0 && (
                <div className="flex justify-between gap-3 font-medium text-crate">
                  <span>Promo {promo?.code}</span>
                  <span className="whitespace-nowrap">−${promoSavings.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery trip</span>
                <span>
                  {zipStatus !== "verified" ? "Enter zip" : deliveryLegFee > 0 ? `$${deliveryLegFee.toFixed(2)}` : "Free"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Pickup trip</span>
                <span>
                  {pickupDistanceMiles === null ? "Enter zip" : pickupLegFee > 0 ? `$${pickupLegFee.toFixed(2)}` : "Free"}
                </span>
              </div>
              <p className="mt-3 border-t border-crate/20 pt-3 text-xs text-ink/70">
                Estimate only — we&apos;ll confirm the final amount when we reply.
              </p>
            </div>
          </div>

          {attempted && errorCount > 0 && (
            <p role="alert" className="text-sm font-medium text-red-700">
              {errorCount === 1 ? "1 field needs a fix" : `${errorCount} fields need a fix`} — they&apos;re marked in red above. Everything else you entered is saved.
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-crate px-6 py-3 font-semibold text-paper hover:bg-crate-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && <Spinner />}
            {submitting ? "Sending…" : "Request these dates"}
          </button>
          <p className="text-xs text-ink/70">
Submitting a request doesn&apos;t charge you or lock in your dates — we&apos;ll confirm availability first.
          </p>
        </form>
        )}
      </div>
    </section>
  );
}
