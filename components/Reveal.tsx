"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Reveal({ children }: { children: React.ReactNode }) {
  // Visitors who ask their device for reduced motion get the content with no
  // slide or blur — framer-motion doesn't read the CSS reduced-motion rule.
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 32, filter: "blur(6px)" }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      // "some": any part visible triggers it. A fixed fraction can never be met by
      // sections taller than the phone screen (they stayed blank).
      viewport={{ once: true, amount: "some" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
