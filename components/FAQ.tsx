import { faqs } from "@/lib/faqs";
import { FAQSchema } from "@/components/StructuredData";

export default function FAQ() {
  return (
    <div className="divide-y divide-line border-y border-line">
      <FAQSchema faqs={faqs} />
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
  );
}
