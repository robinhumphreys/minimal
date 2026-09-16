import type { BrandId } from "@/lib/catalog/types"
import { defaultConfig } from "./defaults"
import { agentConfigSchema, type AgentConfig } from "./schema"

export function publishedKey(id: BrandId): string {
  return `published:${id}`
}

/** Returns the published config for `id`, or null if absent or invalid. */
export function readPublished(id: BrandId): AgentConfig | null {
  if (typeof window === "undefined") return null

  const raw = window.localStorage.getItem(publishedKey(id))
  if (!raw) return null

  try {
    const parsed = agentConfigSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

/** Published config if present and valid, otherwise the bundled default. */
export function readPublishedOrDefault(id: BrandId): AgentConfig {
  return readPublished(id) ?? defaultConfig(id)
}

export function writePublished(id: BrandId, config: AgentConfig): void {
  if (typeof window === "undefined") return
  const validated = agentConfigSchema.parse(config)
  window.localStorage.setItem(publishedKey(id), JSON.stringify(validated))
}
