import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai"

import { catalogAsText, isBrandId } from "@/lib/catalog"
import { behaviourSchema } from "@/lib/config/schema"

export const maxDuration = 30

export async function POST(
  req: Request,
  ctx: RouteContext<"/api/agents/[id]/chat">,
) {
  const { id } = await ctx.params
  if (!isBrandId(id)) {
    return new Response(`Unknown agent "${id}"`, { status: 404 })
  }

  const body: unknown = await req.json()
  const { messages, behaviour } = body as {
    messages: UIMessage[]
    behaviour: unknown
  }

  const parsed = behaviourSchema.safeParse(behaviour)
  if (!parsed.success) {
    return new Response(JSON.stringify(parsed.error.issues), { status: 400 })
  }

  const result = streamText({
    model: parsed.data.model,
    instructions: [
      parsed.data.systemPrompt,
      "",
      "Catalog (name | price | category | attributes | tags):",
      catalogAsText(id),
    ].join("\n"),
    messages: await convertToModelMessages(messages),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
