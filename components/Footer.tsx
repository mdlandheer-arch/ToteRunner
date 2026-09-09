import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold">{siteConfig.name}</p>
          <p className="mt-2 text-sm text-paper/70">
            No boxes. No tape. No cardboard in the landfill. Heavy-duty totes, delivered.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-paper/60">Quick links</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="/#how-it-works" className="hover:underline">How it works</a></li>
            <li><a href="/#pricing" className="hover:underline">Pricing</a></li>
            <li><a href="/#faq" className="hover:underline">FAQ</a></li>
            <li><Link href="/moving-tips" className="hover:underline">Moving tips</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy policy</Link></li>
            <li><Link href="/terms" className="hover:underline">Terms & conditions</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-paper/60">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href={`mailto:${siteConfig.email}`} className="hover:underline">{siteConfig.email}</a></li>
            <li><a href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`} className="hover:underline">{siteConfig.phone}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10 px-5 py-4 text-center text-xs text-paper/50">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
