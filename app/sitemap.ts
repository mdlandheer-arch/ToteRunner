import type { MetadataRoute } from "next";
import { siteConfig, legalLastUpdated } from "@/lib/site-config";

// Google ignores <priority> and <changefreq> entirely, so they aren't set here.
// It does use <lastmod>, but only "if it's consistently and verifiably
// accurate" — it should reflect the last SIGNIFICANT update to the page
// (main content, structured data, or links; not a copyright year bump).
//
// That rules out `new Date()`: stamping today's date on every page at every
// deploy tells Google the privacy policy changed this morning, which trains it
// to ignore the field for this site. So dates are declared by hand below.
//
// Reference: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

/**
 * Bump this when you make a real content change to the marketing pages —
 * new pricing, rewritten copy, a new section. Not for typo fixes or deploys.
 */
const contentLastUpdated = "2026-09-19";

/** The legal pages carry the same date customers see printed on them. */
const legalLastUpdatedISO = new Date(legalLastUpdated).toISOString().split("T")[0];

const routes: { path: string; lastModified: string }[] = [
  { path: "", lastModified: contentLastUpdated },
  { path: "/faq", lastModified: contentLastUpdated },
  { path: "/realtor-referral", lastModified: contentLastUpdated },
  { path: "/rental-agreement", lastModified: legalLastUpdatedISO },
  { path: "/terms", lastModified: legalLastUpdatedISO },
  { path: "/privacy", lastModified: legalLastUpdatedISO },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, lastModified }) => ({
    url: `${siteConfig.domain}${path}`,
    lastModified,
  }));
}
