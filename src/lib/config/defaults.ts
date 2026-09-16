import type { BrandId } from "@/lib/catalog/types"
import { agentConfigSchema, type AgentConfig } from "./schema"

const DEFAULT_MODEL = "anthropic/claude-sonnet-4.5"

export const defaults: Record<BrandId, AgentConfig> = {
  noord: {
    id: "noord",
    name: "Noord",
    theme: {
      accent: "#1f2933",
      surface: "#ffffff",
      radius: "0.5rem",
      fontBody: "system-ui, sans-serif",
      fontDisplay: "system-ui, sans-serif",
      density: "comfortable",
    },
    behaviour: {
      systemPrompt:
        "You are a shopping assistant for Noord, a menswear label. Answer using only the catalog below and name specific products.",
      greeting: "Looking for something in particular?",
      starterPrompts: [
        "What should I wear to an office in winter?",
        "Show me something in wool.",
      ],
      model: DEFAULT_MODEL,
    },
    surface: { entry: "bar" },
  },
  volta: {
    id: "volta",
    name: "Volta",
    theme: {
      accent: "#c2410c",
      surface: "#ffffff",
      radius: "0.75rem",
      fontBody: "system-ui, sans-serif",
      fontDisplay: "system-ui, sans-serif",
      density: "comfortable",
    },
    behaviour: {
      systemPrompt:
        "You are a shopping assistant for Volta, a sports nutrition brand. Answer using only the catalog below and name specific products.",
      greeting: "What are you training for?",
      starterPrompts: [
        "What should I take after a long run?",
        "Which of these are vegan?",
      ],
      model: DEFAULT_MODEL,
    },
    surface: { entry: "launcher", position: "bottom-right" },
  },
}

// Both defaults must satisfy the schema.
for (const config of Object.values(defaults)) {
  agentConfigSchema.parse(config)
}

export function defaultConfig(id: BrandId): AgentConfig {
  return structuredClone(defaults[id])
}
