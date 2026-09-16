import Link from "next/link"

import { FOOTER_COLUMNS, LEGAL_LINKS } from "@/lib/volta/footer-links"
import { PROMISES, VIOLATORS } from "@/lib/volta/promotions"

import { Bolt } from "./promo-stripe"
import { Wordmark } from "./wordmark"

/**
 * The footer, in three bands: the violator grid, the promises, then the links.
 *
 * On a phone the link columns stack; they are short enough that collapsing
 * them into accordions would hide six items behind a tap each.
 */
export function Footer() {
  return (
    <footer className="border-t border-volta-line bg-volta-carbon">
      <ViolatorGrid />

      <div className="volta-gutter mx-auto max-w-7xl">
        <ul className="grid gap-6 border-t border-volta-line py-10 sm:grid-cols-3">
          {PROMISES.map((promise, index) => (
            <li key={promise.title} className="flex gap-4">
              <span className="volta-display shrink-0 text-2xl leading-none text-volta-volt tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="volta-wide text-volta-label text-volta-chalk">
                  {promise.title}
                </h3>
                <p className="text-volta-body text-volta-ash">{promise.body}</p>
              </div>
            </li>
          ))}
        </ul>

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
                  className="text-volta-micro tracking-volta-wide text-volta-smoke uppercase transition-colors hover:text-volta-ash"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-volta-micro tracking-volta-wide text-volta-smoke uppercase">
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
 * One column per violator from `lg` up, so the band at the bottom of the page
 * and the stripe at the top carry the same content in the same sequence. Four
 * divides evenly into one, two and four, so the grid squares off on its own and
 * needs no filler cell to close the last row.
 *
 * The hairline grid is the void showing through a `gap-px` on the `<ul>`, which
 * gives real rules at every breakpoint without per-cell border arithmetic — the
 * gutter lives on the wrapper so the void never leaks into the page margin.
 */
function ViolatorGrid() {
  return (
    <section aria-label="Why Volta">
      <div className="volta-gutter mx-auto max-w-7xl py-12">
        <ul className="grid gap-px bg-volta-void sm:grid-cols-2 lg:grid-cols-4">
          {VIOLATORS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 bg-volta-volt px-6 py-10 lg:flex-col lg:gap-4"
            >
              <Bolt className="mt-1 h-6 shrink-0 text-volta-void lg:mt-0 lg:h-8" />
              <span className="volta-display text-volta-heading leading-none text-balance text-volta-void">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
