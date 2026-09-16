import { z } from "zod"

import { agentSearch, keywordSearch } from "@/lib/agent/search"
import { isBrandId } from "@/lib/catalog"
import { behaviourSchema } from "@/lib/config/schema"

export const maxDuration = 30

const requestSchema = z.object({
  query: z.string().trim().min(1).max(200),
  refinements: z.array(z.string().trim().min(1).max(80)).max(8),
  mode: z.enum(["keyword", "agent"]),
  behaviour: behaviourSchema,
})

/**
 * Search, taken over. The widget asks twice per search: `keyword` returns at
 * once from plain retrieval, `agent` returns the model's reading. If the
 * model is unreachable the keyword answer stands in, so the search box never
 * goes dark because of us.
 */
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

  if (request.mode === "keyword") {
    return Response.json(keywordSearch(id, request))
  }

  try {
    return Response.json(await agentSearch(id, behaviour, request))
  } catch (error) {
    console.error("[agent:search]", error)
    return Response.json(keywordSearch(id, request))
  }
}
