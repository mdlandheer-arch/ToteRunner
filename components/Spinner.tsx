// Small inline spinner for buttons that are waiting on the network. Decorative:
// the button's own label ("Sending…", "Checking…") carries the meaning, so this
// is hidden from screen readers.
export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  );
}
