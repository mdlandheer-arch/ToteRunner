import { faqs } from "@/lib/faqs";
import { FAQSchema } from "@/components/StructuredData";

export default function FAQ() {
  return (
    <div className="space-y-3">
      <FAQSchema faqs={faqs} />
      {faqs.map((f) => (
        <details key={f.q} className="card-edge group rounded-lg border border-line bg-white px-4 py-2">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-medium text-ink">
            {f.q}
            <span aria-hidden="true" className="ml-4 text-crate group-open:hidden">+</span>
            <span aria-hidden="true" className="ml-4 hidden text-crate group-open:inline">&minus;</span>
          </summary>
          <p className="mt-3 text-sm text-ink/70">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
