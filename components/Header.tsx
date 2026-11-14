import Link from "next/link";
import Logo from "@/components/Logo";
import ReserveButton from "@/components/ReserveButton";
import { siteConfig } from "@/lib/site-config";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="flex min-h-11 shrink-0 items-center" aria-label="ToteRunner home">
          <Logo />
        </Link>

        <nav className="hidden gap-5 text-sm font-medium text-ink/80 md:flex">
          <a href="/#how-it-works" className="inline-flex min-h-11 items-center hover:text-crate">How it works</a>
          <a href="/#pricing" className="inline-flex min-h-11 items-center hover:text-crate">Pricing</a>
          <a href="/#eco" className="inline-flex min-h-11 items-center hover:text-crate">Eco impact</a>
          <a href="/#about" className="inline-flex min-h-11 items-center hover:text-crate">About</a>
          <Link href="/faq" className="inline-flex min-h-11 items-center hover:text-crate">FAQ</Link>
          <Link href="/realtor-referral" className="inline-flex min-h-11 items-center hover:text-crate">Realtors</Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={`tel:+1${siteConfig.phone.replace(/\D/g, "")}`}
            aria-label={`Call ${siteConfig.name} at ${siteConfig.phone}`}
            className="inline-flex min-h-11 items-center rounded-md border border-crate px-4 py-2 text-sm font-semibold text-crate hover:bg-crate hover:text-paper md:hidden"
          >
            Call
          </a>
          <ReserveButton className="inline-flex min-h-11 shrink-0 items-center rounded-md bg-crate px-4 py-2 text-sm font-semibold text-paper hover:bg-crate-dark" />
        </div>
      </div>
    </header>
  );
}
