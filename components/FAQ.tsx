const faqs = [
  { q: "Do I have to clean the totes?", a: "No — every tote is sanitized between rentals before it reaches you." },
  { q: "How far in advance should I reserve?", a: "We recommend booking 1–2 weeks ahead, especially during weekends and month-end, when demand is highest." },
  { q: "What if I need more totes than I booked?", a: "Add extra totes at checkout, or contact us during your rental — we'll do our best to accommodate a same-week add-on." },
  { q: "What if I need the totes longer than the rental period?", a: "Extra days are available as an add-on at checkout." },
  { q: "What if a tote is lost or damaged?", a: "A reasonable replacement fee applies for lost or badly damaged totes — details are in our terms & conditions." },
  { q: "How many totes will I need?", a: "As a rough guide: studio/1BR ≈ 10 totes, 2–3BR ≈ 18 totes, larger homes 28+ totes. When in doubt, size up slightly." },
  { q: "Do the lids lock or snap shut?", a: "Yes — each lid snaps securely and stays closed during transport." },
  { q: "Do I need tape with these totes?", a: "No tape needed — that's the point." },
  { q: "Where do you deliver?", a: "See our service area above. If you're nearby but not listed, email us and we'll check." },
  { q: "Do I need to be home for delivery or pickup?", a: "Not necessarily — let us know a safe drop-off spot when you book, and we'll coordinate the rest by text or email." },
  { q: "What happens if it rains on moving day?", a: "Our totes have secure, weather-resistant lids, so your things stay dry and protected." },
  { q: "How much weight can a tote hold?", a: "Up to roughly 60 lbs per tote, comfortably." },
];

export default function FAQ() {
  return (
    <section id="faq">
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
