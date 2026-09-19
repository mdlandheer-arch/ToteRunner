import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

// Next.js merges metadata from layout.tsx and page.tsx SHALLOWLY: any field a
// page does not define is inherited from the root layout as-is. That bit us —
// the root layout set one canonical URL and every page inherited it, so each
// page was telling Google "the homepage is the real version of me."
//
// This helper builds per-page metadata so canonical and og:url always point at
// the page itself. Every page should use it instead of hand-writing metadata.
//
// Google's canonicalization guidance:
// https://developers.google.com/search/docs/crawling-indexing/canonicalization

/** Absolute URL for a route path. Pass "" for the homepage, "/faq" otherwise. */
export function absoluteUrl(path: string): string {
  return `${siteConfig.domain}${path}`;
}

type PageMetaArgs = {
  /** Route path, e.g. "/faq". Use "" for the homepage. */
  path: string;
  /** Page title. Root layout appends "| ToteRunner" via its title template. */
  title: string;
  /** Meta description — unique per page, roughly 110-160 characters. */
  description: string;
};

export function pageMetadata({ path, title, description }: PageMetaArgs): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    // Explicit absolute URL, so nothing depends on how relative canonical
    // paths get resolved against metadataBase.
    alternates: { canonical: url },
    // openGraph is also shallow-merged, so a page that sets only title and
    // description would otherwise inherit the homepage's og:url and og:title.
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        { url: "/og-image.png", width: 1200, height: 630, alt: `${siteConfig.name} moving totes` },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}
