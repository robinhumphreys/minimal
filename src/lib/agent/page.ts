import { z } from "zod"

import {
  formatPrice,
  getCategory,
  getProduct,
  type BrandId,
} from "@/lib/catalog"

/**
 * One line describing the shopper's page, for the prompt: the embed sends
 * only the path, so the model knows what "this" means without extra data.
 */
export const pageSchema = z.string().trim().max(200).optional()

export function pageLine(brand: BrandId, path: string | undefined): string {
  if (!path) return ""
  const rest = path.split("?")[0].replace(/\/+$/, "").split("/").slice(1)
  if (rest[0] !== brand) return ""

  if (rest.length === 1) {
    return "The shopper is on the shop's home page."
  }

  if (rest.length === 3 && rest[1] === "product") {
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
