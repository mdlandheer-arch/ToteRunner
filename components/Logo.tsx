import Image from "next/image";

// ToteRunner logo — always the official files in public/brand/ (from the brand
// logos/ set). Never retype the wordmark or redraw the mark here.
//   light: toterunner-lockup.svg      — "Tote" ink + "Runner" green, for paper/light backgrounds
//   dark:  toterunner-lockup-dark.svg — "Tote" white + "Runner" yellow, for ink/dark backgrounds
// Minimum width is 120px (brand guide §4); h-8 renders about 139px wide.

const LOCKUP_W = 1516;
const LOCKUP_H = 348;

export default function Logo({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const src = variant === "dark" ? "/brand/toterunner-lockup-dark.svg" : "/brand/toterunner-lockup.svg";
  return (
    <Image
      src={src}
      alt="ToteRunner"
      width={LOCKUP_W}
      height={LOCKUP_H}
      unoptimized
      priority={variant === "light"}
      className={className ?? "h-8 w-auto"}
    />
  );
}
