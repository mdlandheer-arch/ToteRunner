import { siteConfig, packages } from "@/lib/site-config";

// Structured data (JSON-LD) tells Google exactly what this business is, where
// it operates, and what it charges — which is what feeds local pack results,
// rich snippets, and the knowledge panel. Without it, Google has to guess.
//
// Validate changes at https://search.google.com/test/rich-results
//
// TODO before launch: add your real street address under `address` below.
// Google strongly favors businesses with a verifiable address, and you should
// also claim your Google Business Profile at https://business.google.com —
// that matters more for local ranking than anything on this page.

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    description: `${siteConfig.name} rents reusable moving totes across ${siteConfig.region}. Delivered to your door, picked up when you're unpacked.`,
    url: siteConfig.domain,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    slogan: siteConfig.tagline,
    image: `${siteConfig.domain}/og-image.png`,
    logo: `${siteConfig.domain}/og-image.png`,
    // Links the site to your social profiles so Google can connect this page,
    // your Facebook Page, and your Google Business Profile as one entity.
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.tiktok,
    ].filter(Boolean),
    priceRange: `$${Math.min(...packages.map((p) => p.price))}-$${Math.max(...packages.map((p) => p.price))}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: "MI",
      postalCode: siteConfig.businessZip,
      addressCountry: "US",
    },
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
      containedInPlace: { "@type": "State", name: "Michigan" },
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Moving tote rental packages",
      itemListElement: packages.map((pkg) => ({
        "@type": "Offer",
        name: pkg.name,
        description: `${pkg.totes} reusable moving totes for ${pkg.days} days. ${pkg.blurb}`,
        price: pkg.price.toFixed(2),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Feeds the expandable FAQ results that show directly in Google search.
export function FAQSchema({ faqs }: { faqs: { q: string; a: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
