import { cn } from "cn"

/**
 * Set as text rather than drawn, so it inherits the brand grotesque and stays
 * crisp at any size. The mark is the width axis: Archivo pushed wide and heavy,
 * tracked tight, with the bolt as the only drawn element.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "volta-display flex items-center gap-[0.15em] font-volta text-base leading-none tracking-[-0.02em] text-volta-chalk",
        className,
      )}
    >
      <BoltIcon className="h-[1em] w-auto text-volta-volt" />
      Volta
    </span>
  )
}

/** The bolt. Drawn rather than an icon-font glyph so the angles stay ours. */
function BoltIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 20"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M7.4 0 0 11.6h4.2L3.1 20 12 7.6H7.1L7.4 0Z" />
    </svg>
  )
}
