"use client";

import { useEffect, useRef, useState } from "react";

// Google Places Autocomplete for the street-address field.
//
// REQUIRES AN API KEY. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment
// (Vercel > Settings > Environment Variables). Get one at:
//   https://console.cloud.google.com/google/maps-apis
// Enable the "Places API" for the project, and restrict the key to your domain
// under Credentials > API restrictions — this key is exposed to the browser by
// design, so a domain restriction is what stops other sites from using it.
//
// Google Maps Platform bills per request beyond a monthly free allotment, so
// check current pricing before launch. If no key is set, this component falls
// back to a plain text input and the rest of the form still works normally.

export type ParsedAddress = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

type Props = {
  value: string;
  onChange: (street: string) => void;
  onAddressSelected: (addr: ParsedAddress) => void;
  className?: string;
  id?: string;
};

declare global {
  interface Window {
    google?: any;
    __toterunnerMapsLoading?: Promise<void>;
  }
}

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps?.places) return Promise.resolve();
  if (window.__toterunnerMapsLoading) return window.__toterunnerMapsLoading;

  window.__toterunnerMapsLoading = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });

  return window.__toterunnerMapsLoading;
}

export default function AddressAutocomplete({ value, onChange, onAddressSelected, className, id }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [ready, setReady] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) return; // no key configured — stay a plain input

    let cancelled = false;
    loadGoogleMaps(apiKey)
      .then(() => {
        if (cancelled || !inputRef.current || !window.google?.maps?.places) return;

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ["address"],
          componentRestrictions: { country: "us" },
          fields: ["address_components", "formatted_address"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place?.address_components) return;

          const get = (type: string, short = false) => {
            const c = place.address_components.find((comp: any) => comp.types.includes(type));
            return c ? (short ? c.short_name : c.long_name) : "";
          };

          const streetNumber = get("street_number");
          const route = get("route");
          const parsed: ParsedAddress = {
            street: [streetNumber, route].filter(Boolean).join(" "),
            city: get("locality") || get("sublocality") || get("postal_town"),
            state: get("administrative_area_level_1", true),
            zip: get("postal_code"),
          };

          onAddressSelected(parsed);
        });

        setReady(true);
      })
      .catch(() => {
        // Loading failed — the plain input still works, so don't block the form.
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  return (
    <>
      <input
        id={id}
        ref={inputRef}
        className={className}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={ready ? "Start typing your address…" : undefined}
        autoComplete={ready ? "off" : "address-line1"}
      />
      {ready && (
        <p className="mt-1 text-xs text-steel">Start typing and pick your address to fill the rest automatically.</p>
      )}
    </>
  );
}
