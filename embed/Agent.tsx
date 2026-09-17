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
  /**
   * An answer was still arriving when this was written. A page that loads
   * from such a session has a question with no complete answer behind it.
   */
  pending: boolean
}

/**
 * The conversation follows the shopper across pages. A product card is a real
 * link to a real page, and the embed remounts on every one, so the transcript
 * lives in `sessionStorage` for the tab — gone when the tab is, which is the
 * lifetime a shop visit has anyway.
 *
 * Written on every change, mid-answer included: the cards arrive before the
 * sentence that goes with them, and a shopper who clicks one straight away
 * is the common case, not the edge.
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
    // A reply the page left in the middle of — a sentence cut short, a tool
    // call with no result — is not worth keeping and cannot be sent back to
    // the model as it is. Drop it; the question stays, and gets asked again.
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
 * Set on <html> while Search assist is on. The site marks anything that only
 * makes sense with an agent behind the search box, such as an "Ask about …"
 * row, with `data-search-assist-only`; the stylesheet hides it otherwise.
 */
const SEARCH_ASSIST_ATTR = "data-minimal-search-assist"

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

/** A phone-sized viewport: the guide comes up from the bottom rather than the side. */
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
  // Sent per request rather than per transport so edits in the admin preview
  // take effect without tearing down the conversation, and so the page is
  // the one the shopper is on now: the conversation follows them across
  // pages, and "this" means whatever is under the window at the time.
  const behaviour = config.behaviour
  const requestBody = React.useCallback(
    () => ({ behaviour, page: window.location.pathname }),
    [behaviour],
  )
  // Read when the cart tool answers, which is after the render the latest
  // behaviour arrived in, so an effect is early enough.
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
    // The cart is read from the page, then the answer carries on by itself.
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

  // A link followed out of a full-screen window: the page is about to go, so
  // the session is written closed here and now rather than left to the effect
  // above, which the navigation may or may not wait for. The conversation
  // itself stays; the launcher brings it back on the next page.
  const leave = () => {
    setOpen(false)
    writeSession(config.id, {
      open: false,
      messages,
      touched: true,
      pending: busy,
    })
  }

  // Picked up mid-answer: the shopper asked, followed a card before the
  // reply had finished, and is now on the next page waiting for it. Ask
  // again on their behalf, once.
  const resumed = React.useRef(false)
  React.useEffect(() => {
    if (!session.pending || resumed.current) return
    resumed.current = true
    void regenerate({ body: requestBody() })
    // Once, on mount: the session is read then, and nothing after changes it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

      {/* The window is only ever drawn by the launcher surface; the other
          entries open into the same one. */}
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
