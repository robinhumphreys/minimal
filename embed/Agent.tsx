import * as React from "react"
import { createPortal } from "react-dom"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

import type { AgentConfig, Theme } from "@/lib/config/schema"

import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { ScrollArea } from "./components/ui/scroll-area"

export type OpenOptions = { prompt?: string }

/**
 * Set by the mounted Agent so `window.MinimalAgent.open()` and the surfaces can
 * reach the drawer without threading a ref through the mount points.
 */
export const bus: { open: (options?: OpenOptions) => void } = {
  open: () => {},
}

function themeStyle(theme: Theme): React.CSSProperties {
  return {
    "--primary": theme.accent,
    "--ring": theme.accent,
    "--background": theme.surface,
    "--radius": theme.radius,
    "--font-sans": theme.fontBody,
    "--font-display": theme.fontDisplay,
    "--minimal-density": theme.density,
  } as React.CSSProperties
}

const POSITION_CLASS = {
  "bottom-right": "right-4 bottom-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  "bottom-left": "bottom-4 left-4",
} as const

/** Re-queries mount elements whenever the host page's DOM changes. */
function useMountTargets() {
  const [targets, setTargets] = React.useState<{
    bar: HTMLElement | null
    recommendations: HTMLElement[]
  }>({ bar: null, recommendations: [] })

  React.useEffect(() => {
    const scan = () => {
      setTargets((previous) => {
        const bar = document.querySelector<HTMLElement>("minimal-agent-bar")
        const recommendations = Array.from(
          document.querySelectorAll<HTMLElement>(
            "minimal-agent-recommendations",
          ),
        )
        const unchanged =
          previous.bar === bar &&
          previous.recommendations.length === recommendations.length &&
          previous.recommendations.every((el, i) => el === recommendations[i])
        return unchanged ? previous : { bar, recommendations }
      })
    }

    scan()
    const observer = new MutationObserver(scan)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return targets
}

export function Agent({ config }: { config: AgentConfig }) {
  const [open, setOpen] = React.useState(false)
  const style = themeStyle(config.theme)
  const targets = useMountTargets()

  const transport = React.useMemo(
    () => new DefaultChatTransport({ api: `/api/agents/${config.id}/chat` }),
    [config.id],
  )
  const { messages, sendMessage, status } = useChat({ transport })

  // Sent per request rather than per transport so edits in the admin preview
  // take effect without tearing down the conversation.
  const behaviour = config.behaviour
  const send = React.useCallback(
    (text: string) => sendMessage({ text }, { body: { behaviour } }),
    [sendMessage, behaviour],
  )

  const openWith = React.useCallback(
    (options?: OpenOptions) => {
      setOpen(true)
      if (options?.prompt) send(options.prompt)
    },
    [send],
  )

  React.useEffect(() => {
    bus.open = openWith
    return () => {
      bus.open = () => {}
    }
  }, [openWith])

  return (
    <>
      {config.surface.entry === "launcher" ? (
        <Launcher
          style={style}
          position={config.surface.position ?? "bottom-right"}
          onOpen={() => openWith()}
        />
      ) : null}

      {config.surface.entry === "bar" && targets.bar
        ? createPortal(
            <Bar style={style} onSubmit={(text) => openWith({ prompt: text })} />,
            targets.bar,
          )
        : null}

      {targets.recommendations.map((target, index) =>
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

      {open ? (
        <Drawer
          style={style}
          config={config}
          messages={messages}
          status={status}
          onSend={send}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  )
}

function Launcher({
  style,
  position,
  onOpen,
}: {
  style: React.CSSProperties
  position: keyof typeof POSITION_CLASS
  onOpen: () => void
}) {
  return (
    <div
      className={`minimal-agent-root fixed z-[2147483000] ${POSITION_CLASS[position]}`}
      style={style}
    >
      <Button onClick={onOpen}>Ask</Button>
    </div>
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

type ChatMessages = ReturnType<typeof useChat>["messages"]
type ChatStatus = ReturnType<typeof useChat>["status"]

function Drawer({
  style,
  config,
  messages,
  status,
  onSend,
  onClose,
}: {
  style: React.CSSProperties
  config: AgentConfig
  messages: ChatMessages
  status: ChatStatus
  onSend: (text: string) => void
  onClose: () => void
}) {
  const [value, setValue] = React.useState("")

  return (
    <div
      className="minimal-agent-root fixed right-4 bottom-4 z-[2147483001] flex h-[32rem] w-96 max-w-[calc(100vw-2rem)] flex-col border bg-background text-foreground"
      style={style}
    >
      <div className="flex items-center justify-between border-b p-3">
        <span className="text-sm">{config.name}</span>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-3 p-3">
          <p className="text-sm">{config.behaviour.greeting}</p>

          {messages.length === 0 ? (
            <div className="flex flex-col gap-1">
              {config.behaviour.starterPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  onClick={() => onSend(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          ) : null}

          {messages.map((message) => (
            <div key={message.id} className="text-sm">
              <span className="text-muted-foreground">
                {message.role === "user" ? "You: " : "Agent: "}
              </span>
              {message.parts.map((part, index) =>
                part.type === "text" ? (
                  <span key={index} className="whitespace-pre-wrap">
                    {part.text}
                  </span>
                ) : null,
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <form
        className="flex gap-2 border-t p-3"
        onSubmit={(event) => {
          event.preventDefault()
          if (!value.trim()) return
          onSend(value)
          setValue("")
        }}
      >
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ask a question"
        />
        <Button type="submit" disabled={status !== "ready"}>
          Send
        </Button>
      </form>
    </div>
  )
}
