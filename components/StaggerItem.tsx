"use client";

import { motion, useReducedMotion } from "framer-motion";

// One item in a row of cards/steps. Each fades up a beat after the one before it
// (index * 80ms) so a row arrives in order instead of as one block.
export default function StaggerItem({
  index,
  className,
  children,
}: {
  index: number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: "some" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: Math.min(index, 3) * 0.08 }}
    >
      {children}
    </motion.div>
  );
}
