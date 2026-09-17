// Server-only: reads `@/lib/catalog`, which touches `node:fs`.
import {
  getCatalog,
  getCategory,
  getProductsInCategory,
  type Product,
} from "@/lib/catalog"

import type { NavModel, ProductCardModel, SearchEntry } from "@/lib/noord/types"

const BRAND = "noord" as const

export function productHref(slug: string) {
  return `/${BRAND}/product/${slug}`
}

export function categoryHref(slug: string) {
  return `/${BRAND}/${slug}`
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
    menu: [
      { label: "New arrivals", href: categoryHref("suits") },
      ...categories,
    ],
    secondary: SECONDARY,
    utility: UTILITY,
  }
}

/**
 * Fixed stride, not `Math.random()`: avoids clustering near-identical
 * products and stays stable between server and client renders.
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
