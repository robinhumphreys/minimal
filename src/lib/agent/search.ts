import { generateObject } from "ai"
import { z } from "zod"

import { catalogAsText, getCatalog, type BrandId } from "@/lib/catalog"
import type { Product } from "@/lib/catalog"
import type { Behaviour } from "@/lib/config/schema"

import { pickFrom } from "./picks"
import type { SearchRequest, SearchResult } from "./types"
import { voiceLines } from "./voice"

const LIMIT = 6

/** Words a shopper types around what they mean, not as part of it. */
const STOP = new Set([
  "a",
  "an",
  "the",
  "for",
  "in",
  "on",
  "to",
  "of",
  "and",
  "or",
  "with",
  "at",
  "me",
  "my",
  "i",
  "im",
  "some",
  "something",
  "find",
  "show",
  "need",
  "want",
  "looking",
  "please",
  "that",
  "this",
  "is",
  "it",
  "be",
  "can",
  "you",
  "have",
  "do",
  "get",
  "good",
  "best",
  "nice",
])

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 2 && !STOP.has(token))
}

/** `suits` matches `suit`; the other way round is what the prefix test is for. */
function stems(token: string): string[] {
  return token.endsWith("s") && token.length > 3
    ? [token, token.slice(0, -1)]
    : [token]
}

function score(product: Product, query: string[]): number {
  const name = product.name.toLowerCase()
  const nameWords = name.split(/[^a-z0-9]+/)
  const tags = product.tags.map((tag) => tag.toLowerCase())
  const attributes = Object.values(product.attributes).map((value) =>
    value.toLowerCase(),
  )
  const description = product.description.toLowerCase()

  let total = 0
  for (const token of query) {
    let best = 0
    for (const stem of stems(token)) {
      if (nameWords.includes(stem)) best = Math.max(best, 4)
      else if (nameWords.some((word) => word.startsWith(stem)))
        best = Math.max(best, 2)
      if (tags.some((tag) => tag.includes(stem))) best = Math.max(best, 3)
      if (attributes.some((value) => value.includes(stem)))
        best = Math.max(best, 2)
      if (product.category.includes(stem)) best = Math.max(best, 2)
      if (description.includes(stem)) best = Math.max(best, 1)
    }
    total += best
  }
  return total
}

/**
 * Plain retrieval: no model, no latency. What the shopper sees the moment
 * they stop typing, and everything they see if the model is unreachable.
 */
export function keywordSearch(
  brand: BrandId,
  request: SearchRequest,
): SearchResult {
  const query = tokens([request.query, ...request.refinements].join(" "))
  const products =
    query.length === 0
      ? []
      : getCatalog(brand)
          .products.map((product) => ({
            product,
            score: score(product, query),
          }))
          .filter((entry) => entry.score > 0)
          .sort(
            (a, b) =>
              b.score - a.score || a.product.name.localeCompare(b.product.name),
          )
          .slice(0, LIMIT)
          .map((entry) => pickFrom(brand, entry.product, ""))

  return {
    query: request.query,
    mode: "keyword",
    reading: [],
    products,
    line:
      products.length > 0
        ? request.refinements.length > 0
          ? "Narrowed it down. Anything else to go on?"
          : `Here is what matches “${request.query}”. Want me to narrow it down?`
        : `Nothing matches “${request.query}” exactly. Try a fabric, a colour or a category.`,
    followUps: facetsAmong(products, brand, query),
  }
}

/**
 * Real ways to narrow the grid, read off the products in it: the categories
 * and attribute values they share. Not the model's question — it has not been
 * asked yet, or could not be — but every chip does something honest.
 */
function facetsAmong(
  picks: { slug: string }[],
  brand: BrandId,
  query: string[],
): string[] {
  const catalog = getCatalog(brand)
  const counts = new Map<string, number>()
  for (const pick of picks) {
    const product = catalog.products.find((entry) => entry.slug === pick.slug)
    if (!product) continue
    const category = catalog.categories.find(
      (entry) => entry.slug === product.category,
    )
    const values = [category?.name, ...Object.values(product.attributes)]
    for (const value of values) {
      if (!value || value.length > 18) continue
      const lowered = value.toLowerCase()
      if (query.some((token) => lowered.includes(token))) continue
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .filter(([, count]) => count >= 2 && count < picks.length)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([value]) => value)
}

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
    mode: "agent",
    reading: object.reading,
    products,
    line: object.line,
    followUps: object.followUps,
  }
}
