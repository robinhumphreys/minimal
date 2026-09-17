import { cn } from "cn"

/**
 * Set as text rather than drawn, so it inherits the brand grotesque and
 * stays crisp at any size.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex items-baseline gap-[0.5em] font-noord text-sm leading-none tracking-[0.26em] text-noord-ink uppercase",
        className,
      )}
    >
      <span className="font-semibold">Noord</span>
      {/* The trailing letter-space would visually off-centre the mark. */}
      <span className="-mr-[0.26em] font-normal text-noord-ink-muted">
        Suits
      </span>
    </span>
  )
}
