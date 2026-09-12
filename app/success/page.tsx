import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";
import { getStripeClient } from "@/lib/stripe";

export const metadata = { title: "Reservation confirmed" };

// Verify the session server-side rather than assuming the redirect means
// payment succeeded. The webhook is still the source of truth for
// notifications — this is just so the page doesn't claim success wrongly.
async function getSessionStatus(sessionId: string | undefined) {
  if (!sessionId) return null;
  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      paid: session.payment_status === "paid",
      email: session.customer_email ?? session.customer_details?.email ?? null,
      deliveryDate: (session.metadata as Record<string, string> | null)?.deliveryDate ?? null,
    };
  } catch {
    return null;
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const status = await getSessionStatus(session_id);

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        {status?.paid === false ? (
          <>
            <h1 className="text-3xl font-bold text-ink">Payment still processing</h1>
            <p className="mt-4 text-ink/70">
              We haven&apos;t seen your payment confirm yet. If you were charged, it should land
              shortly — check your email, or contact us at {siteConfig.email} and we&apos;ll sort it
              out.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-ink">You&apos;re booked!</h1>
            <p className="mt-4 text-ink/70">
              Your totes are reserved{status?.deliveryDate ? ` for ${status.deliveryDate}` : ""}. A
              confirmation is on its way{status?.email ? ` to ${status.email}` : ""}, and we&apos;ll
              send your delivery window before the drop-off date.
            </p>
            <p className="mt-3 text-sm text-steel">
              Questions? Email {siteConfig.email} or call {siteConfig.phone}.
            </p>
          </>
        )}
        <a href="/" className="mt-8 inline-block rounded-md bg-crate px-6 py-3 font-semibold text-paper hover:bg-crate-dark">
          Back to home
        </a>
      </div>
      <Footer />
    </main>
  );
}
