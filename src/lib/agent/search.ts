import { generateObject } from "ai"
import { z } from "zod"

import { catalogAsText, getCatalog, type BrandId } from "@/lib/catalog"
import type { Product } from "@/lib/catalog"
import type { Behaviour } from "@/lib/config/schema"

import { pickFrom } from "./picks"
import type { SearchRequest, SearchResult } from "./types"
import { voiceLines } from "./voice"

const LIMIT = 6

const readingSchema = z.object({
  reading: z
    .array(z.string())
    .max(3)
    .describe(
      "Two or three phrases of two to four words, in the catalog's own terms, naming what the search was taken to mean. They become tappable chips.",
    ),
  picks: z
    .array(z.string())
    .max(LIMIT)
    .describe(
      "Product slugs from the catalog, best first. Empty if nothing fits.",
    ),
  line: z
    .string()
    .describe(
      "One sentence to the shopper. If the search is open-ended, end with one question that would narrow it. If nothing fits, say so and name the nearest thing.",
    ),
  followUps: z
    .array(z.string())
    .max(3)
    .describe(
      "Two or three answers of one to three words the shopper could tap in reply to the question. Empty if no question was asked.",
    ),
})

const JOB = `
The shopper typed into the shop's search box, not into a chat. Read the search the way a good shop assistant would — an occasion, a season, a goal, a feeling all map onto things the shop actually sells — and answer in the structure asked for.
- Never invent a slug. Only use slugs from the catalog below.
- Refinements are answers the shopper has already tapped; treat them as part of the search.
- Plain text in every field. No markdown, no emoji.
`.trim()

/** The model's reading of the search, on top of the catalog it can see. */
export async function agentSearch(
  brand: BrandId,
  behaviour: Behaviour,
  request: SearchRequest,
): Promise<SearchResult> {
  const catalog = getCatalog(brand)

  const { object } = await generateObject({
    model: behaviour.model,
    schema: readingSchema,
    instructions: [
      behaviour.systemPrompt,
      "",
      JOB,
      "",
      voiceLines(behaviour),
      "",
      "Catalog (slug | name | price | category | attributes | tags | description):",
      catalogAsText(brand),
    ].join("\n"),
    prompt: [
      `Search: ${request.query}`,
      request.refinements.length > 0
        ? `Refinements: ${request.refinements.join("; ")}`
        : "Refinements: none",
    ].join("\n"),
  })

  const products = object.picks
    .map((slug) => catalog.products.find((product) => product.slug === slug))
    .filter((product): product is Product => product !== undefined)
    .map((product) => pickFrom(brand, product, ""))

  return {
    query: request.query,
    reading: object.reading,
    products,
    line: object.line,
    followUps: object.followUps,
  }
}
