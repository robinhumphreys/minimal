"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { SearchIcon } from "lucide-react"

import { Input } from "@/components/noord/ui/input"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/noord/ui/sheet"
import { formatPrice } from "@/lib/noord/format"
import { useOverlays } from "@/lib/noord/overlays"
import type { NavCategory, SearchEntry } from "@/lib/noord/types"

const POPULAR = ["Navy suit", "Wool overcoat", "White shirt", "Loafers", "Linen"]
const MAX_RESULTS = 8

/**
 * Full-screen search. Matching runs over a pre-lowercased haystack built on the
 * server, so a 90-product catalog filters synchronously on every keystroke
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
      <SheetContent side="full">
        <SheetHeader>
          <SheetTitle className="sr-only">Search</SheetTitle>
          <span className="text-noord-micro text-noord-ink-faint uppercase">
            Search
          </span>
        </SheetHeader>

        <SheetBody>
          <div className="noord-gutter mx-auto w-full max-w-3xl pb-16">
            <div className="relative flex items-center gap-3 pt-6">
              <SearchIcon
                className="size-5 shrink-0 text-noord-ink-faint"
                strokeWidth={1.5}
              />
              <Input
                // Autofocus is right here: the overlay exists only to be typed in.
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="What are you looking for?"
                aria-label="Search products"
                className="h-14"
              />
            </div>

            {!searching && (
              <section className="pt-10">
                <h2 className="mb-4 text-noord-micro text-noord-ink-faint uppercase">
                  Popular searches
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {POPULAR.map((term) => (
                    <li key={term}>
                      <button
                        type="button"
                        onClick={() => setQuery(term)}
                        className="border border-noord-line px-3 py-2 text-noord-body text-noord-ink transition-colors hover:border-noord-ink"
                      >
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {searching && categoryHits.length > 0 && (
              <section className="pt-8">
                <h2 className="mb-3 text-noord-micro text-noord-ink-faint uppercase">
                  Categories
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {categoryHits.map((category) => (
                    <li key={category.href + category.label}>
                      <Link
                        href={category.href}
                        onClick={close}
                        className="border border-noord-line px-3 py-2 text-noord-body text-noord-ink transition-colors hover:border-noord-ink"
                      >
                        {category.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {searching && (
              <section className="pt-8">
                <h2 className="mb-1 text-noord-micro text-noord-ink-faint uppercase">
                  {results.length > 0 ? "Products" : "No products found"}
                </h2>

                {results.length === 0 ? (
                  <p className="pt-3 text-noord-body text-noord-ink-muted">
                    Nothing matches “{query.trim()}”. Try a fabric, a colour or a
                    category.
                  </p>
                ) : (
                  <ul className="divide-y divide-noord-line">
                    {results.map((entry) => (
                      <li key={entry.slug}>
                        <Link
                          href={entry.href}
                          onClick={close}
                          className="group flex items-center gap-4 py-3"
                        >
                          <div className="relative size-16 shrink-0 overflow-hidden bg-noord-wash">
                            <Image
                              src={entry.image}
                              alt=""
                              fill
                              sizes="4rem"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className="text-noord-micro text-noord-ink-faint uppercase">
                              {entry.categoryName}
                            </span>
                            <span className="truncate text-noord-body text-noord-ink group-hover:underline">
                              {entry.name}
                            </span>
                          </div>
                          <span className="shrink-0 text-noord-body tabular-nums">
                            {formatPrice(entry.price)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}
