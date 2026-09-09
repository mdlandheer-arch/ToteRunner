"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { siteConfig } from "@/lib/site-config";

const CONSENT_KEY = "cratehaul-cookie-consent";

export default function CookieConsent() {
  const [consent, setConsent] = useState<"granted" | "denied" | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (stored === "granted" || stored === "denied") {
      setConsent(stored);
    } else {
      setShowBanner(true);
    }
  }, []);

  function choose(value: "granted" | "denied") {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
    setShowBanner(false);
  }

  const gaId = siteConfig.gaMeasurementId;
  const gaConfigured = gaId && !gaId.includes("XXXX");

  return (
    <>
      {gaConfigured && consent === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {showBanner && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-ink px-5 py-4 text-paper shadow-lg"
        >
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-snug text-paper/90">
              We use cookies for basic site analytics — nothing sold, nothing tracked across other sites.
              See our{" "}
              <a href="/privacy" className="underline underline-offset-2">
                privacy policy
              </a>
              .
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => choose("denied")}
                className="rounded-md border border-paper/30 px-4 py-2 text-sm font-medium text-paper hover:bg-paper/10"
              >
                Decline
              </button>
              <button
                onClick={() => choose("granted")}
                className="rounded-md bg-safety px-4 py-2 text-sm font-semibold text-ink hover:brightness-95"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
