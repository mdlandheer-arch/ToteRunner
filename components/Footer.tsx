import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82a4.6 4.6 0 0 1-3.77-4.4h-3.2v14.2a2.6 2.6 0 1 1-2.6-2.6c.24 0 .48.03.7.08V9.9a5.8 5.8 0 1 0 5.1 5.76V9.4a7.78 7.78 0 0 0 3.77 1v-3.2c-.01 0-.01-1.38 0-1.38Z" />
    </svg>
  );
}

export default function Footer() {
  const { facebook, instagram, tiktok } = siteConfig.social;

  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold">{siteConfig.name}</p>
          <p className="mt-2 text-sm text-paper/70">
            No boxes. No tape. No cardboard in the landfill. Heavy-duty totes, delivered.
          </p>
          <div className="mt-4 flex gap-3">
            <a href={facebook} aria-label="Facebook" className="text-paper/70 hover:text-paper">
              <FacebookIcon />
            </a>
            <a href={instagram} aria-label="Instagram" className="text-paper/70 hover:text-paper">
              <InstagramIcon />
            </a>
            <a href={tiktok} aria-label="TikTok" className="text-paper/70 hover:text-paper">
              <TikTokIcon />
            </a>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-paper/60">Quick links</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="/#how-it-works" className="hover:underline">How it works</a></li>
            <li><a href="/#pricing" className="hover:underline">Pricing</a></li>
            <li><a href="/#faq" className="hover:underline">FAQ</a></li>
            <li><Link href="/moving-tips" className="hover:underline">Moving tips</Link></li>
            <li><Link href="/realtor-referral" className="hover:underline">Realtor referral program</Link></li>
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
