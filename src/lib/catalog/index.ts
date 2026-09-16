import path from "node:path"
import { existsSync } from "node:fs"

import {
  categories as noordCategories,
  products as noordProducts,
} from "./noord"
import {
  categories as voltaCategories,
  products as voltaProducts,
  reviews as voltaReviews,
} from "./volta"
import { BRAND_IDS, type BrandId, type Catalog } from "./types"

const catalogs: Record<BrandId, Catalog> = {
  noord: {
    id: "noord",
    categories: noordCategories,
    products: noordProducts,
    // Noord shows no social proof; its pages never reach for this.
    reviews: [],
  },
  volta: {
    id: "volta",
    categories: voltaCategories,
    products: voltaProducts,
    reviews: voltaReviews,
  },
}

function assertValid(catalog: Catalog) {
  const categorySlugs = new Set<string>()
  for (const category of catalog.categories) {
    if (categorySlugs.has(category.slug)) {
      throw new Error(
        `[catalog:${catalog.id}] duplicate category slug "${category.slug}"`,
      )
    }
    categorySlugs.add(category.slug)
  }

  const productSlugs = new Set<string>()
  for (const product of catalog.products) {
    if (productSlugs.has(product.slug)) {
      throw new Error(
        `[catalog:${catalog.id}] duplicate product slug "${product.slug}"`,
      )
    }
    productSlugs.add(product.slug)

    if (!categorySlugs.has(product.category)) {
      throw new Error(
        `[catalog:${catalog.id}] product "${product.slug}" references unknown category "${product.category}"`,
      )
    }

    if (product.images.length === 0) {
      throw new Error(
        `[catalog:${catalog.id}] product "${product.slug}" has no images`,
      )
    }

    // Image files only exist on disk, so this check is dev-only: a production
    // build runs from a different cwd and the assets are already served.
    if (process.env.NODE_ENV !== "production") {
      for (const image of product.images) {
        const file = path.join(process.cwd(), "public", image)
        if (!existsSync(file)) {
          throw new Error(
            `[catalog:${catalog.id}] product "${product.slug}" references missing image "${image}". Run \`node scripts/placeholders.mjs\`.`,
          )
        }
      }
    }
  }

  const reviewIds = new Set<string>()
  for (const review of catalog.reviews) {
    if (reviewIds.has(review.id)) {
      throw new Error(
        `[catalog:${catalog.id}] duplicate review id "${review.id}"`,
      )
    }
    reviewIds.add(review.id)

    if (!productSlugs.has(review.product)) {
      throw new Error(
        `[catalog:${catalog.id}] review "${review.id}" references unknown product "${review.product}"`,
      )
    }
  }
}

for (const id of BRAND_IDS) {
  assertValid(catalogs[id])
}

export function getCatalog(id: BrandId): Catalog {
  return catalogs[id]
}

export function getCategory(id: BrandId, slug: string) {
  return catalogs[id].categories.find((category) => category.slug === slug)
}

export function getProduct(id: BrandId, slug: string) {
  return catalogs[id].products.find((product) => product.slug === slug)
}

export function getProductsInCategory(id: BrandId, slug: string) {
  return catalogs[id].products.filter((product) => product.category === slug)
}

/** Newest first, so a product page can slice the top few. */
export function getReviews(id: BrandId, slug?: string) {
  return catalogs[id].reviews
    .filter((review) => slug === undefined || review.product === slug)
    .sort((a, b) => b.date.localeCompare(a.date))
}

/** One line per product, for stuffing into the chat system prompt. */
export function catalogAsText(id: BrandId): string {
  return catalogs[id].products
    .map((product) => {
      const attributes = Object.entries(product.attributes)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ")
      return [
        product.name,
        formatPrice(product.price),
        product.category,
        attributes,
        product.tags.join(", "),
      ].join(" | ")
    })
    .join("\n")
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100)
}

export * from "./types"
