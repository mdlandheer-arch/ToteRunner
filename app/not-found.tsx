import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main>
      <Header />
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="text-sm font-semibold text-crate">404</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">We couldn&apos;t find that page</h1>
        <p className="mt-4 text-ink/70">
          The page you&apos;re looking for may have moved. Try the homepage, or reserve your totes below.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <a href="/" className="rounded-md bg-crate px-6 py-3 font-semibold text-paper hover:bg-crate-dark">
            Go home
          </a>
          <a href="/#booking" className="rounded-md border border-ink/20 px-6 py-3 font-semibold text-ink hover:bg-ink/5">
            Reserve totes
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
