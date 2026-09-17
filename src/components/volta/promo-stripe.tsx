import { cn } from "@/lib/utils"

import { VIOLATORS } from "@/lib/volta/promotions"

/**
 * The track holds the items twice and translates by half its width, looping
 * without a seam. `prefers-reduced-motion` stops it (see `volta.css`).
 */
export function PromoStripe({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-volta-stripe overflow-hidden bg-volta-volt", className)}
    >
      <div className="flex h-full items-center md:hidden">
        <div className="volta-marquee-track flex w-max animate-volta-marquee items-center">
          <Items />
          <Items ariaHidden />
        </div>
      </div>

      <ul className="volta-gutter hidden h-full w-full items-center justify-between gap-8 md:flex">
        {VIOLATORS.map((violator) => (
          <li key={violator.id} className="flex items-center gap-2">
            <Bolt />
            <span className="volta-wide text-volta-micro whitespace-nowrap text-volta-void">
              {violator.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Items({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul className="flex items-center" aria-hidden={ariaHidden || undefined}>
      {VIOLATORS.map((violator) => (
        <li key={violator.id} className="flex items-center gap-2 px-4">
          <Bolt />
          <span className="volta-wide text-volta-micro whitespace-nowrap text-volta-void">
            {violator.label}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** The brand mark at glyph scale, for the stripe's own rows. */
function Bolt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 20"
      fill="currentColor"
      aria-hidden
      className={cn("w-auto shrink-0", className ?? "h-2.5 text-volta-void")}
    >
      <path d="M7.4 0 0 11.6h4.2L3.1 20 12 7.6H7.1L7.4 0Z" />
    </svg>
  )
}
