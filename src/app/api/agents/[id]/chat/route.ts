import {
  convertToModelMessages,
  hasToolCall,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai"
import { z } from "zod"

import { guideInstructionsFor } from "@/lib/agent/guide"
import { pageSchema } from "@/lib/agent/page"
import { agentTools } from "@/lib/agent/tools"
import { instructionsFor } from "@/lib/agent/prompt"
import { isBrandId } from "@/lib/catalog"
import { behaviourSchema, productHelpSchema } from "@/lib/config/schema"

/** Product help sends the same body plus what it is a guide to. */
const guideSchema = z.object({
  mode: z.literal("guide"),
  topic: z.string().trim().min(1).max(80),
  productHelp: productHelpSchema,
})

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
  const { messages, behaviour, page, ...rest } = body as {
    messages: UIMessage[]
    behaviour: unknown
    /** Path of the page the embed is on, sent with every request. */
    page?: unknown
  }

  const parsed = behaviourSchema.safeParse(behaviour)
  if (!parsed.success) {
    return new Response(JSON.stringify(parsed.error.issues), { status: 400 })
  }
  const guide = guideSchema.safeParse(rest)
  // A bad page is no page: the shopper's question still deserves an answer.
  const where = pageSchema.safeParse(page).data

  const result = streamText({
    model: parsed.data.model,
    instructions: guide.success
      ? guideInstructionsFor(
          id,
          parsed.data,
          guide.data.productHelp,
          guide.data.topic,
          where,
        )
      : instructionsFor(id, parsed.data, where),
    messages: await convertToModelMessages(messages),
    tools: agentTools(id, parsed.data.picks, guide.success),
    // Capped at 3 steps: anything longer is the model wandering. In the guide, a question asked ends the turn.
    stopWhen: [stepCountIs(3), hasToolCall("askChoice")],
    onError: ({ error }) => {
      console.error("[agent:chat]", error)
    },
  })

  return result.toUIMessageStreamResponse({
    // Demo app: the gateway's own message (missing key, unknown model) is
    // more useful in the widget than a blank "An error occurred".
    onError: (error) =>
      error instanceof Error ? error.message : String(error),
  })
}
