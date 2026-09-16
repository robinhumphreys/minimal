import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { isBrandId, type BrandId } from "@/lib/catalog/types"
import { agentConfigSchema, type AgentConfig } from "@/lib/config/schema"
import { publishedKey, readPublishedOrDefault } from "@/lib/config/storage"

import { Agent, bus, type OpenOptions } from "./Agent"

declare global {
  interface Window {
    MinimalAgent?: { open: (options?: OpenOptions) => void }
  }
}

function resolveScript(): HTMLScriptElement | null {
  const current = document.currentScript
  if (current instanceof HTMLScriptElement && current.dataset.agent) {
    return current
  }
  return document.querySelector<HTMLScriptElement>("script[data-agent]")
}

function injectStylesheet(src: string) {
  const href = new URL(src, window.location.href).href.replace(
    /embed\.js.*$/,
    "embed.css",
  )
  if (document.querySelector(`link[href="${href}"]`)) return

  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = href
  document.head.appendChild(link)
}

function start() {
  // The admin's onboarding shows the site as it was before the agent, in an
  // iframe. The one thing that page must not have is the agent.
  if (
    new URLSearchParams(window.location.search).get("minimal-agent") === "off"
  ) {
    return
  }

  const script = resolveScript()
  const id = script?.dataset.agent
  if (!id || !isBrandId(id)) {
    console.warn("[minimal-agent] missing or unknown data-agent", id)
    return
  }
  const agentId: BrandId = id

  injectStylesheet(script?.src ?? "/embed.js")

  const host = document.createElement("div")
  host.id = "minimal-agent-host"
  document.body.appendChild(host)
  const root = createRoot(host)

  const render = (config: AgentConfig) => {
    root.render(
      <StrictMode>
        <Agent config={config} />
      </StrictMode>,
    )
  }

  render(readPublishedOrDefault(agentId))

  // Another tab published a change.
  window.addEventListener("storage", (event) => {
    if (event.key !== publishedKey(agentId)) return
    render(readPublishedOrDefault(agentId))
  })

  // The admin is previewing an unpublished draft in an iframe.
  window.addEventListener("message", (event: MessageEvent) => {
    const data = event.data as { type?: string; config?: unknown } | null
    if (!data || data.type !== "minimal:preview") return

    const parsed = agentConfigSchema.safeParse(data.config)
    if (!parsed.success || parsed.data.id !== agentId) return
    render(parsed.data)
  })

  window.MinimalAgent = { open: (options) => bus.open(options) }
}

try {
  start()
} catch (error) {
  console.error("[minimal-agent] failed to mount", error)
}
