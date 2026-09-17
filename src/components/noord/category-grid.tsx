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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/noord/ui/toggle-group"
import type { FacetKey, SearchEntry } from "@/lib/noord/types"

type Sort = "featured" | "price-asc" | "price-desc"

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
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
 * Filters and sorts client-side: the whole category already arrived in one
 * payload, so a round trip per facet would only add latency.
 */
export function CategoryGrid({
  products,
  title,
  description,
}: {
  products: SearchEntry[]
  title: string
  description: string
}) {
  const searchParams = useSearchParams()
  const [sort, setSort] = React.useState<Sort>("featured")
  const [filtersOpen, setFiltersOpen] = React.useState(false)

  // Derived, not stored: moving between two collection links has to replace
  // the selection, and holding it in state would strand the old one.
  const fromUrl = React.useMemo<Selection>(() => {
    const next = { ...EMPTY }
    for (const { key } of FACETS) next[key] = searchParams.getAll(key)
    return next
  }, [searchParams])

  const [overrides, setOverrides] = React.useState<Selection | null>(null)
  const [lastFromUrl, setLastFromUrl] = React.useState(fromUrl)

  // A new set of URL params invalidates local overrides. Reset during render,
  // not in an effect, to avoid painting one frame of the stale selection.
  if (lastFromUrl !== fromUrl) {
    setLastFromUrl(fromUrl)
    setOverrides(null)
  }

  const selection = overrides ?? fromUrl

  const facets = React.useMemo(
    () =>
      FACETS.map(({ key, title: facetTitle }) => ({
        key,
        title: facetTitle,
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

  const active = FACETS.flatMap(({ key }) =>
    selection[key].map((value) => ({ key, value })),
  )

  function setFacet(facet: FacetKey, values: string[]) {
    setOverrides({ ...selection, [facet]: values })
  }

  function clearAll() {
    setOverrides(EMPTY)
  }

  return (
    <>
      <div className="noord-gutter flex items-end justify-between gap-6 pt-8 pb-6 md:pt-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-noord-section">{title}</h1>
          <p className="max-w-md text-noord-lead text-noord-ink-muted">
            {description}
          </p>
        </div>

        <Button
          variant="quiet"
          size="sm"
          onClick={() => setFiltersOpen(true)}
          className="shrink-0 border-0 px-0 hover:text-noord-ink-muted"
        >
          <SlidersHorizontalIcon strokeWidth={1.5} />
          Filter
          {active.length > 0 && (
            <>
              <span aria-hidden className="size-1 bg-noord-ink" />
              <span className="sr-only">, filters active</span>
            </>
          )}
        </Button>
      </div>

      {active.length > 0 && (
        <div className="noord-gutter flex flex-wrap items-center gap-2 pb-6">
          {active.map(({ key, value }) => (
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
          ))}
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
        // Full-bleed on a phone; sm+ paddings mirror `.noord-gutter`, which
        // can't be written as a `sm:` variant here.
        <div className="grid grid-cols-1 gap-y-10 pb-8 sm:grid-cols-2 sm:gap-x-3 sm:px-4 md:grid-cols-3 md:gap-x-6 md:px-8 xl:grid-cols-4 xl:px-12">
          {visible.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              priority={index < 2}
              bleed
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, (min-width: 640px) 46vw, 100vw"
            />
          ))}
        </div>
      )}

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Filter</SheetTitle>
          </SheetHeader>

          <SheetBody className="noord-sheet-gutter flex flex-col gap-8 py-6">
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3 text-noord-micro text-noord-ink-faint uppercase">
                Sort
              </legend>
              <ToggleGroup
                value={[sort]}
                onValueChange={(next) => {
                  const [picked] = next as Sort[]
                  // Base UI reports an empty array when the pressed item is
                  // pressed again; a sort always has to be something.
                  if (picked) setSort(picked)
                }}
                size="sm"
              >
                {SORTS.map((option) => (
                  <ToggleGroupItem
                    key={option.value}
                    value={option.value}
                    className="normal-case"
                  >
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </fieldset>

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
