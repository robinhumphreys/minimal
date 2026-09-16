import type { AgentConfig } from "@/lib/config/schema"

/** The copy-paste install snippet for the draft's current surface. */
export function snippetFor(config: AgentConfig): string {
  const script = `<script src="https://example.com/embed.js" data-agent="${config.id}" async></script>`

  switch (config.surface.entry) {
    case "bar":
      return [`<minimal-agent-bar></minimal-agent-bar>`, script].join("\n")
    case "recommendations":
      return [
        `<minimal-agent-recommendations data-product="PRODUCT_SLUG"></minimal-agent-recommendations>`,
        script,
      ].join("\n")
    case "launcher":
      return script
  }
}
