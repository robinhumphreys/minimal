import * as React from "react"
import { createPortal } from "react-dom"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

import type { AgentUIMessage } from "@/lib/agent/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { AgentConfig } from "@/lib/config/schema"

import { GuideOverlay, GuideTrigger } from "./product-help"
import { SearchPanel } from "./search-assist"
import { SiteChatLayer, type ChatDriver } from "./site-chat"
import { themeStyle } from "./theme"

export type OpenOptions = { prompt?: string }

/**
 * Set by the mounted Agent so `window.MinimalAgent` and the surfaces can
 * reach the window and the guide without threading refs through the mounts.
 */
export const bus: {
  open: (options?: OpenOptions) => void
  guide: (topic: string) => void
} = {
  open: () => {},
  guide: () => {},
}

type Session = {
  open: boolean
  messages: AgentUIMessage[]
  /** Whether anything has been stored yet: a session that exists is a shopper who has decided. */
  touched: boolean
}

/**
 * The conversation follows the shopper across pages. A product card is a real
 * link to a real page, and the embed remounts on every one, so the transcript
 * lives in `sessionStorage` for the tab — gone when the tab is, which is the
 * lifetime a shop visit has anyway.
 */
function sessionKey(id: string) {
  return `minimal-agent:${id}`
}

function readSession(id: string): Session {
  try {
    const raw = window.sessionStorage.getItem(sessionKey(id))
    if (!raw) return { open: false, messages: [], touched: false }
    const parsed = JSON.parse(raw) as Partial<Session>
    const messages = Array.isArray(parsed.messages) ? parsed.messages : []
    // A question that never got its answer — the tab was left mid-request, or
    // the request failed — would come back as a loose end with no retry
    // behind it. Drop it; the shopper can ask again.
    while (messages.at(-1)?.role === "user") messages.pop()
    return { open: parsed.open === true, messages, touched: true }
  } catch {
    return { open: false, messages: [], touched: false }
  }
}

function writeSession(id: string, session: Session) {
  try {
    window.sessionStorage.setItem(sessionKey(id), JSON.stringify(session))
  } catch {
    // Storage full or blocked; the conversation just does not follow.
  }
}

/** Re-queries the host page's DOM whenever it changes. */
function useHostDom() {
  const [host, setHost] = React.useState<{
    bar: HTMLElement | null
    recommendations: HTMLElement[]
    /** The site's search box, and what has been typed into it. */
    search: { element: HTMLElement; query: string } | null
    /** Where the page wants a Product help button, and what for. */
    guides: { element: HTMLElement; topic: string; label: string }[]
    /** The host has a modal of its own open. */
    dialogOpen: boolean
  }>({
    bar: null,
    recommendations: [],
    search: null,
    guides: [],
    dialogOpen: false,
  })

  React.useEffect(() => {
    const own = document.getElementById("minimal-agent-host")

    const scan = () => {
      setHost((previous) => {
        const bar = document.querySelector<HTMLElement>("minimal-agent-bar")
        const recommendations = Array.from(
          document.querySelectorAll<HTMLElement>(
            "minimal-agent-recommendations",
          ),
        )
        const searchElement = document.querySelector<HTMLElement>(
          "minimal-agent-search",
        )
        const search = searchElement
          ? { element: searchElement, query: searchElement.dataset.query ?? "" }
          : null
        const guides = Array.from(
          document.querySelectorAll<HTMLElement>("minimal-agent-guide"),
        ).map((element) => ({
          element,
          topic: element.dataset.topic ?? "",
          // The merchant's own words inside the tag, read once before the
          // button replaces them.
          label: element.dataset.label ?? element.textContent?.trim() ?? "",
        }))
        const dialogOpen = Array.from(
          document.querySelectorAll('[role="dialog"]'),
        ).some((element) => !own?.contains(element))

        const unchanged =
          previous.bar === bar &&
          previous.dialogOpen === dialogOpen &&
          previous.search?.element === search?.element &&
          previous.search?.query === search?.query &&
          previous.guides.length === guides.length &&
          previous.guides.every((g, i) => g.element === guides[i].element) &&
          previous.recommendations.length === recommendations.length &&
          previous.recommendations.every((el, i) => el === recommendations[i])
        return unchanged
          ? previous
          : { bar, recommendations, search, guides, dialogOpen }
      })
    }

    scan()
    const observer = new MutationObserver(scan)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      // The search mount reports the query by attribute, not by remounting.
      attributes: true,
      attributeFilter: ["data-query", "data-topic"],
    })
    return () => observer.disconnect()
  }, [])

  return host
}

/** Whether the launcher belongs on this page at all. */
function offPage(config: AgentConfig): boolean {
  const path = window.location.pathname
  return config.surface.hiddenPaths.some((prefix) => path.startsWith(prefix))
}

/** A product page, on either storefront: `/{brand}/p/{slug}`. */
function onProductPage(): boolean {
  return /\/p\//.test(window.location.pathname)
}

export function Agent({ config }: { config: AgentConfig }) {
  const [session] = React.useState(() => readSession(config.id))
  // A shopper who has opened or closed the window has decided; before that,
  // the merchant may have asked for it open on product pages.
  const [open, setOpen] = React.useState(
    () =>
      session.open ||
      (!session.touched &&
        config.surface.openOnProductPages &&
        onProductPage()),
  )
  const host = useHostDom()

  const transport = React.useMemo(
    () => new DefaultChatTransport({ api: `/api/agents/${config.id}/chat` }),
    [config.id],
  )
  const { messages, sendMessage, status, error, stop, regenerate } =
    useChat<AgentUIMessage>({
      id: sessionKey(config.id),
      transport,
      messages: session.messages,
    })

  // Sent per request rather than per transport so edits in the admin preview
  // take effect without tearing down the conversation.
  const behaviour = config.behaviour
  const send = React.useCallback(
    (text: string) => void sendMessage({ text }, { body: { behaviour } }),
    [sendMessage, behaviour],
  )

  React.useEffect(() => {
    // Mid-stream transcripts are not worth keeping; the next settled one is.
    if (status === "submitted" || status === "streaming") return
    writeSession(config.id, { open, messages, touched: true })
  }, [config.id, open, messages, status])

  const openWith = React.useCallback(
    (options?: OpenOptions) => {
      setOpen(true)
      if (options?.prompt) send(options.prompt)
    },
    [send],
  )

  // Product help: which guide is open, if any. A merchant's own button can
  // open it too, with `data-minimal-guide="Topic"` on any element.
  const [guide, setGuide] = React.useState<string | null>(null)
  React.useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-minimal-guide]",
      )
      if (!target) return
      event.preventDefault()
      setGuide(target.dataset.minimalGuide || "this")
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  React.useEffect(() => {
    bus.open = openWith
    bus.guide = (topic) => setGuide(topic || "this")
    return () => {
      bus.open = () => {}
      bus.guide = () => {}
    }
  }, [openWith])

  const chat: ChatDriver = {
    messages,
    status,
    error,
    send,
    stop: () => void stop(),
    retry: () => void regenerate(),
  }

  const style = themeStyle(config.theme)

  return (
    <>
      {config.surface.entry === "launcher" && !offPage(config) ? (
        <SiteChatLayer
          mode="fixed"
          config={config}
          chat={chat}
          open={open}
          onOpenChange={setOpen}
          hidden={host.dialogOpen}
        />
      ) : null}

      {config.surface.entry === "bar" && host.bar
        ? createPortal(
            <Bar
              style={style}
              onSubmit={(text) => openWith({ prompt: text })}
            />,
            host.bar,
          )
        : null}

      {/* Search is the one surface that opens inside a host dialog, so it is
          not subject to the step-aside rule the launcher follows. */}
      {config.surface.searchAssist && host.search
        ? createPortal(
            <SearchPanel config={config} query={host.search.query} />,
            host.search.element,
          )
        : null}

      {config.surface.productHelp.enabled
        ? host.guides.map((mount, index) =>
            createPortal(
              <GuideTrigger
                config={config}
                label={mount.label}
                onOpen={() => setGuide(mount.topic || "this")}
              />,
              mount.element,
              `guide-${index}`,
            ),
          )
        : null}

      {config.surface.productHelp.enabled && guide !== null ? (
        <GuideOverlay
          key={guide}
          mode="fixed"
          config={config}
          topic={guide}
          open
          onClose={() => setGuide(null)}
        />
      ) : null}

      {host.recommendations.map((target, index) =>
        createPortal(
          <Recommendations
            style={style}
            product={target.dataset.product ?? ""}
            onOpen={(prompt) => openWith({ prompt })}
          />,
          target,
          `rec-${index}`,
        ),
      )}

      {/* The window is only ever drawn by the launcher surface; the other
          entries open into the same one. */}
      {config.surface.entry !== "launcher" && open ? (
        <SiteChatLayer
          mode="fixed"
          config={config}
          chat={chat}
          open={open}
          onOpenChange={setOpen}
          hidden={host.dialogOpen}
        />
      ) : null}
    </>
  )
}

function Bar({
  style,
  onSubmit,
}: {
  style: React.CSSProperties
  onSubmit: (text: string) => void
}) {
  const [value, setValue] = React.useState("")

  return (
    <form
      className="minimal-agent-root flex gap-2 p-4"
      style={style}
      onSubmit={(event) => {
        event.preventDefault()
        if (!value.trim()) return
        onSubmit(value)
        setValue("")
      }}
    >
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ask about the catalog"
      />
      <Button type="submit">Ask</Button>
    </form>
  )
}

function Recommendations({
  style,
  product,
  onOpen,
}: {
  style: React.CSSProperties
  product: string
  onOpen: (prompt: string) => void
}) {
  return (
    <div
      className="minimal-agent-root flex flex-col gap-2 border p-4"
      style={style}
    >
      <p className="text-sm">Not sure this is the one?</p>
      <Button onClick={() => onOpen(`What goes well with ${product}?`)}>
        Find something similar
      </Button>
    </div>
  )
}
