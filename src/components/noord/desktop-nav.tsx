"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "cn"

import type { NavCategory } from "@/lib/noord/types"

/**
 * The desktop category bar and its drop-down panels.
 *
 * Panels open on hover and on keyboard focus. Everything inside is a real
 * link, so there is no disclosure button to label and no `aria-expanded` to
 * keep in sync — tabbing through the bar walks the panels in reading order.
 * `openIndex` only exists to let the pointer close a panel; focus handles
 * itself through `focus-within`.
 */
export function DesktopNav({ categories }: { categories: NavCategory[] }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  return (
    <nav
      aria-label="Categories"
      className="relative"
      onMouseLeave={() => setOpenIndex(null)}
    >
      <ul className="noord-gutter flex items-center justify-center gap-7 xl:gap-9">
        {categories.map((category, index) => (
          <li
            key={category.href + category.label}
            className="group/nav-item static"
            onMouseEnter={() => setOpenIndex(index)}
          >
            <Link
              href={category.href}
              // The 1px negative margin lets the underline sit on the header
              // rule rather than floating above it.
              className="-mb-px flex h-11 items-center border-b border-transparent text-noord-micro text-noord-ink uppercase transition-colors group-hover/nav-item:border-noord-ink group-focus-within/nav-item:border-noord-ink"
            >
              {category.label}
            </Link>

            {category.columns.length > 0 && (
              <NavPanel
                category={category}
                open={openIndex === index}
                onNavigate={() => setOpenIndex(null)}
              />
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

function NavPanel({
  category,
  open,
  onNavigate,
}: {
  category: NavCategory
  open: boolean
  onNavigate: () => void
}) {
  return (
    <div
      // `invisible` rather than `hidden` so the panel still takes focus from a
      // Tab press, which is what reveals it for keyboard users. The open and
      // closed states are mutually exclusive class strings — listing both
      // `opacity-0` and `opacity-100` would leave the winner to stylesheet
      // order rather than to `open`.
      className={cn(
        "absolute inset-x-0 top-full z-40 border-t border-noord-line bg-noord-paper transition-opacity duration-200",
        open ? "visible opacity-100" : "invisible opacity-0",
        "group-focus-within/nav-item:visible group-focus-within/nav-item:opacity-100",
      )}
    >
      <div className="noord-gutter mx-auto grid w-full max-w-7xl grid-cols-[repeat(3,minmax(0,1fr))_20rem] gap-10 py-10">
        {category.columns.map((column) => (
          <div key={column.title}>
            <h3 className="mb-4 text-noord-micro text-noord-ink-faint uppercase">
              {column.title}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className="noord-underline text-noord-body text-noord-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Keeps the promo in the last column when a category yields fewer
            than three facet columns. */}
        {Array.from({ length: Math.max(0, 3 - category.columns.length) }).map(
          (_, index) => (
            <div key={`spacer-${index}`} aria-hidden />
          ),
        )}

        {category.promo && (
          <Link
            href={category.promo.href}
            onClick={onNavigate}
            className="group/promo flex flex-col gap-3"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-noord-wash">
              <Image
                src={category.promo.image}
                alt=""
                fill
                sizes="20rem"
                className="object-cover transition-transform duration-500 group-hover/promo:scale-[1.03]"
              />
            </div>
            <span className="text-noord-micro text-noord-ink-faint uppercase">
              {category.promo.eyebrow}
            </span>
            <span className="noord-underline self-start text-noord-body text-noord-ink">
              {category.promo.title}
            </span>
          </Link>
        )}
      </div>
    </div>
  )
}
