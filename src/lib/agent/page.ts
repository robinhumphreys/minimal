import { z } from "zod"

import {
  formatPrice,
  getCategory,
  getProduct,
  type BrandId,
} from "@/lib/catalog"

/**
 * The page the shopper is on, as one line for the prompt.
 *
 * The embed sends the path of the page it is mounted on with every request,
 * and the server reads it against the catalog. So the model is told what
 * "this" means before the shopper says it, and never has to ask which
 * product they are looking at; and the page can be described from a path
 * alone, so nothing else about the storefront needs to be sent over.
 *
 * Storefront paths are `/{brand}`, `/{brand}/{category}`, `/{brand}/p/{slug}`
 * and `/{brand}/search`. Anything else is not described.
 */
export const pageSchema = z.string().trim().max(200).optional()

export function pageLine(brand: BrandId, path: string | undefined): string {
  if (!path) return ""
  const rest = path.split("?")[0].replace(/\/+$/, "").split("/").slice(1)
  if (rest[0] !== brand) return ""

  if (rest.length === 1) {
    return "The shopper is on the shop's home page."
  }

  if (rest.length === 3 && rest[1] === "p") {
    const product = getProduct(brand, rest[2])
    if (!product) return ""
    const category = getCategory(brand, product.category)
    return `The shopper is on the product page for ${product.name} (${product.slug}, ${formatPrice(product.price)}${category ? `, in ${category.name}` : ""}). When they say "this", "it" or ask what they are looking at, they mean this product. Do not show it as a card; they can already see it.`
  }

  if (rest.length === 2) {
    if (rest[1] === "search") {
      return "The shopper is on the search page."
    }
    const category = getCategory(brand, rest[1])
    if (!category) return ""
    return `The shopper is browsing the ${category.name} category.`
  }

  return ""
}
