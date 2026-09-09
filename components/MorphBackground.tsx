"use client";

import { motion, useScroll, useTransform } from "framer-motion";

// One color per major section, in page order. Subtle washes of the brand
// palette — paper stays the anchor, crate/safety tints breathe in and out.
const stops = [
  "#f6f5f1", // paper — hero
  "#eaf1ec", // crate tint — pricing
  "#f6f5f1", // paper — how it works
  "#fdf3dd", // safety tint — why us
  "#f6f5f1", // paper — service area
  "#eaf1ec", // crate tint — faq
  "#fdf3dd", // safety tint — booking
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
