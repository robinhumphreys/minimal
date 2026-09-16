"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRightIcon, SearchIcon, XIcon } from "lucide-react"

import { formatPrice } from "@/lib/volta/format"
import { useOverlays } from "@/lib/volta/overlays"
import type { NavCategory, SearchEntry } from "@/lib/volta/types"

import { Input } from "@/components/volta/ui/input"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/volta/ui/sheet"

import { RatingRow } from "./rating"

const POPULAR = [
  "Whey isolate",
  "Pre-workout",
  "Electrolytes",
  "Creatine",
  "Protein bar",
  "Vitamin D3",
]

const MAX_RESULTS = 8

/**
 * Full-screen search. Matching runs over a pre-lowercased haystack built on the
 * server, so a 50-product catalog filters synchronously on every keystroke
 * without a debounce.
 */
export function SearchOverlay({
  index,
  categories,
}: {
  index: SearchEntry[]
  categories: NavCategory[]
}) {
  const open = useOverlays((state) => state.open) === "search"
  const toggle = useOverlays((state) => state.toggle)
  const close = useOverlays((state) => state.close)

  const [query, setQuery] = React.useState("")
  const trimmed = query.trim().toLowerCase()

  const results = React.useMemo(() => {
    if (trimmed.length < 2) return []
    const terms = trimmed.split(/\s+/)
    return index
      .filter((entry) => terms.every((term) => entry.haystack.includes(term)))
      .slice(0, MAX_RESULTS)
  }, [index, trimmed])

  const categoryHits = React.useMemo(() => {
    if (trimmed.length < 2) return []
    return categories.filter((category) =>
      category.label.toLowerCase().includes(trimmed),
    )
  }, [categories, trimmed])

  const searching = trimmed.length >= 2

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        // Each opening starts from a clean slate rather than the last search.
        if (!next) setQuery("")
        toggle("search", next)
      }}
    >
      <SheetContent side="full" showCloseButton={false}>
        <SheetHeader className="justify-between">
          <SheetTitle className="text-volta-smoke">Search</SheetTitle>
          <button
            type="button"
            onClick={close}
            aria-label="Close search"
            className="-mr-2 flex size-10 items-center justify-center rounded-volta text-volta-chalk transition-colors hover:text-volta-volt focus-visible:ring-2 focus-visible:ring-volta-volt focus-visible:outline-none"
          >
            <XIcon className="size-5" strokeWidth={2.25} />
          </button>
        </SheetHeader>

        <SheetBody>
          <div className="volta-gutter mx-auto w-full max-w-3xl pb-16">
            <div className="flex items-center gap-3 border-b-2 border-volta-line pt-6 focus-within:border-volta-volt">
              <SearchIcon
                className="size-5 shrink-0 text-volta-smoke"
                strokeWidth={2.25}
              />
              <Input
                // The overlay only mounts when open, so this fires once per
                // opening rather than stealing focus from the page.
                autoFocus
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="What are you training for?"
                aria-label="Search products"
                className="volta-wide h-14 border-b-0 text-xl placeholder:normal-case placeholder:tracking-normal placeholder:font-normal [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="volta-wide shrink-0 text-volta-micro text-volta-ash hover:text-volta-chalk"
                >
                  Clear
                </button>
              )}
            </div>

            {!searching && (
              <div className="flex flex-col gap-8 pt-10">
                <Section title="Popular searches">
                  <ul className="flex flex-wrap gap-2">
                    {POPULAR.map((term) => (
                      <li key={term}>
                        <button
                          type="button"
                          onClick={() => setQuery(term)}
                          className="volta-wide rounded-volta border-2 border-volta-line px-3 py-2 text-volta-micro text-volta-chalk transition-colors hover:border-volta-volt hover:text-volta-volt"
                        >
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section title="Browse">
                  <ul className="flex flex-col">
                    {categories.map((category) => (
                      <li key={category.href}>
                        <Link
                          href={category.href}
                          className="volta-display flex items-center justify-between border-b border-volta-line py-4 text-2xl text-volta-chalk transition-colors hover:text-volta-volt"
                        >
                          {category.label}
                          <ArrowUpRightIcon className="size-5" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Section>
              </div>
            )}

            {searching && (
              <div className="flex flex-col gap-8 pt-8">
                {categoryHits.length > 0 && (
                  <Section title="Categories">
                    <ul className="flex flex-wrap gap-2">
                      {categoryHits.map((category) => (
                        <li key={category.href}>
                          <Link
                            href={category.href}
                            className="volta-wide block rounded-volta border-2 border-volta-line px-3 py-2 text-volta-micro text-volta-chalk hover:border-volta-volt"
                          >
                            {category.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                <Section
                  title={
                    results.length === 0
                      ? "No products"
                      : `${results.length} product${results.length === 1 ? "" : "s"}`
                  }
                >
                  {results.length === 0 ? (
                    <p className="text-volta-body text-volta-ash">
                      Nothing matches “{query.trim()}”. Try a goal — protein,
                      hydration, recovery — or browse a category.
                    </p>
                  ) : (
                    <ul className="flex flex-col">
                      {results.map((entry) => (
                        <li key={entry.slug}>
                          <Link
                            href={entry.href}
                            className="group/result flex items-center gap-4 border-b border-volta-line py-3"
                          >
                            <div className="relative size-16 shrink-0 overflow-hidden rounded-volta bg-white">
                              <Image
                                src={entry.image}
                                alt=""
                                fill
                                sizes="64px"
                                className="object-contain p-1.5"
                              />
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                              <span className="volta-wide truncate text-volta-body text-volta-chalk group-hover/result:text-volta-volt">
                                {entry.name}
                              </span>
                              <span className="truncate text-volta-micro tracking-volta-wide text-volta-ash uppercase">
                                {[entry.categoryName, entry.flavour]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </span>
                              <RatingRow
                                rating={entry.rating}
                                reviewCount={entry.reviewCount}
                                size="sm"
                              />
                            </div>
                            <span className="volta-wide shrink-0 text-volta-body text-volta-chalk tabular-nums">
                              {formatPrice(entry.price)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </Section>
              </div>
            )}
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="volta-wide text-volta-micro text-volta-smoke">{title}</h3>
      {children}
    </section>
  )
}
