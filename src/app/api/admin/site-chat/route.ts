import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai"

import { DEFAULT_MODEL } from "@/lib/config/defaults"

import { chatSurfaceSchema, type ChatSurface } from "./surfaces"
import { toolsFor } from "./tools"

export const maxDuration = 30

/**
 * What the model is told about the surface the merchant is looking at, and
 * the settings that belong to it. The shared ones — voice, colour, cards —
 * are repeated in each because the model only ever sees one of these.
 */
const SHARED_SETTINGS =
  "Shared with the other surfaces, so a change here shows up everywhere: voice (warm, direct, playful); spelling (british, american); language; accent (hex); roundness (square, soft, round); font (site, inter, geist, system, serif); ratio (portrait, square); price and rating (booleans, on product cards); picks (2 to 4, how many products a recommendation shows)."

const SURFACE_BRIEF: Record<
  ChatSurface,
  { looking: string; settings: string }
> = {
  "site-chat": {
    looking:
      "The merchant is looking at a live preview of the chat button on their site, and the chat window it opens.",
    settings:
      "The settings you can change, each a choice rather than a value: greeting; starters (up to four); chatPlaceholder (what the composer says while empty); assistantName and subtitle; avatar (initial, mark); placement (bottom-left, bottom-center, bottom-right); shape (circle, square, pill); size (sm, md, lg); icon (chat, sparkles, help); iconStyle (solid, outline); label (text beside the icon); header (accent, plain); thinking (dots, ring, text); density (comfortable, compact); nudge (seconds, 0 off); openOnProductPages; hiddenPaths (path prefixes); siteChat (whether the chat button is on the site at all). Call it the chat button, never the launcher.",
  },
  "search-assist": {
    looking:
      "The merchant is looking at a live preview of Search assist: their site's own search box, with the agent's reading of a search underneath it — what it took the words to mean, the products, one line, and a box to refine. It speaks in the same voice and shows the same cards as the site chat.",
    settings:
      "The settings you can change: searchPlaceholder (what the refine box says while empty); searchAssist (whether the agent takes over the search box at all). The search box itself is the merchant's and is not yours to change; if they ask about it, say so.",
  },
  "product-help": {
    looking:
      "The merchant is looking at a live preview of Product help: a button their site places on a category page, which opens a guided choice — one question at a time, ending on a product.",
    settings:
      "The settings you can change: guideLabel (the text on the button); guideGreeting (the first line, before the first question); guideSide (right, left: which edge the panel comes in from on a wide screen); guidePlaceholder (what the answer box says while empty); productHelp (whether Product help is on at all).",
  },
}

/**
 * The customise chat in the studio: the merchant describes a change to one
 * surface in words, the model turns it into a patch via the `updateSiteChat`
 * tool, and the browser applies it to the preview.
 *
 * One conversation per surface. The request names which, and the model is
 * briefed on — and given the keys for — that surface only.
 */
export async function POST(req: Request) {
  const body: unknown = await req.json()
  const {
    messages,
    settings,
    surface: rawSurface,
  } = body as {
    messages: UIMessage[]
    settings: unknown
    surface: unknown
  }
  const parsed = chatSurfaceSchema.safeParse(rawSurface)
  const surface: ChatSurface = parsed.success ? parsed.data : "site-chat"
  const brief = SURFACE_BRIEF[surface]

  const result = streamText({
    model: DEFAULT_MODEL,
    tools: toolsFor(surface),
    instructions: [
      "You are the setup assistant for a merchant's AI shopping agent. " +
        brief.looking +
        " They are telling you what to change about it.",
      "",
      "When they ask for a change, call `updateSiteChat` with only the keys that change. Do not describe a change you have not made through the tool. If a request is ambiguous, ask one short question instead of guessing. If they ask for something outside this surface's settings, say which tab it belongs to rather than attempting it.",
      "",
      brief.settings,
      "",
      SHARED_SETTINGS,
      "",
      "After the tool has been applied, reply in one short sentence — how it looks now, or what you changed — with no markdown, no lists and no preamble. Use British spelling.",
      "",
      "Current settings:",
      JSON.stringify(settings, null, 2),
    ].join("\n"),
    messages: await convertToModelMessages(messages),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      // Demo app: the gateway's own message (missing key, unknown model)
      // is more useful in the preview than a blank "An error occurred".
      onError: (error) =>
        error instanceof Error ? error.message : String(error),
    }),
  })
}
