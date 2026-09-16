import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ProductHelpBand } from "@/components/product-help-band"
import { getCategory } from "@/lib/catalog"
import {
  categoryHref,
  facetGroups,
  filterProducts,
  topRated,
} from "@/lib/volta/catalog-view"
import { categoryBanner } from "@/lib/volta/editorial"
import type { FacetKey } from "@/lib/volta/types"

import { Breadcrumbs } from "./breadcrumbs"
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

  const products = filterProducts(slug, filters)
  const groups = facetGroups(slug)

  return (
    <div className="flex flex-col pb-16">
      <Banner
        slug={slug}
        name={category.name}
        description={category.description}
      />

      {/*
        Product help: the storefront's band, the embed's button in it. Full
        bleed and flush to the banner above and the shelf below — a boxed card
        floating in a strip of black read as an ad slot.
      */}
      <ProductHelpBand brand="volta">
        <div className="bg-volta-carbon">
          <div className="volta-gutter mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 py-10 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-1">
              <p className="volta-title text-volta-title text-volta-chalk">
                Not sure which {category.name.toLowerCase()} you need?
              </p>
              <p className="text-volta-body text-volta-ash">
                Three questions and we point you at the right one.
              </p>
            </div>
            <minimal-agent-guide data-topic={category.name} />
          </div>
        </div>
      </ProductHelpBand>

      {/*
        The grid and the rail below it are one shelf: everything on this page
        that is product sits on the same slab of white. The filters share it,
        in a column down the left from `lg` up and stacked over the grid below.
      */}
      <Shelf>
        <div className="volta-gutter mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
          {/*
            `useSearchParams` in the filters suspends on the server, and the
            fallback holds the column's width so the grid does not shift when
            it resolves.
          */}
          <React.Suspense fallback={<div className="hidden lg:block" />}>
            <CategoryFilters groups={groups} />
          </React.Suspense>

          {products.length === 0 ? (
            <EmptyResult slug={slug} name={category.name} />
          ) : (
            <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3">
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
}: {
  slug: string
  name: string
  description: string
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
        <Breadcrumbs
          trail={[{ label: "Volta", href: "/volta" }, { label: name }]}
        />

        <h1 className="volta-display text-volta-display text-volta-chalk">
          {name}
        </h1>

        <p className="max-w-lg text-volta-lead text-volta-ash">{description}</p>
      </div>
    </section>
  )
}

function EmptyResult({ slug, name }: { slug: string; name: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-volta border border-volta-mist px-6 py-20 text-center">
      <p className="volta-display text-3xl text-volta-void">No matches</p>
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
