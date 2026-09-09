import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Moving Tips",
  description: `Practical moving tips from ${siteConfig.name}.`,
};

const tips = [
  {
    title: "Pack heavy items in small totes, light items in large ones",
    body: "Books and dishes get heavy fast — split them across more totes rather than one overloaded box.",
  },
  {
    title: "Label totes by room, not by contents",
    body: "\"Kitchen\" is more useful on moving day than a detailed inventory nobody has time to read.",
  },
  {
    title: "Pack an essentials tote last",
    body: "Toiletries, chargers, and a change of clothes in one tote that travels with you, not the truck.",
  },
];

export default function MovingTipsPage() {
  return (
    <main>
      <Header />
      <div className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-3xl font-bold text-ink">Moving tips</h1>
        <p className="mt-2 text-ink/70">A few things that make packing day easier.</p>

        <div className="mt-8 space-y-8">
          {tips.map((t) => (
            <div key={t.title}>
              <h2 className="text-lg font-bold text-ink">{t.title}</h2>
              <p className="mt-1 text-sm text-ink/70">{t.body}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
