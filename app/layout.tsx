import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: `${siteConfig.name} | Reusable Moving Tote Rental in ${siteConfig.city}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: `${siteConfig.name} delivers reusable moving totes across ${siteConfig.region}. Skip the cardboard — we drop off, you pack, we pick up.`,
  openGraph: {
    title: `${siteConfig.name} | Reusable Moving Tote Rental`,
    description: `Reusable moving totes delivered and picked up across ${siteConfig.region}. No cardboard, no tape, no landfill.`,
    url: siteConfig.domain,
    siteName: siteConfig.name,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${siteConfig.name} moving totes` }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Reusable Moving Tote Rental`,
    description: `Reusable moving totes delivered and picked up across ${siteConfig.region}.`,
    images: ["/og-image.png"],
  },
  alternates: { canonical: siteConfig.domain },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
