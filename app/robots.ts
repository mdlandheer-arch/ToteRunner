import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    // Everything public is crawlable. /api/ holds the booking and promo
    // endpoints — not pages, nothing worth indexing. There are no admin or
    // other private routes in this app today; add them here if that changes.
    // Don't block /_next/ — Google needs the CSS/JS to render pages.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${siteConfig.domain}/sitemap.xml`,
  };
}
