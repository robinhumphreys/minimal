import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai"

import { agentTools } from "@/lib/agent/tools"
import { instructionsFor } from "@/lib/agent/prompt"
import { isBrandId } from "@/lib/catalog"
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
    instructions: instructionsFor(id, parsed.data),
    messages: await convertToModelMessages(messages),
    tools: agentTools(id, parsed.data.picks),
    // One call to show products, one to correct an unknown slug, and the
    // sentence that goes with them. Anything longer is the model wandering.
    stopWhen: stepCountIs(3),
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
