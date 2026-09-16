import { cn } from "cn"

import { VIOLATORS } from "@/lib/volta/promotions"

/**
 * The violator stripe above the header.
 *
 * On a phone the list is too long to sit still, so it scrolls: the track holds
 * the items twice and translates by exactly half its width, which loops without
 * a seam. From `md` up there is room to lay all of them out and the animation
 * is dropped — a stationary band is easier to read when reading is possible.
 *
 * `prefers-reduced-motion` stops the track (see `volta.css`); the duplicate
 * copy stays hidden from assistive tech either way.
 */
export function PromoStripe({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "volta-hatch h-volta-stripe overflow-hidden border-b border-volta-volt-deep bg-volta-carbon",
        className,
      )}
    >
      {/* Phone: one moving track. */}
      <div className="flex h-full items-center md:hidden">
        <div className="volta-marquee-track flex w-max animate-volta-marquee items-center">
          <Items />
          <Items ariaHidden />
        </div>
      </div>

      {/* Tablet and up: everything visible, evenly spread, still. */}
      <ul className="volta-gutter hidden h-full items-center justify-center gap-8 md:flex lg:gap-12">
        {VIOLATORS.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <Bolt />
            <span className="volta-wide whitespace-nowrap text-volta-micro text-volta-chalk">
              {item}
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
      {VIOLATORS.map((item) => (
        <li key={item} className="flex items-center gap-2 px-4">
          <Bolt />
          <span className="volta-wide whitespace-nowrap text-volta-micro text-volta-chalk">
            {item}
          </span>
        </li>
      ))}
    </ul>
  )
}

function Bolt() {
  return (
    <svg
      viewBox="0 0 12 20"
      fill="currentColor"
      aria-hidden
      className="h-2.5 w-auto shrink-0 text-volta-volt"
    >
      <path d="M7.4 0 0 11.6h4.2L3.1 20 12 7.6H7.1L7.4 0Z" />
    </svg>
  )
}
