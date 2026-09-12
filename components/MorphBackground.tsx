"use client";

import { motion, useScroll, useTransform } from "framer-motion";

// One color per major section, in page order. Subtle washes of the brand
// palette — paper stays the anchor, crate/safety tints breathe in and out.
const stops = [
  "#f7f4ed", // paper — hero
  "#e4efe8", // crate tint — pricing
  "#fdf0d9", // warm sand — how it works
  "#f7e9e2", // clay tint — why us
  "#dcebe0", // deeper green — eco impact (the section that should feel greenest)
  "#e8eef2", // cool sky tint — about + service area
  "#fdf0d9", // warm sand — booking (the form should feel like the destination)
  "#f7f4ed", // paper — faq
];

export default function MorphBackground() {
  const { scrollYProgress } = useScroll();
  const background = useTransform(
    scrollYProgress,
    stops.map((_, i) => i / (stops.length - 1)),
    stops
  );

  return <motion.div aria-hidden="true" className="fixed inset-0 -z-10" style={{ backgroundColor: background }} />;
}
