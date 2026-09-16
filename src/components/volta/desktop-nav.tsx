"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"

import type { NavModel } from "@/lib/volta/types"

/**
 * The `lg`-and-up categories, sitting inline in the header bar itself rather
 * than on a second row, with panels that drop off the header's bottom edge.
 *
 * Hover-intent rather than click: the panel opens on pointer enter and closes
 * on leave, with keyboard focus doing the same thing so the panel is reachable
 * without a mouse. Hidden entirely below `lg`, where the nav overlay takes over
 * — the phone menu is never shown on a desktop layout.
 *
 * The panels are `absolute` against the sticky `<header>`, which is the nearest
 * positioned ancestor; nothing between here and there may be positioned.
 */
export function DesktopNav({ nav }: { nav: NavModel }) {
  const [open, setOpen] = React.useState<string | null>(null)

  return (
    <nav
      aria-label="Categories"
      className="hidden min-w-0 self-stretch lg:block"
      onMouseLeave={() => setOpen(null)}
    >
      <ul className="ml-6 flex h-full items-center gap-6 xl:ml-10 xl:gap-8">
        {nav.categories.map((category) => (
          <li
            key={category.href}
            onMouseEnter={() => setOpen(category.href)}
            onFocus={() => setOpen(category.href)}
          >
            <Link
              href={category.href}
              // `-mb-px` drops the underline onto the header rule rather than
              // leaving it floating a pixel above it.
              className="volta-wide -mb-px flex h-full items-center border-b-2 border-transparent whitespace-nowrap text-volta-label text-volta-chalk transition-colors hover:border-volta-volt hover:text-volta-volt aria-expanded:border-volta-volt"
              aria-expanded={open === category.href}
            >
              {category.label}
            </Link>
          </li>
        ))}
      </ul>

      {nav.categories.map((category) =>
        open === category.href && category.columns.length > 0 ? (
          <div
            key={category.href}
            className="absolute inset-x-0 top-full border-y border-volta-line bg-volta-carbon"
          >
            <div className="volta-gutter mx-auto flex max-w-7xl gap-12 py-10">
              {category.columns.map((column) => (
                <div key={column.title} className="flex flex-col gap-4">
                  <h3 className="volta-wide text-volta-micro text-volta-smoke">
                    {column.title}
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {column.links.map((link) => (
                      <li key={link.href}>
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

              <div className="ml-auto flex gap-6">
                <div className="flex flex-col gap-4">
                  <h3 className="volta-wide text-volta-micro text-volta-smoke">
                    Shop by goal
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {nav.goals.map((goal) => (
                      <li key={goal.href}>
                        <Link
                          href={goal.href}
                          className="volta-underline text-volta-body text-volta-ash transition-colors hover:text-volta-chalk"
                        >
                          {goal.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {category.promo && (
                  <Link
                    href={category.promo.href}
                    className="group/promo relative block h-56 w-44 shrink-0 overflow-hidden rounded-volta"
                  >
                    <Image
                      src={category.promo.image}
                      alt=""
                      fill
                      sizes="176px"
                      className="object-cover transition-transform duration-500 group-hover/promo:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-volta-void via-volta-void/20 to-transparent" />
                    <div className="absolute inset-x-3 bottom-3 flex flex-col gap-1">
                      <span className="volta-wide text-volta-micro text-volta-volt">
                        {category.promo.eyebrow}
                      </span>
                      <span className="volta-display text-volta-title leading-none text-volta-chalk">
                        {category.promo.title}
                      </span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : null,
      )}
    </nav>
  )
}
