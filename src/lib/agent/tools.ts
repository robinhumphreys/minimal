import { tool } from "ai"
import { z } from "zod"

import { getCatalog, type BrandId } from "@/lib/catalog"

import { pickFrom } from "./picks"
import type { ProductPick, ShowProductsOutput } from "./types"

const showProductsInput = z.object({
  picks: z
    .array(
      z.object({
        slug: z.string().describe("A product slug from the catalog, exactly."),
        why: z
          .string()
          .describe(
            "One short sentence, addressed to the shopper, on why this one fits what they asked for.",
          ),
      }),
    )
    .min(1)
    .max(4),
})

/**
 * The one tool the storefront agent has: putting products on the screen.
 *
 * The model names slugs and reasons; the server fills in everything else from
 * the catalog so the model can neither invent a price nor mis-link a page.
 * Unknown slugs are reported back rather than silently dropped, so the model
 * can correct itself in the same turn.
 */
export function agentTools(brand: BrandId) {
  const catalog = getCatalog(brand)

  return {
    showProducts: tool({
      description:
        "Show the shopper up to four products from the catalog as cards, each with your one-line reason. Use it whenever you recommend something; never describe a product you could show instead.",
      inputSchema: showProductsInput,
      execute: async ({ picks }): Promise<ShowProductsOutput> => {
        const products: ProductPick[] = []
        const unknown: string[] = []

        for (const pick of picks) {
          const product = catalog.products.find((p) => p.slug === pick.slug)
          if (!product) {
            unknown.push(pick.slug)
            continue
          }
          products.push(pickFrom(brand, product, pick.why))
        }

        return { products, unknown }
      },
    }),
  }
}
