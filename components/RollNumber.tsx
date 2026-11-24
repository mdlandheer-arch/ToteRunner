"use client";

import { useState } from "react";

// A number that rolls up when it goes up and down when it goes down (0.2s).
// The roll is CSS only and is skipped for reduced motion.
export default function RollNumber({ value }: { value: number }) {
  const [state, setState] = useState<{ value: number; dir: "up" | "down" | "" }>({ value, dir: "" });
  if (value !== state.value) {
    setState({ value, dir: value > state.value ? "up" : "down" });
  }
  return (
    <span className="relative inline-block h-6 w-8 overflow-hidden text-center align-middle leading-6" aria-live="polite">
      <span key={value} className={`absolute inset-0 ${state.dir ? `roll-${state.dir}` : ""}`}>
        {value}
      </span>
    </span>
  );
}
