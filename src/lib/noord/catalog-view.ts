// Server-only: reads `@/lib/catalog`, which touches `node:fs`.
import {
  getCatalog,
  getCategory,
  getProductsInCategory,
  type Product,
} from "@/lib/catalog"

import type {
  FacetKey,
  NavColumn,
  NavModel,
  NavPromo,
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

/** A category page pre-filtered to one facet value — what the nav links to. */
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

/**
 * Editorial links the catalog does not model. They point at real category
 * pages so nothing in the demo dead-ends.
 */
const EXPLORE = [
  { label: "New arrivals", href: categoryHref("suits") },
  { label: "The tailoring guide", href: categoryHref("jackets") },
  { label: "Perennial collection", href: categoryHref("suits") },
  { label: "Gifting", href: categoryHref("accessories") },
]

const SERVICE = [
  { label: "Book an appointment", href: `/${BRAND}` },
  { label: "Find a store", href: `/${BRAND}` },
  { label: "Alterations", href: `/${BRAND}` },
  { label: "Shipping & returns", href: `/${BRAND}` },
  { label: "Contact us", href: `/${BRAND}` },
]

const UTILITY = [
  { label: "Stores", href: `/${BRAND}` },
  { label: "Appointments", href: `/${BRAND}` },
  { label: "Help", href: `/${BRAND}` },
]

/** Editorial shots the nav panels borrow, one per category, in order. */
const PANEL_IMAGES = [
  "/noord/editorial/rail-glass.jpg",
  "/noord/editorial/street-brown.jpg",
  "/noord/editorial/detail-cuff.jpg",
  "/noord/editorial/steps-grey.jpg",
  "/noord/editorial/store-interior.jpg",
  "/noord/editorial/shopfront.jpg",
]

const FACET_TITLES: Record<FacetKey, string> = {
  fit: "Shop by fit",
  fabric: "Shop by fabric",
  colour: "Shop by colour",
}

/** Distinct values of one attribute, most common first, capped for the panel. */
function facetColumn(
  categorySlug: string,
  products: Product[],
  facet: FacetKey,
  limit = 6,
): NavColumn | null {
  const counts = new Map<string, number>()
  for (const product of products) {
    const value = product.attributes[facet]
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  // A column offering a single choice is not a choice.
  if (counts.size < 2) return null

  const links = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([value]) => ({
      label: value,
      href: facetHref(categorySlug, facet, value),
    }))

  return { title: FACET_TITLES[facet], links }
}

export function navModel(): NavModel {
  const catalog = getCatalog(BRAND)

  const categories = catalog.categories.map((category, index) => {
    const products = getProductsInCategory(BRAND, category.slug)

    const columns = (["fit", "fabric", "colour"] as FacetKey[])
      .map((facet) => facetColumn(category.slug, products, facet))
      .filter((column): column is NavColumn => column !== null)

    const promo: NavPromo | undefined =
      columns.length > 0
        ? {
            image: PANEL_IMAGES[index % PANEL_IMAGES.length],
            eyebrow: "Autumn / Winter",
            title: `All ${category.name.toLowerCase()}`,
            href: categoryHref(category.slug),
          }
        : undefined

    return {
      label: category.name,
      href: categoryHref(category.slug),
      columns,
      promo,
    }
  })

  return {
    categories,
    explore: EXPLORE,
    service: SERVICE,
    utility: UTILITY,
    featured: pickFeatured(2),
  }
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
