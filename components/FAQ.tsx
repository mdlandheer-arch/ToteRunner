import { cancellationPolicy, siteConfig } from "@/lib/site-config";
import { FAQSchema } from "@/components/StructuredData";

export const faqs = [
  { q: "How many totes will I need?", a: "As a rough guide: studio/1BR ≈ 15 totes, 2BR ≈ 25, 3BR ≈ 40, 4+BR ≈ 60. Use the calculator in our pricing section, and when in doubt, size up slightly." },
  { q: "How long should I rent for?", a: "Most people need 1–2 weeks to pack before moving day and another 1–2 weeks to unpack after — so 2–4 weeks total is typical. Count backward from your move date, add time on the other side, and book that. You can always add days later." },
  { q: "Do I have to clean the totes?", a: "No — every tote is vacuumed, sanitized inside and out, and inspected between rentals before it reaches you. Just return them free of food debris and liquids." },
  { q: "What's included in each package?", a: "Every package includes the totes, at least one dolly, a matching set of labels, and free delivery and pickup within our service area." },
  { q: "How far in advance should I reserve?", a: "We recommend booking 1–2 weeks ahead, especially for weekends and month-end when demand is highest. Our fleet is limited, so booking early secures your dates." },
  { q: "What is your cancellation policy?", a: `Cancel at least ${cancellationPolicy.freeCancellationHours} hours before your scheduled delivery for a full refund. Inside that window, a $${cancellationPolicy.lateCancellationFee} cancellation fee applies. If the totes have already been delivered, a $${cancellationPolicy.postDeliveryRestockingFee} restocking fee applies.` },
  { q: "Can I change my rental dates?", a: "Usually yes, as long as we can accommodate it — just call, text, or email us as early as you can. If you need longer than your original rental period, you can add extra days at checkout or by contacting us before your pickup date." },
  { q: "What if I need more totes than I booked?", a: "Add extra totes at checkout, or contact us during your rental and we'll do our best to get more to you the same week." },
  { q: "What if a tote is lost or damaged?", a: "A reasonable replacement fee applies for lost or badly damaged totes — the details are in our terms & conditions." },
  { q: "Do the lids lock or snap shut?", a: "Yes — each lid snaps securely and stays closed during transport." },
  { q: "Do I need tape with these totes?", a: "No tape needed — that's the point." },
  { q: "How much weight can a tote hold?", a: "Up to roughly 60 lbs per tote, comfortably." },
  { q: "Do I need to be home for delivery or pickup?", a: "Not necessarily — let us know a safe drop-off spot when you book, and we'll coordinate the rest by text or email." },
  { q: "What happens if it rains on moving day?", a: "Our totes have secure, weather-resistant lids, so your things stay dry and protected — unlike cardboard, which loses strength when wet." },
  { q: "Do you deliver outside your free zone?", a: `Yes. Delivery and pickup are free within ${siteConfig.freeDeliveryRadiusMiles} miles of our hub. Beyond that, a $${siteConfig.perMileFeeBeyondRadius.toFixed(2)}/mile fee applies, calculated automatically at checkout. Use the zip checker in our service area section to see what applies to you.` },
  { q: "Do you pack or move my belongings?", a: "No — we're a tote rental service, not a moving company. We drop off clean totes, you pack, and we collect them once you're unpacked. Movers love our totes because they stack tight in the truck." },
];

export default function FAQ() {
  return (
    <section id="faq">
      <FAQSchema faqs={faqs} />
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-bold text-ink">Frequently asked questions</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-ink">
                {f.q}
                <span className="ml-4 text-crate transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
