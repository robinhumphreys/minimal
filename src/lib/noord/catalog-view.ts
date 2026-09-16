// Server-only: reads `@/lib/catalog`, which touches `node:fs`.
import {
  getCatalog,
  getCategory,
  getProductsInCategory,
  type Product,
} from "@/lib/catalog"

import type {
  Collection,
  FacetKey,
  NavModel,
  ProductCardModel,
  SearchEntry,
} from "@/lib/noord/types"

const BRAND = "noord" as const

export function productHref(slug: string) {
  return `/${BRAND}/p/${slug}`
}

export function categoryHref(slug: string) {
  return `/${BRAND}/${slug}`
}

/** A category page pre-filtered to one facet value. */
export function facetHref(category: string, facet: FacetKey, value: string) {
  return `${categoryHref(category)}?${facet}=${encodeURIComponent(value)}`
}

export function toCard(product: Product): ProductCardModel {
  const category = getCategory(BRAND, product.category)
  return {
    slug: product.slug,
    name: product.name,
    href: productHref(product.slug),
    image: product.images[0],
    price: product.price,
    compareAt: product.compareAt,
    colour: product.attributes.colour,
    categoryName: category?.name ?? product.category,
  }
}

export function toSearchEntry(product: Product): SearchEntry {
  const card = toCard(product)
  return {
    ...card,
    category: product.category,
    fit: product.attributes.fit,
    fabric: product.attributes.fabric,
    tags: product.tags,
    haystack: [
      product.name,
      card.categoryName,
      ...Object.values(product.attributes),
      ...product.tags,
    ]
      .join(" ")
      .toLowerCase(),
  }
}

export function searchIndex(): SearchEntry[] {
  return getCatalog(BRAND).products.map(toSearchEntry)
}

const SECONDARY = [
  { label: "Stores", href: `/${BRAND}` },
  { label: "Book an appointment", href: `/${BRAND}` },
  { label: "Gift cards", href: `/${BRAND}` },
  { label: "Help", href: `/${BRAND}` },
]

const UTILITY = [
  { label: "Stores", href: `/${BRAND}` },
  { label: "Appointments", href: `/${BRAND}` },
  { label: "Help", href: `/${BRAND}` },
]

export function navModel(): NavModel {
  const categories = getCatalog(BRAND).categories.map((category) => ({
    label: category.name,
    href: categoryHref(category.slug),
  }))

  return {
    categories,
    // "New arrivals" sits with the categories rather than in a group of its
    // own, the way a shopper thinks about it.
    menu: [{ label: "New arrivals", href: categoryHref("suits") }, ...categories],
    secondary: SECONDARY,
    utility: UTILITY,
  }
}

/**
 * Sub-collections for a category page, taken from whichever facet splits it
 * most usefully. Fit first — it is how tailoring is actually shopped — then
 * fabric, then colour. Returns nothing when the category has no real split.
 */
export function collectionsFor(categorySlug: string): Collection[] {
  const products = getProductsInCategory(BRAND, categorySlug)

  for (const facet of ["fit", "fabric", "colour"] as FacetKey[]) {
    const byValue = new Map<string, Product[]>()
    for (const product of products) {
      const value = product.attributes[facet]
      if (!value) continue
      byValue.set(value, [...(byValue.get(value) ?? []), product])
    }

    // One tile is not a collection, and a facet that splits every product into
    // its own bucket is a spec, not a collection.
    if (byValue.size < 2 || byValue.size > 6) continue

    return [...byValue.entries()].map(([value, matches]) => ({
      label: value,
      href: facetHref(categorySlug, facet, value),
      image: matches[0].images[0],
    }))
  }

  return []
}

/**
 * A stable, spread-out sample: walking the catalog at a fixed stride avoids
 * pulling `count` near-identical navy suits, and avoids `Math.random()`, which
 * would differ between the server render and the client.
 */
export function pickFeatured(count: number, offset = 0): ProductCardModel[] {
  const products = getCatalog(BRAND).products
  if (products.length === 0) return []

  const stride = Math.max(1, Math.floor(products.length / count))
  return Array.from({ length: Math.min(count, products.length) }, (_, i) =>
    toCard(products[(offset + i * stride) % products.length]),
  )
}

/** Products from the same category, excluding the one being viewed. */
export function relatedProducts(product: Product, count: number) {
  return getProductsInCategory(BRAND, product.category)
    .filter((candidate) => candidate.slug !== product.slug)
    .slice(0, count)
    .map(toCard)
}
