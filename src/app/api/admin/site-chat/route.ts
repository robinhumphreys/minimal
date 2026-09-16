import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai"

import { DEFAULT_MODEL } from "@/lib/config/defaults"

import { siteChatTools } from "./tools"

export const maxDuration = 30

/**
 * The customise chat in onboarding: the merchant describes a change to the
 * site chat surface in words, the model turns it into a patch via the
 * `updateSiteChat` tool, and the browser applies it to the preview.
 */
export async function POST(req: Request) {
  const body: unknown = await req.json()
  const { messages, settings } = body as {
    messages: UIMessage[]
    settings: unknown
  }

  const result = streamText({
    model: DEFAULT_MODEL,
    tools: siteChatTools,
    instructions: [
      "You are the setup assistant for a merchant's AI shopping agent. The merchant is looking at a live preview of the chat launcher on their site and is telling you what to change.",
      "",
      "When they ask for a change, call `updateSiteChat` with only the keys that change. Do not describe a change you have not made through the tool. If a request is ambiguous, ask one short question instead of guessing.",
      "",
      "The settings you can change, each a choice rather than a value: greeting; starters (up to four); assistantName and subtitle; avatar (initial, mark); voice (warm, direct, playful); spelling (british, american); language; placement (bottom-left, bottom-center, bottom-right); shape (circle, square, pill); size (sm, md, lg); icon (chat, sparkles, help); iconStyle (solid, outline); label; accent (hex); roundness (square, soft, round); font (site, inter, geist, system, serif); header (accent, plain); thinking (dots, ring, text); density (comfortable, compact); ratio (portrait, square); price and rating (booleans, on cards); picks (2 to 4); nudge (seconds, 0 off); openOnProductPages; hiddenPaths (path prefixes); searchAssist.",
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
