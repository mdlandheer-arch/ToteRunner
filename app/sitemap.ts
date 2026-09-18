import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Priority tells Google which pages matter most relative to each other on this
// site. It is a hint, not a command — but it costs nothing and helps the
// homepage and money pages get crawled ahead of the legal boilerplate.
const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/faq", priority: 0.8, changeFrequency: "monthly" },
  { path: "/realtor-referral", priority: 0.8, changeFrequency: "monthly" },
  { path: "/rental-agreement", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${siteConfig.domain}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
