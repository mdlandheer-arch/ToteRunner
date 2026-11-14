// Single source of truth for FAQ content — used by /faq and its JSON-LD schema.
import { cancellationPolicy, customPackage, damageFees, eventPackage, siteConfig } from "./site-config";

export const faqs = [
  { q: "How many totes will I need?", a: "As a rough guide: studio/1BR ≈ 15 totes, 2BR ≈ 25, 3BR ≈ 40, 4+BR ≈ 60. Use the calculator in the pricing section. If you're unsure, go a bit bigger." },
  { q: "Can I build my own package?", a: `Yes. Use the builder in the pricing section to pick the number of totes (${customPackage.minTotes}–${customPackage.maxTotes}) and 1–${customPackage.maxWeeks} weeks, and the price updates as you go. At 15, 25, 40 or 60 totes for 2 weeks it costs the same as the matching package. Dollies, labels, delivery and pickup are included.` },
  { q: "How long should I rent for?", a: "Every package includes 14 days, which covers most moves. Pick your delivery and pickup dates. If you need more than 14 days, the extra days are charged at a daily rate and you'll see the total before you pay. Most people need 2–4 weeks once packing and unpacking are counted." },
  { q: "Do I have to clean the totes?", a: "No. Every tote is vacuumed, sanitized inside and out, and checked between rentals. Just return them free of food and liquids." },
  { q: "What's included in each package?", a: "Every package includes the totes, at least one dolly, labels, and free delivery and pickup in our service area." },
  { q: "How far in advance should I reserve?", a: "Book 1–2 weeks ahead if you can, especially for weekends and the end of the month. We have a limited number of totes, so earlier is safer." },
  { q: "When do I pay?", a: "Nothing is due when you send a request. We confirm your dates and details first. Payment is due the day before your scheduled delivery." },
  { q: "What is your cancellation policy?", a: `Cancel at least ${cancellationPolicy.freeCancellationHours} hours before your scheduled delivery and there's no charge. Inside that window it's $${cancellationPolicy.lateCancellationFee}. If the totes are already delivered, it's a $${cancellationPolicy.postDeliveryRestockingFee} fee to cover the delivery and return trip. Only one cancellation fee applies.` },
  { q: "Can I change my rental dates?", a: "Usually yes, if we can fit it in. Call, text or email as early as you can. If you need more time, contact us before your pickup date and we'll extend at the daily rate." },
  { q: "What if I need more totes than I booked?", a: "Add extra totes on your request. If you need more during your rental, contact us and we'll try to get them to you the same week." },
  { q: "What if a tote is lost or damaged?", a: `Normal wear and tear is never charged. Lost or damaged totes are $${damageFees.perTote} each, and a dolly is $${damageFees.perAccessory}. If a tote comes back needing more than a wipe-down, a $${damageFees.cleaning} cleaning fee may apply.` },
  { q: "Do the lids lock or snap shut?", a: "Yes. Each lid snaps shut and stays closed in transport." },
  { q: "Do I need tape with these totes?", a: "No. That's the whole idea." },
  { q: "How big are the totes?", a: "Each tote holds 27 gallons and measures about 28.5 in long by 19.6 in wide by 15.2 in tall on the outside. They have built-in handles and stack securely." },
  { q: "How much weight can a tote hold?", a: "Please keep each tote under about 60 lbs. Pack heavy items like books low and mix them with lighter things." },
  { q: "Do I need to be home for delivery or pickup?", a: "Not necessarily. Tell us a safe drop-off spot when you book and we'll sort out the rest by text or email." },
  { q: "What are your delivery and pickup hours?", a: "We deliver and pick up between 7 am and 8 pm. Choose your preferred dates when you request, add any timing needs in the notes, and we'll confirm the exact time by text or email." },
  { q: "Can delivery and pickup be at different addresses?", a: "Yes. Enter both addresses on your reservation request. Both need to be in our service area. Add any access notes for each spot, like a gate code, which door, or where to leave the totes." },
  { q: "Can I pack fragile items in the totes?", a: "Yes, but wrap them first. Totes protect against crushing, but they don't replace padding. Wrap glassware, dishes and electronics in towels or packing paper before they go in." },
  { q: "What happens if it rains on moving day?", a: "The lids are weather-resistant, so your things are protected in the rain. Wet cardboard loses its strength." },
  { q: "Do you deliver outside your free zone?", a: `Yes. Delivery and pickup are free within ${siteConfig.freeDeliveryRadiusMiles} miles of our Grand Rapids or Muskegon hub. Beyond that it's $${siteConfig.perMileFeeBeyondRadius.toFixed(2)} per mile, estimated from your zip code on the request. The zip checker in the service area section shows what applies to you.` },
  { q: "Can I rent totes for a wedding or event?", a: `Yes. Our Event Package is ${eventPackage.totes} totes, a dolly and labels for ${eventPackage.days} days for $${eventPackage.price}, with free delivery and pickup within ${siteConfig.freeDeliveryRadiusMiles} miles of Grand Rapids or Muskegon. See toterunnergr.com/events for details.` },
  { q: "Do you pack or move my belongings?", a: "No. We rent totes, we're not a moving company. We drop off clean totes, you pack, and we pick them up once you're unpacked." },
];
