import { formatPrice, type BrandId, type Product } from "@/lib/catalog"

import type { ProductPick } from "./types"

/** Everything a card needs, from the catalog rather than from the model. */
export function pickFrom(
  brand: BrandId,
  product: Product,
  why: string,
): ProductPick {
  return {
    slug: product.slug,
    name: product.name,
    price: formatPrice(product.price),
    compareAt:
      product.compareAt !== undefined
        ? formatPrice(product.compareAt)
        : undefined,
    image: product.images[0],
    url: `/${brand}/p/${product.slug}`,
    rating: product.rating,
    reviewCount: product.reviewCount,
    why,
  }
}
