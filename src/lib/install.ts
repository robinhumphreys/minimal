import type { AgentConfig } from "@/lib/config/schema"

/** Where the embed is served from. A merchant's snippet points here. */
const EMBED_ORIGIN = "https://minimal.example.com"

/** The one tag every install needs. */
export function scriptTag(config: AgentConfig): string {
  return `<script src="${EMBED_ORIGIN}/embed.js" data-agent="${config.id}" async></script>`
}

/** The mount the search takeover needs, under the site's own search input. */
export function searchMount(): string {
  return `<minimal-agent-search data-query="{{ query }}"></minimal-agent-search>`
}

export type Snippet = { title: string; where: string; code: string }

/** What to paste, one block per thing the merchant switched on. */
export function snippetsFor(config: AgentConfig): Snippet[] {
  const snippets: Snippet[] = [
    {
      title: "The agent",
      where: "Once, in your site's layout, just before </body>.",
      code: scriptTag(config),
    },
  ]
  if (config.surface.searchAssist) {
    snippets.push({
      title: "Search assist",
      where:
        "In your search template, directly under the search input. Keep data-query equal to what the shopper has typed.",
      code: searchMount(),
    })
  }
  return snippets
}

/**
 * The same install, written for a coding agent to carry out. Everything it
 * needs to know is in one block, including how to check its own work.
 */
export function agentInstructionsFor(config: AgentConfig): string {
  const lines = [
    `Install the Minimal AI storefront agent for ${config.name}.`,
    "",
    "1. Add this script tag once, in the site-wide layout, just before the closing </body> tag:",
    "",
    `   ${scriptTag(config)}`,
    "",
    "   It loads its own stylesheet from the same origin and mounts itself. Do not add it more than once.",
  ]
  if (config.surface.searchAssist) {
    lines.push(
      "",
      "2. Search assist: in the search results template, directly under the search input, add",
      "",
      `   ${searchMount()}`,
      "",
      "   and keep the data-query attribute equal to the current value of the search input as the shopper types (an input event handler is enough). Leave the site's own results in place; the agent hides them while it has an answer, and they return if the script is absent.",
    )
  }
  lines.push(
    "",
    `${config.surface.searchAssist ? "3" : "2"}. Verify: open the site, confirm the chat button appears bottom ${(config.surface.position ?? "bottom-right").replace("bottom-", "")}, and that no console errors mention [minimal-agent].`,
    "",
    "Do not change the site's own styles for the agent; it carries its own.",
  )
  return lines.join("\n")
}
