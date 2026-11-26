"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { hubs } from "@/lib/site-config";

// Next's bundler leaves MapLibre's worker URL empty, so point it at a copy in
// /public. Re-copy node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs after upgrading maplibre-gl.
maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");

export type MapPoint = { label: string; lat: number; lon: number };

const M_PER_MILE = 1609.344;

function circle(lat: number, lon: number, miles: number) {
  const pts: [number, number][] = [];
  const r = miles * M_PER_MILE;
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * 2 * Math.PI;
    const dLat = (r * Math.cos(a)) / 111320;
    const dLon = (r * Math.sin(a)) / (111320 * Math.cos((lat * Math.PI) / 180));
    pts.push([lon + dLon, lat + dLat]);
  }
  return pts;
}

function pin(n: string, fill: string, text: string) {
  const el = document.createElement("div");
  el.textContent = n;
  el.style.cssText = `width:1.5rem;height:1.5rem;border-radius:9999px;background:${fill};color:${text};border:2px solid #14211C;font:600 0.75rem/1 system-ui,sans-serif;display:flex;align-items:center;justify-content:center`;
  return el;
}

// Pins sit at the center of each zip code, not the street address, so no street
// address ever leaves the page. Free-area circles come from hubs in site-config.
export default function DeliveryMap({ points }: { points: MapPoint[] }) {
  const box = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const loaded = useRef(false);
  const pending = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!box.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: box.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            maxzoom: 19,
            attribution: "Map data © OpenStreetMap contributors",
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: [hubs[0].lon, hubs[0].lat],
      zoom: 9,
      attributionControl: { compact: true },
      cooperativeGestures: true,
    });
    map.on("load", () => {
      map.addSource("free", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: hubs.map((h) => ({
            type: "Feature",
            properties: {},
            geometry: { type: "Polygon", coordinates: [circle(h.lat, h.lon, h.freeRadiusMiles)] },
          })),
        },
      });
      map.addLayer({ id: "free-fill", type: "fill", source: "free", paint: { "fill-color": "#1F7A55", "fill-opacity": 0.14 } });
      map.addLayer({ id: "free-line", type: "line", source: "free", paint: { "line-color": "#1F7A55", "line-width": 2, "line-dasharray": [3, 2] } });
      loaded.current = true;
      pending.current?.();
    });
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      loaded.current = false;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const draw = () => {
      markers.current.forEach((m) => m.remove());
      markers.current = points.map((p, i) =>
        new maplibregl.Marker({ element: pin(String(i + 1), i === 0 ? "#F5A524" : "#1F7A55", i === 0 ? "#14211C" : "#F7F4ED") })
          .setLngLat([p.lon, p.lat])
          .addTo(map)
      );
      const b = new maplibregl.LngLatBounds();
      points.forEach((p) => b.extend([p.lon, p.lat]));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (points.length === 1) map.easeTo({ center: [points[0].lon, points[0].lat], zoom: 10, duration: reduce ? 0 : 500 });
      else map.fitBounds(b, { padding: 56, maxZoom: 11, duration: reduce ? 0 : 500 });
    };
    if (loaded.current) draw();
    else pending.current = draw;
  }, [points]);

  return (
    <div
      ref={box}
      role="img"
      aria-label="Map of your delivery and pickup zip codes. The text above gives the same details."
      className="h-56 w-full overflow-hidden rounded-md border border-line"
    />
  );
}
