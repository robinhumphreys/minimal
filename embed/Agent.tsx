import * as React from "react"
import { createPortal } from "react-dom"
import { useChat } from "@ai-sdk/react"
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai"

import { answerViewCart } from "@/lib/agent/cart"
import type { AgentUIMessage } from "@/lib/agent/types"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import type { AgentConfig } from "@/lib/config/schema"

import { GuideOverlay, GuideTrigger } from "./product-help"
import { SearchPanel } from "./search-assist"
import { SiteChatLayer, type ChatDriver } from "./site-chat"
import { themeStyle } from "./theme"

export type OpenOptions = { prompt?: string }

/** Set by the mounted Agent so surfaces can reach it without threading refs through the mounts. */
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
  touched: boolean
  /** An answer was still arriving when this was written. */
  pending: boolean
}

/**
 * The embed remounts on every page, so the transcript lives in
 * `sessionStorage` rather than component state.
 */
function sessionKey(id: string) {
  return `minimal-agent:${id}`
}

const EMPTY_SESSION: Session = {
  open: false,
  messages: [],
  touched: false,
  pending: false,
}

function readSession(id: string): Session {
  try {
    const raw = window.sessionStorage.getItem(sessionKey(id))
    if (!raw) return EMPTY_SESSION
    const parsed = JSON.parse(raw) as Partial<Session>
    const messages = Array.isArray(parsed.messages) ? parsed.messages : []
    const pending = parsed.pending === true
    // A reply left mid-stream cannot be sent back to the model as-is, so drop it.
    if (pending) {
      while (messages.at(-1)?.role === "assistant") messages.pop()
    }
    return {
      open: parsed.open === true,
      messages,
      touched: true,
      pending: pending && messages.at(-1)?.role === "user",
    }
  } catch {
    return EMPTY_SESSION
  }
}

function writeSession(id: string, session: Session) {
  try {
    window.sessionStorage.setItem(sessionKey(id), JSON.stringify(session))
  } catch {
    // Storage full or blocked; the conversation just does not follow.
  }
}

/**
 * Set on <html> while Search assist is on: the site marks its "Ask about …"
 * row `data-search-assist-only`, and the stylesheet hides it otherwise.
 */
const SEARCH_ASSIST_ATTR = "data-minimal-search-assist"

function useHostDom() {
  const [host, setHost] = React.useState<{
    bar: HTMLElement | null
    recommendations: HTMLElement[]
    search: { element: HTMLElement; query: string } | null
    guides: { element: HTMLElement; topic: string; label: string }[]
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
          // Read once before the button replaces the tag's own content.
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
      // The search mount reports the query by attribute change, not remount.
      attributes: true,
      attributeFilter: ["data-query", "data-topic"],
    })
    return () => observer.disconnect()
  }, [])

  return host
}

function usePhone() {
  const [phone, setPhone] = React.useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(max-width: 640px)").matches,
  )
  React.useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)")
    const onChange = () => setPhone(query.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])
  return phone
}

function offPage(config: AgentConfig): boolean {
  const path = window.location.pathname
  return config.surface.hiddenPaths.some((prefix) => path.startsWith(prefix))
}

/** Matches `/{brand}/product/{slug}` on either storefront. */
function onProductPage(): boolean {
  return /\/product\//.test(window.location.pathname)
}

export function Agent({ config }: { config: AgentConfig }) {
  const [session] = React.useState(() => readSession(config.id))
  // A prior open/close decision wins; otherwise the merchant's product-page default applies.
  const [open, setOpen] = React.useState(
    () =>
      session.open ||
      (!session.touched &&
        config.surface.openOnProductPages &&
        onProductPage()),
  )
  const host = useHostDom()

  // The site's search sheet offers "Ask about …" only when there is an agent
  // here to answer it; see SEARCH_ASSIST_ATTR.
  const searchAssist = config.surface.searchAssist
  React.useLayoutEffect(() => {
    if (!searchAssist) return
    document.documentElement.setAttribute(SEARCH_ASSIST_ATTR, "")
    return () => document.documentElement.removeAttribute(SEARCH_ASSIST_ATTR)
  }, [searchAssist])

  const transport = React.useMemo(
    () => new DefaultChatTransport({ api: `/api/agents/${config.id}/chat` }),
    [config.id],
  )
  // Sent per request, not per transport, so admin-preview edits and the
  // current page apply without tearing down the conversation.
  const behaviour = config.behaviour
  const requestBody = React.useCallback(
    () => ({ behaviour, page: window.location.pathname }),
    [behaviour],
  )
  // Read when the cart tool answers, after the render requestBody arrived in.
  const bodyRef = React.useRef(requestBody)
  React.useEffect(() => {
    bodyRef.current = requestBody
  }, [requestBody])

  const {
    messages,
    sendMessage,
    addToolOutput,
    status,
    error,
    stop,
    regenerate,
  } = useChat<AgentUIMessage>({
    id: sessionKey(config.id),
    transport,
    messages: session.messages,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall({ toolCall }) {
      answerViewCart(toolCall, addToolOutput, bodyRef.current())
    },
  })

  const send = React.useCallback(
    (text: string) => void sendMessage({ text }, { body: requestBody() }),
    [sendMessage, requestBody],
  )

  const busy = status === "submitted" || status === "streaming"
  React.useEffect(() => {
    writeSession(config.id, {
      open,
      messages,
      touched: true,
      pending: busy,
    })
  }, [config.id, open, messages, busy])

  // Written synchronously because navigation may not wait for the effect above.
  const leave = () => {
    setOpen(false)
    writeSession(config.id, {
      open: false,
      messages,
      touched: true,
      pending: busy,
    })
  }

  // Resumes a question left mid-answer when a card was followed to this page.
  const resumed = React.useRef(false)
  React.useEffect(() => {
    if (!session.pending || resumed.current) return
    resumed.current = true
    void regenerate({ body: requestBody() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openWith = React.useCallback(
    (options?: OpenOptions) => {
      setOpen(true)
      if (options?.prompt) send(options.prompt)
    },
    [send],
  )

  // A merchant's own button can open a guide too, via `data-minimal-guide="Topic"`.
  const [guide, setGuide] = React.useState<string | null>(null)
  const phone = usePhone()
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
          onLeave={leave}
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

      {/* Search opens inside a host dialog, so it skips the launcher's step-aside rule. */}
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
          config={config}
          topic={guide}
          open
          onClose={() => setGuide(null)}
          placement={phone ? "sheet" : "side"}
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

      {/* Other entries open into the same window the launcher surface draws. */}
      {config.surface.entry !== "launcher" && open ? (
        <SiteChatLayer
          mode="fixed"
          config={config}
          chat={chat}
          open={open}
          onOpenChange={setOpen}
          onLeave={leave}
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
      className="minimal-agent-root ma:flex ma:gap-2 ma:p-4"
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
      className="minimal-agent-root ma:flex ma:flex-col ma:gap-2 ma:border ma:p-4"
      style={style}
    >
      <p className="ma:text-sm">Not sure this is the one?</p>
      <Button onClick={() => onOpen(`What goes well with ${product}?`)}>
        Find something similar
      </Button>
    </div>
  )
}
