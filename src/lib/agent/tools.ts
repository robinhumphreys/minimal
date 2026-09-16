import { tool } from "ai"
import { z } from "zod"

import { getCatalog, type BrandId } from "@/lib/catalog"

import { pickFrom } from "./picks"
import type { ProductPick, ShowProductsOutput } from "./types"

const showProductsInput = (max: number) =>
  z.object({
    picks: z
      .array(
        z.object({
          slug: z
            .string()
            .describe("A product slug from the catalog, exactly."),
          why: z
            .string()
            .describe(
              "One short sentence, addressed to the shopper, on why this one fits what they asked for.",
            ),
        }),
      )
      .min(1)
      .max(max),
  })

/**
 * The one tool the storefront agent has: putting products on the screen.
 *
 * The model names slugs and reasons; the server fills in everything else from
 * the catalog so the model can neither invent a price nor mis-link a page.
 * Unknown slugs are reported back rather than silently dropped, so the model
 * can correct itself in the same turn.
 */
const askChoiceInput = z.object({
  question: z
    .string()
    .describe("One short question, addressed to the shopper."),
  options: z
    .array(z.string())
    .min(2)
    .max(4)
    .describe(
      "Two to four short answers the shopper can tap. Answers, not product names.",
    ),
})

export function agentTools(brand: BrandId, maxPicks = 3, guide = false) {
  const catalog = getCatalog(brand)

  const askChoice = tool({
    description:
      "Ask the shopper one question with answers they can tap. Call it once per turn and then stop; the shopper's tap comes back as their next message.",
    inputSchema: askChoiceInput,
    execute: async () => ({ asked: true as const }),
  })

  return {
    ...(guide ? { askChoice } : {}),
    showProducts: tool({
      description: `Show the shopper up to ${maxPicks} products from the catalog as cards, each with your one-line reason. Use it whenever you recommend something; never describe a product you could show instead.`,
      inputSchema: showProductsInput(maxPicks),
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
