import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRightIcon } from "lucide-react"

import { getCategory, getProductsInCategory } from "@/lib/catalog"
import {
  categoryHref,
  facetGroups,
  filterProducts,
  topRated,
} from "@/lib/volta/catalog-view"
import { categoryBanner } from "@/lib/volta/editorial"
import type { FacetKey } from "@/lib/volta/types"

import { CategoryFilters } from "./category-filters"
import { ProductCard } from "./product-card"
import { ProductRail } from "./product-rail"
import { Shelf } from "./shelf"

const FACET_KEYS: FacetKey[] = ["form", "goal", "flavour"]

export async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { category: slug } = await params
  const category = getCategory("volta", slug)
  if (!category) notFound()

  const query = await searchParams
  const filters = Object.fromEntries(
    FACET_KEYS.map((key) => [
      key,
      // Repeated params (`?form=a&form=b`) collapse to the first: the chips are
      // single-select, so a second value could only come from a hand-typed URL.
      typeof query[key] === "string" ? query[key] : undefined,
    ]),
  ) as Partial<Record<FacetKey, string>>

  const total = getProductsInCategory("volta", slug).length
  const products = filterProducts(slug, filters)
  const groups = facetGroups(slug)

  return (
    <div className="flex flex-col gap-10 pb-16">
      <Banner
        slug={slug}
        name={category.name}
        description={category.description}
        count={total}
      />

      <div className="volta-gutter mx-auto w-full max-w-7xl">
        {/*
          `useSearchParams` in the filters suspends on the server, and the
          fallback is the same height as the real thing so the grid below it
          does not jump when it resolves.
        */}
        <React.Suspense fallback={<div className="h-44" />}>
          <CategoryFilters
            groups={groups}
            total={total}
            shown={products.length}
          />
        </React.Suspense>
      </div>

      {/*
        The grid and the rail below it are one shelf: everything on this page
        that is product sits on the same slab of white.
      */}
      <Shelf>
        <div className="volta-gutter mx-auto w-full max-w-7xl">
          {products.length === 0 ? (
            <EmptyResult slug={slug} name={category.name} />
          ) : (
            <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product, index) => (
                <li key={product.slug}>
                  <ProductCard product={product} preload={index < 4} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <ProductRail
          eyebrow="Also worth a look"
          title="Top rated"
          products={topRated(8)}
        />
      </Shelf>
    </div>
  )
}

function Banner({
  slug,
  name,
  description,
  count,
}: {
  slug: string
  name: string
  description: string
  count: number
}) {
  return (
    <section className="relative isolate flex min-h-64 items-end overflow-hidden md:min-h-80">
      <Image
        src={categoryBanner(slug)}
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-volta-void via-volta-void/60 to-volta-void/30" />

      <div className="volta-gutter relative mx-auto flex w-full max-w-7xl flex-col gap-3 pt-10 pb-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link
                href="/volta"
                className="volta-wide text-volta-micro text-volta-ash hover:text-volta-volt"
              >
                Volta
              </Link>
            </li>
            <ChevronRightIcon className="size-3 text-volta-smoke" />
            <li className="volta-wide text-volta-micro text-volta-chalk">
              {name}
            </li>
          </ol>
        </nav>

        <div className="flex flex-wrap items-baseline gap-4">
          <h1 className="volta-display text-volta-display text-volta-chalk">
            {name}
          </h1>
          <span className="volta-wide text-volta-label text-volta-volt tabular-nums">
            {count}
          </span>
        </div>

        <p className="max-w-lg text-volta-lead text-volta-ash">{description}</p>
      </div>
    </section>
  )
}

function EmptyResult({ slug, name }: { slug: string; name: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-volta border border-volta-mist px-6 py-20 text-center">
      <p className="volta-display text-3xl text-volta-mist">No matches</p>
      <p className="max-w-sm text-volta-body text-volta-slate">
        Nothing in {name} fits that combination of filters.
      </p>
      <Link
        href={categoryHref(slug)}
        className="volta-wide text-volta-label text-volta-volt-deep hover:underline"
      >
        Clear filters
      </Link>
    </div>
  )
}
