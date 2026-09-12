"use client";

import { usePathname, useRouter } from "next/navigation";

// Scrolls to the booking form and puts the cursor in the first field, so the
// person can start typing instead of having to click again. On pages other
// than the homepage, navigates home first and lets the browser handle the
// anchor.

export default function ReserveButton({ className, label = "Reserve now" }: { className?: string; label?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    if (pathname !== "/") {
      // Let the normal navigation happen — the #booking hash carries over.
      return;
    }
    e.preventDefault();
    const section = document.getElementById("booking");
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth", block: "start" });

    // Focus after the smooth scroll settles. preventScroll stops the browser
    // from yanking the viewport again mid-animation.
    window.setTimeout(() => {
      document.getElementById("name")?.focus({ preventScroll: true });
    }, 600);
  }

  return (
    <a href="/#booking" onClick={handleClick} className={className}>
      {label}
    </a>
  );
}
