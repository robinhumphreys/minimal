import { z } from "zod"

import { agentSearch } from "@/lib/agent/search"
import { isBrandId } from "@/lib/catalog"
import { behaviourSchema } from "@/lib/config/schema"

export const maxDuration = 30

const requestSchema = z.object({
  query: z.string().trim().min(1).max(200),
  refinements: z.array(z.string().trim().min(1).max(80)).max(8),
  behaviour: behaviourSchema,
})

export async function POST(
  req: Request,
  ctx: RouteContext<"/api/agents/[id]/search">,
) {
  const { id } = await ctx.params
  if (!isBrandId(id)) {
    return new Response(`Unknown agent "${id}"`, { status: 404 })
  }

  const parsed = requestSchema.safeParse(await req.json())
  if (!parsed.success) {
    return new Response(JSON.stringify(parsed.error.issues), { status: 400 })
  }

  const { behaviour, ...request } = parsed.data

  try {
    return Response.json(await agentSearch(id, behaviour, request))
  } catch (error) {
    console.error("[agent:search]", error)
    return new Response("Search is unavailable", { status: 502 })
  }
}
