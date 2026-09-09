import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-ink">
          {siteConfig.name}
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-ink/80 md:flex">
          <a href="/#how-it-works" className="hover:text-crate">How it works</a>
          <a href="/#pricing" className="hover:text-crate">Pricing</a>
          <a href="/#faq" className="hover:text-crate">FAQ</a>
          <Link href="/moving-tips" className="hover:text-crate">Moving tips</Link>
          <Link href="/realtor-referral" className="hover:text-crate">Realtors</Link>
        </nav>
        <a
          href="/#booking"
          className="rounded-md bg-crate px-4 py-2 text-sm font-semibold text-paper hover:bg-crate-dark"
        >
          Reserve now
        </a>
      </div>
    </header>
  );
}
