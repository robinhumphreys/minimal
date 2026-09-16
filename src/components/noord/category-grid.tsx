"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { SlidersHorizontalIcon } from "lucide-react"

import { ProductCard } from "@/components/noord/product-card"
import { Button } from "@/components/noord/ui/button"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/noord/ui/sheet"
import { ToggleGroup, ToggleGroupItem } from "@/components/noord/ui/toggle-group"
import type { FacetKey, SearchEntry } from "@/lib/noord/types"

type Sort = "featured" | "price-asc" | "price-desc"

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
]

const FACETS: { key: FacetKey; title: string }[] = [
  { key: "fit", title: "Fit" },
  { key: "fabric", title: "Fabric" },
  { key: "colour", title: "Colour" },
]

type Selection = Record<FacetKey, string[]>

const EMPTY: Selection = { fit: [], fabric: [], colour: [] }

/** `SearchEntry` stores colour under its own key, the rest match one-for-one. */
function valueOf(product: SearchEntry, facet: FacetKey) {
  return facet === "colour" ? product.colour : product[facet]
}

/**
 * The product grid plus its controls.
 *
 * Sorting and filtering are client-side over the category's products: the
 * whole category arrives in one payload anyway, so a round trip per facet
 * would only add latency. The desktop nav links in with `?fit=…` and friends,
 * which seed the selection on arrival.
 */
export function CategoryGrid({ products }: { products: SearchEntry[] }) {
  const searchParams = useSearchParams()
  const [sort, setSort] = React.useState<Sort>("featured")
  const [filtersOpen, setFiltersOpen] = React.useState(false)

  // Derived, not stored: navigating from one nav panel link to another has to
  // replace the selection, and holding it in state would strand the old one.
  const fromUrl = React.useMemo<Selection>(() => {
    const next = { ...EMPTY }
    for (const { key } of FACETS) next[key] = searchParams.getAll(key)
    return next
  }, [searchParams])

  const [overrides, setOverrides] = React.useState<Selection | null>(null)
  const [lastFromUrl, setLastFromUrl] = React.useState(fromUrl)

  // A new set of URL params is a new starting point, so local edits go. Reset
  // during render rather than in an effect: an effect would paint one frame of
  // the old selection against the new URL first.
  if (lastFromUrl !== fromUrl) {
    setLastFromUrl(fromUrl)
    setOverrides(null)
  }

  const selection = overrides ?? fromUrl

  const facets = React.useMemo(
    () =>
      FACETS.map(({ key, title }) => ({
        key,
        title,
        options: distinct(products.map((product) => valueOf(product, key))),
      })).filter((facet) => facet.options.length > 1),
    [products],
  )

  const visible = React.useMemo(() => {
    const filtered = products.filter((product) =>
      FACETS.every(({ key }) => {
        const chosen = selection[key]
        if (chosen.length === 0) return true
        const value = valueOf(product, key)
        return value !== undefined && chosen.includes(value)
      }),
    )

    if (sort === "featured") return filtered
    const direction = sort === "price-asc" ? 1 : -1
    return [...filtered].sort((a, b) => (a.price - b.price) * direction)
  }, [products, selection, sort])

  const activeCount = FACETS.reduce(
    (total, { key }) => total + selection[key].length,
    0,
  )

  function setFacet(facet: FacetKey, values: string[]) {
    setOverrides({ ...selection, [facet]: values })
  }

  function clearAll() {
    setOverrides(EMPTY)
  }

  return (
    <>
      <div className="noord-gutter sticky top-noord-header z-30 flex items-center justify-between gap-4 border-b border-noord-line bg-noord-paper/95 py-3 backdrop-blur-sm lg:top-[calc(3.5rem+2.75rem)]">
        <Button
          variant="quiet"
          size="sm"
          onClick={() => setFiltersOpen(true)}
          className="border-0 px-0 hover:text-noord-ink-muted"
        >
          <SlidersHorizontalIcon strokeWidth={1.5} />
          Filter
          {/* A dot, not a count — Noord shows no tallies. The active filters
              are spelled out in the chip row below anyway. */}
          {activeCount > 0 && (
            <span aria-hidden className="size-1 bg-noord-ink" />
          )}
          {activeCount > 0 && <span className="sr-only">, filters active</span>}
        </Button>

        <label className="flex items-center gap-2">
          <span className="sr-only">Sort by</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            className="cursor-pointer border-0 bg-transparent py-1 text-noord-micro text-noord-ink uppercase outline-none focus-visible:ring-1 focus-visible:ring-noord-ink"
          >
            {SORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {activeCount > 0 && (
        <div className="noord-gutter flex flex-wrap items-center gap-2 pt-4">
          {FACETS.flatMap(({ key }) =>
            selection[key].map((value) => (
              <button
                key={`${key}:${value}`}
                type="button"
                onClick={() =>
                  setFacet(
                    key,
                    selection[key].filter((entry) => entry !== value),
                  )
                }
                className="flex items-center gap-2 border border-noord-line px-3 py-1.5 text-noord-micro text-noord-ink uppercase transition-colors hover:border-noord-ink"
              >
                {value}
                <span aria-hidden>×</span>
                <span className="sr-only">Remove filter</span>
              </button>
            )),
          )}
          <button
            type="button"
            onClick={clearAll}
            className="noord-underline px-1 text-noord-micro text-noord-ink-muted uppercase"
          >
            Clear all
          </button>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="noord-gutter flex flex-col items-start gap-4 py-20">
          <p className="text-noord-section">Nothing matches those filters.</p>
          <Button variant="outline" onClick={clearAll}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="noord-gutter grid grid-cols-2 gap-x-3 gap-y-10 py-8 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
          {visible.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              priority={index < 4}
            />
          ))}
        </div>
      )}

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Filter</SheetTitle>
          </SheetHeader>

          <SheetBody className="noord-gutter flex flex-col gap-8 py-6">
            {facets.map((facet) => (
              <FacetGroup
                key={facet.key}
                title={facet.title}
                options={facet.options}
                value={selection[facet.key]}
                onValueChange={(next) => setFacet(facet.key, next)}
              />
            ))}
          </SheetBody>

          <SheetFooter className="flex gap-3">
            <Button variant="quiet" className="flex-1" onClick={clearAll}>
              Clear
            </Button>
            <Button className="flex-1" onClick={() => setFiltersOpen(false)}>
              Show results
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}

function FacetGroup({
  title,
  options,
  value,
  onValueChange,
}: {
  title: string
  options: string[]
  value: string[]
  onValueChange: (next: string[]) => void
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-noord-micro text-noord-ink-faint uppercase">
        {title}
      </legend>
      <ToggleGroup
        multiple
        value={value}
        onValueChange={(next) => onValueChange(next as string[])}
        size="sm"
      >
        {options.map((option) => (
          <ToggleGroupItem key={option} value={option} className="normal-case">
            {option}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </fieldset>
  )
}

/** Sorted, de-duplicated, skipping products that never declared the attribute. */
function distinct(values: (string | undefined)[]): string[] {
  return [
    ...new Set(values.filter((value): value is string => Boolean(value))),
  ].sort()
}
