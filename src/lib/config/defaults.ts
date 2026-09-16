import type { BrandId } from "@/lib/catalog/types"
import { agentConfigSchema, type AgentConfig } from "./schema"

export const DEFAULT_MODEL = "anthropic/claude-sonnet-5"

export const defaults: Record<BrandId, AgentConfig> = {
  noord: {
    id: "noord",
    name: "Noord Suits",
    // Matches the Noord storefront tokens in `src/styles/noord.css`, so the
    // embedded agent does not read as a third-party widget bolted on.
    theme: {
      accent: "#131313",
      surface: "#ffffff",
      // Noord draws nothing with a curve.
      roundness: "square",
      font: "site",
      fontBody: "var(--font-noord-sans), Helvetica, Arial, sans-serif",
      fontDisplay: "var(--font-noord-sans), Helvetica, Arial, sans-serif",
      header: "accent",
      thinking: "dots",
      density: "comfortable",
    },
    behaviour: {
      systemPrompt:
        "You are a shopping assistant for Noord Suits, a menswear label. Answer using only the catalog below and name specific products.",
      greeting: "Looking for something in particular?",
      starterPrompts: [
        "What should I wear to an office in winter?",
        "Show me something in wool.",
      ],
      model: DEFAULT_MODEL,
      voice: "warm",
      spelling: "british",
      language: "English",
      picks: 3,
    },
    // Outline glyph: Noord's storefront is hairlines and thin rules.
    surface: {
      entry: "launcher",
      position: "bottom-right",
      icon: "chat",
      iconStyle: "outline",
      label: "",
      shape: "circle",
      size: "md",
      // The catalogue is shot tall, on models.
      cards: { ratio: "portrait", price: true, rating: true },
      nudge: 0,
      openOnProductPages: false,
      hiddenPaths: [],
      searchAssist: true,
    },
    identity: {
      assistantName: "",
      subtitle: "Shopping assistant",
      avatar: "initial",
    },
  },
  volta: {
    id: "volta",
    name: "Volta",
    theme: {
      // Volta's own volt — see `--color-volta-volt` in `src/styles/volta.css`.
      // Bright enough that anything on it has to be black, which is what the
      // storefront does with it too.
      accent: "#d7ff00",
      // Volta's ground is charcoal (`--color-volta-void`), so the window is
      // dark too; a white panel on that storefront would be the bolted-on look.
      surface: "#212121",
      // `--radius-volta` is 2px: near-square blocks, not pills.
      roundness: "soft",
      font: "site",
      fontBody:
        'var(--font-volta-text-sans), "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontDisplay:
        'var(--font-volta-display-sans), "Helvetica Neue", Helvetica, Arial, sans-serif',
      header: "accent",
      thinking: "dots",
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
      voice: "direct",
      spelling: "british",
      language: "English",
      picks: 3,
    },
    // Solid glyph: Volta's marks are filled blocks of volt.
    surface: {
      entry: "launcher",
      position: "bottom-right",
      icon: "chat",
      iconStyle: "solid",
      label: "",
      shape: "circle",
      size: "md",
      // Product shots, square, on white.
      cards: { ratio: "square", price: true, rating: true },
      nudge: 0,
      openOnProductPages: false,
      hiddenPaths: [],
      searchAssist: true,
    },
    identity: {
      assistantName: "",
      subtitle: "Shopping assistant",
      avatar: "mark",
    },
  },
}

// Both defaults must satisfy the schema.
for (const config of Object.values(defaults)) {
  agentConfigSchema.parse(config)
}

export function defaultConfig(id: BrandId): AgentConfig {
  return structuredClone(defaults[id])
}
