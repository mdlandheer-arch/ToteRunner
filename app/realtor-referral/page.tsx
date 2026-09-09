import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Realtor Referral Program",
  description: `Refer your clients to ${siteConfig.name} and earn a referral bonus for every booking.`,
};

export default function RealtorReferralPage() {
  return (
    <main>
      <Header />
      <div className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-3xl font-bold text-ink">Realtor Referral Program</h1>
        <p className="mt-4 text-lg text-ink/70">
          Your clients are moving anyway — send them our way and earn a little extra for the referral.
        </p>

        <div className="mt-4 rounded-md border border-safety bg-safety/10 p-4 text-sm text-ink/80">
          <strong>Placeholder terms:</strong> the commission amount and payout process below are
          starting numbers — decide your real structure (flat fee vs. percentage, payout timing,
          minimum booking size) before promoting this to agents.
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <div className="border-l-2 border-crate pl-4">
            <div className="text-sm font-semibold text-crate">1</div>
            <h3 className="mt-1 text-lg font-bold text-ink">Refer a client</h3>
            <p className="mt-2 text-sm text-ink/70">
              Send us your client&apos;s name and move date, or just have them mention your name when
              they book.
            </p>
          </div>
          <div className="border-l-2 border-crate pl-4">
            <div className="text-sm font-semibold text-crate">2</div>
            <h3 className="mt-1 text-lg font-bold text-ink">They book totes</h3>
            <p className="mt-2 text-sm text-ink/70">
              Once their reservation is paid, the referral is confirmed automatically.
            </p>
          </div>
          <div className="border-l-2 border-crate pl-4">
            <div className="text-sm font-semibold text-crate">3</div>
            <h3 className="mt-1 text-lg font-bold text-ink">You get paid</h3>
            <p className="mt-2 text-sm text-ink/70">
              We send a ${siteConfig.realtorReferral.commissionPerReferral} referral bonus per
              completed booking. [Decide payout method: check, Venmo, etc.]
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-line bg-white/60 p-6 text-center">
          <h2 className="text-xl font-bold text-ink">Want to partner with us?</h2>
          <p className="mt-2 text-sm text-ink/70">
            Email us and we&apos;ll set you up with a referral code to track your clients.
          </p>
          <a
            href={`mailto:${siteConfig.email}?subject=Realtor Referral Program`}
            className="mt-5 inline-block rounded-md bg-crate px-6 py-3 font-semibold text-paper hover:bg-crate-dark"
          >
            Email us to get started
          </a>
          <p className="mt-3 text-sm text-ink/60">
            Or call <a href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`} className="text-crate hover:underline">{siteConfig.phone}</a>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
