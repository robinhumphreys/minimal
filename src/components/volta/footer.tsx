import Link from "next/link"
import {
  ArrowCounterClockwiseIcon,
  LightningIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@phosphor-icons/react/ssr"

import { FOOTER_COLUMNS, LEGAL_LINKS } from "@/lib/volta/footer-links"
import { VIOLATORS, type ViolatorId } from "@/lib/volta/promotions"

import { Wordmark } from "./wordmark"

// On a phone the link columns stack rather than collapsing into accordions;
// they are short enough that an accordion would just hide items behind a tap.
export function Footer() {
  return (
    <footer className="border-t border-volta-line bg-volta-carbon">
      <ViolatorRow />

      <div className="volta-gutter mx-auto max-w-7xl">
        <div className="grid gap-10 py-12 sm:grid-cols-3">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <h3 className="volta-wide text-volta-micro text-volta-smoke">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="volta-underline text-volta-body text-volta-ash transition-colors hover:text-volta-chalk"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 border-t border-volta-line py-8 sm:flex-row sm:items-center sm:justify-between">
          <Wordmark className="text-base" />
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-volta-micro text-volta-smoke transition-colors hover:text-volta-ash"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-volta-micro text-volta-smoke">
            © {new Date().getFullYear()} Volta
          </p>
        </div>
      </div>
    </footer>
  )
}

// One icon per violator rather than the bolt four times, so a shopper
// skimming the row can tell delivery from returns before reading either.
const VIOLATOR_ICONS: Record<ViolatorId, typeof TruckIcon> = {
  delivery: TruckIcon,
  dispatch: LightningIcon,
  returns: ArrowCounterClockwiseIcon,
  testing: ShieldCheckIcon,
}

/**
 * The hairline grid is the void showing through `gap-px` on the `<ul>`,
 * giving rules at every breakpoint without per-cell border arithmetic.
 */
function ViolatorRow() {
  return (
    <section aria-label="Why Volta">
      <div className="volta-gutter mx-auto max-w-7xl py-10">
        <ul className="grid gap-px bg-volta-void sm:grid-cols-2 lg:grid-cols-4">
          {VIOLATORS.map((violator) => {
            const Icon = VIOLATOR_ICONS[violator.id]
            return (
              <li
                key={violator.id}
                className="flex items-center gap-3 bg-volta-volt p-5 text-volta-void sm:aspect-3/2 sm:flex-col sm:items-start sm:justify-between sm:gap-0 sm:p-6"
              >
                <Icon
                  aria-hidden
                  weight="bold"
                  className="size-6 shrink-0 sm:size-8"
                />
                <span className="volta-title text-volta-title text-balance">
                  {violator.label}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
