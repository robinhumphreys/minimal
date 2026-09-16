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
  return `<minimal-agent-search data-query="{{ submitted_query }}"></minimal-agent-search>`
}

export type SnippetKey = "script" | "search" | "guide"

export type Snippet = {
  key: SnippetKey
  title: string
  where: string
  code: string
}

/** What to paste, one block per thing the merchant switched on. */
export function snippetsFor(config: AgentConfig): Snippet[] {
  const snippets: Snippet[] = [
    {
      key: "script",
      title: "Body tag",
      where: "In the <body> of every page, or your tag manager.",
      code: scriptTag(config),
    },
  ]
  if (config.surface.searchAssist) {
    snippets.push({
      key: "search",
      title: "Search template",
      where:
        "Under the search input in your results template. Set data-query to the submitted search.",
      code: searchMount(),
    })
  }
  if (config.surface.productHelp.enabled) {
    snippets.push({
      key: "guide",
      title: "Category or product page",
      where: "Wherever the button should go. Set data-topic to the page's subject.",
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
      "   and set the data-query attribute to the search when the shopper submits it (Enter or the search button), emptying it when they start a new search. Add data-native-search to the search input's row and to the site's own results: the agent hides them while it has an answer, replacing the input with the shopper's words as the first message and a composer for what comes next, and they return untouched if the script is absent.",
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
