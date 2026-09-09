import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = { title: "Checkout canceled" };

export default function CancelPage() {
  return (
    <main>
      <Header />
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="text-3xl font-bold text-ink">No charge made</h1>
        <p className="mt-4 text-ink/70">
          Checkout was canceled and you were not charged. You can pick up where you left off any time.
        </p>
        <a href="/#booking" className="mt-8 inline-block rounded-md bg-crate px-6 py-3 font-semibold text-paper hover:bg-crate-dark">
          Back to booking
        </a>
      </div>
      <Footer />
    </main>
  );
}
