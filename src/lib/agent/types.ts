import type { UIDataTypes, UIMessage } from "ai"

import type { CartView } from "./cart"

/**
 * What the agent hands the widget when it puts products in front of a shopper.
 *
 * Shared by the route (which builds it from the catalog) and the embed (which
 * only ever sees this shape): the embed cannot import the catalog, because the
 * catalog reads `node:fs`, so everything a card needs to draw itself is here.
 */
export type ProductPick = {
  slug: string
  name: string
  /** Formatted, e.g. "€449.00". */
  price: string
  /** Formatted. Present when the product is on sale. */
  compareAt?: string
  image: string
  /** Storefront product page, relative to the site root. */
  url: string
  /** Mean rating, when the brand shows one. Always with `reviewCount`. */
  rating?: number
  reviewCount?: number
  /** The agent's one-line reason for this pick, in the shopper's terms. */
  why: string
}

export type ShowProductsInput = {
  picks: { slug: string; why: string }[]
}

export type ShowProductsOutput = {
  products: ProductPick[]
  /** Slugs the model asked for that are not in the catalog. */
  unknown: string[]
}

/** What the storefront's search box sends when the agent has taken it over. */
export type SearchRequest = {
  query: string
  /** Chips and answers the shopper tapped since typing the query. */
  refinements: string[]
  /** Keyword retrieval answers at once; the agent's reading follows. */
  mode: "keyword" | "agent"
}

export type SearchResult = {
  query: string
  mode: "keyword" | "agent"
  /** How the agent read the search, as phrases in the catalog's own terms. */
  reading: string[]
  products: ProductPick[]
  /** One line to the shopper. Empty in keyword mode. */
  line: string
  /** Short answers the shopper can tap to the line's question. */
  followUps: string[]
}

/** A question with answers to tap, in the choice guide. */
export type AskChoiceInput = { question: string; options: string[] }

/**
 * Answered by the page, not the server: the cart is in the shopper's browser.
 * Takes nothing; the model has no say in which cart it sees.
 */
export type ViewCartInput = Record<string, never>

/** The tool set as the client sees it: names to input/output pairs. */
export type AgentTools = {
  showProducts: { input: ShowProductsInput; output: ShowProductsOutput }
  askChoice: { input: AskChoiceInput; output: { asked: true } }
  viewCart: { input: ViewCartInput; output: CartView }
}

/**
 * The guide opens with a message the shopper never typed, to get the first
 * question asked. It is marked so the transcript can leave it out.
 */
export type AgentMetadata = { hidden?: boolean }

export type AgentUIMessage = UIMessage<AgentMetadata, UIDataTypes, AgentTools>
