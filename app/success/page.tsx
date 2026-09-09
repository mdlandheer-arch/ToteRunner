import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";

export const metadata = { title: "Reservation confirmed" };

export default function SuccessPage() {
  return (
    <main>
      <Header />
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="text-3xl font-bold text-ink">You&apos;re booked!</h1>
        <p className="mt-4 text-ink/70">
          Your payment went through and your totes are reserved. We&apos;ll email your delivery
          window shortly — check {siteConfig.email.split("@")[1]} isn&apos;t blocking us if you
          don&apos;t see it soon.
        </p>
        <a href="/" className="mt-8 inline-block rounded-md bg-crate px-6 py-3 font-semibold text-paper hover:bg-crate-dark">
          Back to home
        </a>
      </div>
      <Footer />
    </main>
  );
}
