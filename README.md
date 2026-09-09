# CrateHaul — reusable moving tote rental site

Next.js 15 (App Router) + TypeScript + Tailwind v4. Same business model as the
reference (reusable tote delivery/pickup for moves), original branding and copy.

## 1. Rename it (5 min)

Everything — business name, city, service area list, email, phone, prices —
lives in one file: **`lib/site-config.ts`**. Edit that file, and the whole
site (nav, footer, meta tags, OG image alt text, pricing cards) updates.

The OG social-share image (`public/og-image.png`) and favicon (`app/icon.png`)
are placeholder graphics generated for this build — swap them for real brand
art before launch.

## 2. Local setup

```bash
npm install
cp .env.example .env.local
# edit .env.local with your real Stripe test key
npm run dev
```

## 3. Stripe (required for checkout to work)

1. Create a Stripe account: https://dashboard.stripe.com
2. Get your **secret key** (starts `sk_test_...` for testing, `sk_live_...`
   for real charges): https://dashboard.stripe.com/apikeys
3. Set `STRIPE_SECRET_KEY` in `.env.local` (local) and in your host's
   environment variables (production) — never commit it to git.
4. Test with Stripe's test card `4242 4242 4242 4242`, any future expiry, any CVC.

**Not yet wired up:** a Stripe webhook to confirm bookings server-side after
payment. Right now, `/success` shows once Stripe redirects back — that's fine
for a v1, but the reliable way to know a booking is *actually* paid is a
webhook (`checkout.session.completed`) that writes to a database or sends you
a notification. Flag this if fulfillment accuracy matters from day one —
happy to add it once you have a database or notification target picked out.

## 4. Deploy (Vercel is the path of least resistance for Next.js)

1. Push this folder to a GitHub repo
2. Import it at https://vercel.com/new
3. Add `STRIPE_SECRET_KEY` under Project Settings -> Environment Variables
4. Deploy — Vercel handles HTTPS and the redirect from http:// automatically

## 5. Before you actually launch

- [ ] Have an attorney review `/privacy` and `/terms` — both are templates
      with placeholders (`[DATE]`, `[AMOUNT]`, `[STATE]`), not legal advice
- [ ] Replace the sample reviews in `components/Reviews.tsx` with real,
      attributed customer testimonials — don't publish the placeholders as-is
- [ ] Set a real `gaMeasurementId` in `site-config.ts` once you have GA4 set up
      (analytics only loads after a visitor accepts the cookie banner)
- [ ] Update `domain` in `site-config.ts` to your real URL — this feeds the
      sitemap, canonical tags, and Stripe success/cancel redirect URLs
- [ ] Decide on your actual damage/loss fee and cancellation window
      (both are placeholders in `/terms`)
- [ ] Swap the placeholder OG image and favicon for real brand art
- [ ] Add the Stripe webhook mentioned above if you want reliable booking
      confirmation independent of the browser redirect

## Where each of the "20 things before launch" items landed

| # | Item | Where |
|---|------|-------|
| 1 | Privacy policy | `/privacy` (template — needs attorney review) |
| 2 | Terms & conditions | `/terms` (template — needs attorney review) |
| 3 | Secrets off the frontend | Stripe secret key only in `lib/stripe.ts`, used server-side in `/api/checkout` |
| 4 | Force HTTPS | Handled automatically by Vercel/Netlify at the host level |
| 5 | Cookie consent banner | `components/CookieConsent.tsx` — also gates GA4 loading |
| 6 | Meta titles + descriptions | Per-page `metadata` exports (`app/layout.tsx`, `app/privacy/page.tsx`, etc.) |
| 7 | Social preview image | `public/og-image.png` + OpenGraph/Twitter metadata |
| 8 | Favicon | `app/icon.png` (Next.js auto-serves it) |
| 9 | Sitemap + robots.txt | `app/sitemap.ts`, `app/robots.ts` (generated dynamically from config) |
| 10 | Alt text on images | SVG hero has `role="img"` + `aria-label`; add `alt` to any real photos you bring in |
| 11 | Compress images | No heavy raster images shipped; use `next/image` for anything you add |
| 12 | Page load speed | Static generation for every page except the checkout API route |
| 13 | Color contrast | Ink/paper/crate-green palette checked for readable contrast |
| 14 | Mobile friendly | Tailwind responsive classes throughout |
| 15 | Custom 404 | `app/not-found.tsx` |
| 16 | Fix broken links | All internal links point to real routes/anchors in this build |
| 17 | Form validation | Client-side in `BookingForm.tsx` + re-validated server-side in `/api/checkout` |
| 18 | Spam protection | Honeypot field + basic rate limiting on `/api/checkout`; add Turnstile/hCaptcha for stronger protection |
| 19 | Analytics | GA4 wired in `CookieConsent.tsx`, inactive until you set a real measurement ID |
| 20 | One clear CTA | "Reserve your totes" / "Reserve now" used consistently site-wide |
