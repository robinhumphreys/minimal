import { pickFrom } from "@/lib/agent/picks"
import type {
  AgentUIMessage,
  ProductPick,
  SearchResult,
} from "@/lib/agent/types"
import { getCatalog, type BrandId, type Product } from "@/lib/catalog"

/**
 * What each surface looks like with an answer in it, without asking a model.
 *
 * Built from the real catalogue so the cards are the real cards; only the
 * words are canned. Server-only: the catalogue reads the filesystem.
 */
export type Fixtures = {
  chat: AgentUIMessage[]
  search: SearchResult
  keyword: SearchResult
}

const SCRIPT: Record<
  BrandId,
  {
    ask: string
    question: string
    answer: string
    picks: (product: Product) => boolean
    why: string[]
    close: string
    search: Omit<SearchResult, "products" | "mode" | "query"> & {
      query: string
      picks: (product: Product) => boolean
    }
  }
> = {
  noord: {
    ask: "What should I wear to an office in winter?",
    question:
      "For a winter office look, do you want full tailoring like a suit, or a smart-but-relaxed jacket and knit?",
    answer: "Full tailoring, something in grey",
    picks: (product) =>
      product.category === "suits" && /grey/i.test(product.name),
    why: [
      "A solid dark grey in tropical wool that reads sharp and versatile for daily office wear.",
      "If you want a bit of texture, this mid grey check keeps things formal but less flat.",
      "Lighter and softer; better for a warmer office than a cold commute.",
    ],
    close:
      "I would go with the Dark Grey Perennial: the safer, more versatile choice for every day.",
    search: {
      query: "something for a wedding in October",
      reading: ["autumn wedding suits", "navy and charcoal", "wool tailoring"],
      line: "An October wedding usually means a mid-weight wool in navy or charcoal, so is this as a guest or as the groom?",
      followUps: ["as a guest", "the groom", "not sure yet"],
      picks: (product) =>
        product.category === "suits" &&
        /navy|charcoal|grey/i.test(product.name),
    },
  },
  volta: {
    ask: "What should I take after a long run?",
    question:
      "After a long run you are short on fluids and glycogen at once, so are you after something to drink on the spot or a shake once you are home?",
    answer: "Drink now, then a shake at home",
    picks: (product) =>
      /electrolyte|rehydration|post workout/i.test(product.name),
    why: [
      "Replaces the salts you sweat out, and mixes in a bottle you already have with you.",
      "The stronger option for a hot day or a run past two hours.",
      "Protein and carbs together, for the shake at home.",
    ],
    close:
      "I would start with the Electrolytes and keep the Advanced Post Workout for when you are back.",
    search: {
      query: "something for after a long run",
      reading: [
        "post-run recovery",
        "hydration and electrolytes",
        "endurance refuel",
      ],
      line: "After a long run you are usually short on fluids, salts and muscle glycogen all at once, so are you after something to rehydrate or something to rebuild muscle?",
      followUps: ["rehydrate", "rebuild muscle", "both"],
      picks: (product) =>
        /electrolyte|rehydration|post workout|protein & oats|bcaa/i.test(
          product.name,
        ),
    },
  },
}

function picksFor(
  brand: BrandId,
  keep: (product: Product) => boolean,
  why: string[],
  limit: number,
): ProductPick[] {
  return getCatalog(brand)
    .products.filter(keep)
    .slice(0, limit)
    .map((product, index) => pickFrom(brand, product, why[index] ?? ""))
}

export function fixturesFor(brand: BrandId): Fixtures {
  const script = SCRIPT[brand]
  const products = picksFor(brand, script.picks, script.why, 3)

  const chat: AgentUIMessage[] = [
    { id: "u1", role: "user", parts: [{ type: "text", text: script.ask }] },
    {
      id: "a1",
      role: "assistant",
      parts: [{ type: "text", text: script.question }],
    },
    { id: "u2", role: "user", parts: [{ type: "text", text: script.answer }] },
    {
      id: "a2",
      role: "assistant",
      parts: [
        {
          type: "tool-showProducts",
          toolCallId: "call-1",
          state: "output-available",
          input: {
            picks: products.map((pick) => ({ slug: pick.slug, why: pick.why })),
          },
          output: { products, unknown: [] },
        },
        { type: "text", text: script.close },
      ],
    },
  ]

  const searchProducts = picksFor(brand, script.search.picks, [], 5)
  const search: SearchResult = {
    query: script.search.query,
    mode: "agent",
    reading: script.search.reading,
    line: script.search.line,
    followUps: script.search.followUps,
    products: searchProducts,
  }
  const keyword: SearchResult = {
    ...search,
    mode: "keyword",
    reading: [],
    line: `Here is what matches “${script.search.query}”. Want me to narrow it down?`,
    followUps: [],
  }

  return { chat, search, keyword }
}
