import { z } from "zod"

// Shared by the route, the tools and the studio, so kept free of anything that only runs on one side.
export const CHAT_SURFACES = [
  "site-chat",
  "search-assist",
  "product-help",
] as const

export type ChatSurface = (typeof CHAT_SURFACES)[number]

export const chatSurfaceSchema = z.enum(CHAT_SURFACES)

export const SURFACE_LABELS: Record<ChatSurface, string> = {
  "site-chat": "Site chat",
  "search-assist": "Search assist",
  "product-help": "Product help",
}
