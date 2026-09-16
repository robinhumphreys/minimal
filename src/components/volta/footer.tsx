import Link from "next/link"

import { FOOTER_COLUMNS, LEGAL_LINKS } from "@/lib/volta/footer-links"
import { VIOLATORS } from "@/lib/volta/promotions"

import { Bolt } from "./promo-stripe"
import { Wordmark } from "./wordmark"

/**
 * The footer, in two bands: the violator row, then the links.
 *
 * The numbered promises that used to sit between them said the same three
 * things the violator row says, one line further down the page — the shopper
 * had already read them in the stripe above the header and again in the row
 * below it.
 *
 * On a phone the link columns stack; they are short enough that collapsing
 * them into accordions would hide six items behind a tap each.
 */
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

/**
 * The violator stripe again, played slow: the same four promises in the same
 * order, on the same volt ground, sized to be read rather than glanced at.
 *
 * Set at title rather than heading scale. At heading scale the four longest
 * promises in the catalogue had to wrap two and three lines inside a quarter of
 * the page, which left every cell a different depth and broke "Batch-tested"
 * across a hyphen — a wall of volt with a ragged edge. One line each, the bolt
 * on the same baseline as the text, is the same claim without the shouting.
 *
 * The hairline grid is the void showing through a `gap-px` on the `<ul>`, which
 * gives real rules at every breakpoint without per-cell border arithmetic — the
 * gutter lives on the wrapper so the void never leaks into the page margin.
 */
function ViolatorRow() {
  return (
    <section aria-label="Why Volta">
      <div className="volta-gutter mx-auto max-w-7xl py-10">
        <ul className="grid gap-px bg-volta-void sm:grid-cols-2 lg:grid-cols-4">
          {VIOLATORS.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 bg-volta-volt px-5 py-5"
            >
              <Bolt className="h-4 shrink-0 text-volta-void" />
              <span className="volta-title text-volta-title text-volta-void">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
