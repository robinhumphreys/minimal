import type { AgentConfig } from "@/lib/config/schema"

/** Where the embed is served from. A merchant's snippet points here. */
const EMBED_ORIGIN = "https://minimal.example.com"

/** The one tag every install needs. */
export function scriptTag(config: AgentConfig): string {
  return `<script src="${EMBED_ORIGIN}/embed.js" data-agent="${config.id}" async></script>`
}

/** The mount Product help needs: wherever the page wants the button. */
export function guideMount(topic = "Suits"): string {
  return `<minimal-agent-guide data-topic="${topic}"></minimal-agent-guide>`
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
      title: "Body tag",
      where:
        "Copy this line of code into the <body> of every page, or add it to your tag manager.",
      code: scriptTag(config),
    },
  ]
  if (config.surface.searchAssist) {
    snippets.push({
      title: "Search template",
      where:
        "Copy this into your search results template, directly under the search input. Keep data-query equal to what the shopper has typed.",
      code: searchMount(),
    })
  }
  if (config.surface.productHelp.enabled) {
    snippets.push({
      title: "Category or product page",
      where:
        "Copy this wherever you want the button, for example above a category grid. Set data-topic to what the page is about.",
      code: guideMount(),
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
  if (config.surface.productHelp.enabled) {
    lines.push(
      "",
      `${config.surface.searchAssist ? "3" : "2"}. Product help: wherever the page should offer a guided choice (above a category grid, on a product page), add`,
      "",
      `   ${guideMount()}`,
      "",
      "   with data-topic set to what that page is about. The script draws the button into it; leave the element empty.",
    )
  }
  const verifyStep =
    1 +
    (config.surface.searchAssist ? 1 : 0) +
    (config.surface.productHelp.enabled ? 1 : 0) +
    1
  lines.push(
    "",
    `${verifyStep}. Verify: open the site, confirm the chat button appears bottom ${(config.surface.position ?? "bottom-right").replace("bottom-", "")}, and that no console errors mention [minimal-agent].`,
    "",
    "Do not change the site's own styles for the agent; it carries its own.",
  )
  return lines.join("\n")
}
