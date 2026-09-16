import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { RotateCcwIcon, XIcon, ArrowUpIcon } from "lucide-react"
import { cn } from "cn"

import type { AgentUIMessage } from "@/lib/agent/types"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "@/components/ui/message-scroller"
import type { AgentConfig } from "@/lib/config/schema"

import { ProductCard } from "../site-chat/products"
import { Working } from "../site-chat/thinking"
import { themeStyle } from "../theme"

/** What the guide opens with. Never shown; it only gets the first question asked. */
const KICKOFF = "Begin."

/**
 * Product help: the guide itself, in a panel over the page.
 *
 * Not the site chat in a different place. There is no launcher, no small
 * talk and no open question: the agent asks, the shopper taps, and the guide
 * ends on a product. The panel slides in from the side on a wide screen and
 * takes the whole screen on a phone; Start over clears it and asks again.
 */
export function GuideOverlay({
  config,
  topic,
  open,
  onClose,
  mode,
}: {
  config: AgentConfig
  topic: string
  open: boolean
  onClose: () => void
  mode: "fixed" | "absolute"
}) {
  const transport = React.useMemo(
    () => new DefaultChatTransport({ api: `/api/agents/${config.id}/chat` }),
    [config.id],
  )
  const {
    messages,
    sendMessage,
    setMessages,
    status,
    error,
    stop,
    regenerate,
  } = useChat<AgentUIMessage>({ transport })

  const behaviour = config.behaviour
  const productHelp = config.surface.productHelp
  const body = React.useMemo(
    () => ({ behaviour, mode: "guide", topic, productHelp }),
    [behaviour, topic, productHelp],
  )
  const send = React.useCallback(
    (text: string, hidden = false) =>
      void sendMessage(
        { text, metadata: hidden ? { hidden: true } : undefined },
        { body },
      ),
    [sendMessage, body],
  )

  // The first question is asked the moment the guide opens.
  const kicked = React.useRef(false)
  React.useEffect(() => {
    if (!open || kicked.current || messages.length > 0) return
    kicked.current = true
    send(KICKOFF, true)
  }, [open, messages.length, send])

  const startOver = () => {
    void stop()
    setMessages([])
    kicked.current = false
  }

  React.useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  const busy = status === "submitted" || status === "streaming"
  const name = config.identity.assistantName.trim() || config.name
  const shown = messages.filter((message) => !message.metadata?.hidden)
  const last = messages.at(-1)

  return (
    <div
      data-slot="product-help"
      className={cn(
        "minimal-agent-root @container inset-0 font-sans text-foreground",
        mode === "fixed" ? "fixed z-[2147483000]" : "absolute",
      )}
      style={themeStyle(config.theme)}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 animate-in cursor-default bg-black/40 duration-200 fade-in"
      />

      <MessageScrollerProvider>
        <FollowEnd count={messages.length} status={status} />
        <div
          role="dialog"
          aria-label={`${name} guide`}
          className="absolute inset-y-0 right-0 flex w-[30rem] max-w-full animate-in flex-col bg-background shadow-2xl duration-300 slide-in-from-right @max-md:w-full"
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
            <span
              className="text-sm font-medium"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {name}
            </span>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={startOver}
                className="text-muted-foreground"
              >
                <RotateCcwIcon />
                Start over
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={onClose}
                aria-label="Close"
              >
                <XIcon />
              </Button>
            </div>
          </div>

          <MessageScroller className="flex-1">
            <MessageScrollerViewport>
              <MessageScrollerContent className="gap-4 p-4">
                <MessageScrollerItem>
                  <AgentBubble>{productHelp.greeting}</AgentBubble>
                </MessageScrollerItem>

                {shown.map((message) => (
                  <MessageScrollerItem key={message.id}>
                    <Turn
                      message={message}
                      config={config}
                      current={message === last && !busy}
                      onChoose={(option) => send(option)}
                    />
                  </MessageScrollerItem>
                ))}

                {status === "submitted" ? (
                  <MessageScrollerItem>
                    <Message>
                      <MessageContent>
                        <Bubble variant="muted">
                          <BubbleContent className="flex h-9 items-center px-3.5 text-muted-foreground">
                            <Working
                              style={config.theme.thinking}
                              label="Thinking"
                            />
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ) : null}

                {status === "error" ? (
                  <MessageScrollerItem>
                    <Message>
                      <MessageContent>
                        <Bubble variant="muted">
                          <BubbleContent className="text-muted-foreground">
                            {error?.message?.trim() ||
                              "That didn’t go through."}
                          </BubbleContent>
                        </Bubble>
                        <Bubble variant="outline">
                          <BubbleContent
                            render={
                              <button
                                type="button"
                                onClick={() => void regenerate()}
                              />
                            }
                          >
                            Try again
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ) : null}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>

          <Composer
            busy={busy}
            placeholder={behaviour.placeholders.guide}
            onSend={(text) => send(text)}
            onStop={() => void stop()}
          />
        </div>
      </MessageScrollerProvider>
    </div>
  )
}

/** One message of the guide, with its question's answers if it is the live one. */
function Turn({
  message,
  config,
  current,
  onChoose,
}: {
  message: AgentUIMessage
  config: AgentConfig
  /** The latest message: its answers can still be tapped. */
  current: boolean
  onChoose: (option: string) => void
}) {
  if (message.role === "user") {
    const text = message.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join("")
    return (
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="default">
            <BubbleContent className="whitespace-pre-wrap">
              {text}
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    )
  }

  return (
    <Message>
      <MessageContent>
        {message.parts.map((part, index) => {
          if (part.type === "text") {
            if (part.text.trim().length === 0) return null
            return (
              <Bubble key={index} variant="muted">
                <BubbleContent className="whitespace-pre-wrap">
                  {part.text}
                </BubbleContent>
              </Bubble>
            )
          }
          if (part.type === "tool-askChoice") {
            if (
              part.state !== "input-available" &&
              part.state !== "output-available"
            ) {
              return null
            }
            return (
              <React.Fragment key={index}>
                <Bubble variant="muted">
                  <BubbleContent>{part.input.question}</BubbleContent>
                </Bubble>
                {current ? (
                  <div className="flex flex-wrap gap-2">
                    {part.input.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => onChoose(option)}
                        className="cursor-pointer rounded-(--radius) border border-border bg-card px-3 py-2 text-sm text-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : null}
              </React.Fragment>
            )
          }
          if (part.type === "tool-showProducts") {
            if (part.state === "output-available") {
              return (
                <div key={index} className="grid grid-cols-2 gap-2">
                  {part.output.products.map((product) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                      cards={config.surface.cards}
                      layout="column"
                    />
                  ))}
                </div>
              )
            }
            if (part.state === "output-error") return null
            return (
              <Bubble key={index} variant="ghost">
                <BubbleContent className="text-muted-foreground">
                  <Working
                    style={config.theme.thinking}
                    label="Finding products"
                  />
                </BubbleContent>
              </Bubble>
            )
          }
          return null
        })}
      </MessageContent>
    </Message>
  )
}

function AgentBubble({ children }: { children: React.ReactNode }) {
  return (
    <Message>
      <MessageContent>
        <Bubble variant="muted">
          <BubbleContent>{children}</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  )
}

function Composer({
  busy,
  placeholder,
  onSend,
  onStop,
}: {
  busy: boolean
  placeholder: string
  onSend: (text: string) => void
  onStop: () => void
}) {
  const [draft, setDraft] = React.useState("")
  const submit = () => {
    const text = draft.trim()
    if (!text || busy) return
    setDraft("")
    onSend(text)
  }
  return (
    <form
      className="shrink-0 border-t border-border p-3"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <InputGroup className="rounded-[calc(var(--radius)+0.25rem)] border-transparent bg-muted ring-inset">
        <InputGroupTextarea
          placeholder={placeholder}
          rows={1}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              submit()
            }
          }}
          className="max-h-28 min-h-12 px-3 py-2.5 text-base md:text-sm"
        />
        <InputGroupAddon align="block-end" className="px-2 pb-2">
          {busy ? (
            <InputGroupButton
              type="button"
              variant="default"
              size="icon-sm"
              onClick={onStop}
              aria-label="Stop"
              className="ml-auto"
            >
              <span className="size-3 rounded-[2px] bg-current" />
            </InputGroupButton>
          ) : (
            <InputGroupButton
              type="submit"
              variant="default"
              size="icon-sm"
              disabled={draft.trim().length === 0}
              aria-label="Send"
              className="ml-auto"
            >
              <ArrowUpIcon />
            </InputGroupButton>
          )}
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}

/** Keeps the newest question in view as it arrives. */
function FollowEnd({ count, status }: { count: number; status: string }) {
  const { scrollToEnd } = useMessageScroller()
  React.useEffect(() => {
    scrollToEnd({ behavior: "smooth" })
  }, [count, status, scrollToEnd])
  return null
}
