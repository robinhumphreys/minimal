import { cn } from "cn"

/**
 * Minimal AI's mark: two concentric rings, drawn in `currentColor` so it takes
 * the colour of whatever it sits next to. Ring weights are lifted from the
 * source PNG — the outer ring is roughly twice the stroke of the inner one, and
 * the gap between them is what makes it read as a ring rather than a donut.
 */
export function MinimalLogo({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className={cn("size-5 shrink-0", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="10.9" strokeWidth="2.2" />
      <circle cx="12" cy="12" r="7.1" strokeWidth="1.3" />
    </svg>
  )
}
