// Single source of truth for FAQ content — used by /faq and its JSON-LD schema.
import { cancellationPolicy, damageFees, siteConfig } from "./site-config";

export const faqs = [
  { q: "How many totes will I need?", a: "As a rough guide: studio/1BR ≈ 15 totes, 2BR ≈ 25, 3BR ≈ 40, 4+BR ≈ 60. Use the calculator in our pricing section, and when in doubt, size up slightly." },
  { q: "How long should I rent for?", a: "Every package includes a 14-day rental, which covers most moves. Just pick your delivery and pickup dates — if you need longer than 14 days, we add a modest daily rate for the extra days and show you the total before you pay. Most people need 2–4 weeks once you count packing and unpacking." },
  { q: "Do I have to clean the totes?", a: "No — every tote is vacuumed, sanitized inside and out, and inspected between rentals before it reaches you. Just return them free of food debris and liquids." },
  { q: "What's included in each package?", a: "Every package includes the totes, at least one dolly, a matching set of labels, and free delivery and pickup within our service area." },
  { q: "How far in advance should I reserve?", a: "We recommend booking 1–2 weeks ahead, especially for weekends and month-end when demand is highest. Our fleet is limited, so booking early secures your dates." },
  { q: "What is your cancellation policy?", a: `Cancel at least ${cancellationPolicy.freeCancellationHours} hours before your scheduled delivery for a full refund. Inside that window, a $${cancellationPolicy.lateCancellationFee} cancellation fee applies. If the totes have already been delivered, a $${cancellationPolicy.postDeliveryRestockingFee} restocking fee applies.` },
  { q: "Can I change my rental dates?", a: "Usually yes, as long as we can accommodate it — just call, text, or email us as early as you can. If you need longer than your original rental period, contact us before your pickup date and we'll extend it at our standard daily rate." },
  { q: "What if I need more totes than I booked?", a: "Add extra totes at checkout, or contact us during your rental and we'll do our best to get more to you the same week." },
  { q: "What if a tote is lost or damaged?", a: `Normal wear and tear is expected and never charged for. Totes lost or damaged beyond normal use are $${damageFees.perTote} each, and the dolly is $${damageFees.perAccessory}. Returned needing more than a wipe-down? A $${damageFees.cleaning} cleaning fee may apply.` },
  { q: "Do the lids lock or snap shut?", a: "Yes — each lid snaps securely and stays closed during transport." },
  { q: "Do I need tape with these totes?", a: "No tape needed — that's the point." },
  { q: "How much weight can a tote hold?", a: "Up to roughly 60 lbs per tote, comfortably." },
  { q: "Do I need to be home for delivery or pickup?", a: "Not necessarily — let us know a safe drop-off spot when you book, and we'll coordinate the rest by text or email." },
  { q: "What happens if it rains on moving day?", a: "Our totes have secure, weather-resistant lids, so your things stay dry and protected — unlike cardboard, which loses strength when wet." },
  { q: "Do you deliver outside your free zone?", a: `Yes. Delivery and pickup are free within ${siteConfig.freeDeliveryRadiusMiles} miles of our hub. Beyond that, a $${siteConfig.perMileFeeBeyondRadius.toFixed(2)}/mile fee applies, calculated automatically at checkout. Use the zip checker in our service area section to see what applies to you.` },
  { q: "Do you pack or move my belongings?", a: "No — we're a tote rental service, not a moving company. We drop off clean totes, you pack, and we collect them once you're unpacked. Movers love our totes because they stack tight in the truck." },
];
