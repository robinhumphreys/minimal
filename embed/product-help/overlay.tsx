import * as React from "react"
import { useChat } from "@ai-sdk/react"
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai"
import { RotateCcwIcon, XIcon } from "lucide-react"
import { cn } from "../cn"

import { answerViewCart } from "@/lib/agent/cart"
import type { AgentUIMessage } from "@/lib/agent/types"
import { Bubble, BubbleContent } from "../ui/bubble"
import { Button } from "../ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer"
import { Message, MessageContent } from "../ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "../ui/message-scroller"
import type { AgentConfig } from "@/lib/config/schema"
import { useVisualViewport, visualViewportStyle } from "@/lib/visual-viewport"

import { ProductCard } from "../site-chat/products"
import { Working } from "../site-chat/thinking"
import { Composer } from "../site-chat/window"
import { themeStyle } from "../theme"

/** Never shown; only triggers the first question. */
const KICKOFF = "Begin."

export type GuidePlacement = "side" | "sheet"

/**
 * Unlike the site chat, there is no launcher or small talk: the agent asks,
 * the shopper taps, and the guide ends on a product. On a phone it takes the
 * whole screen, like the site chat does.
 */
export function GuideOverlay({
  config,
  topic,
  open,
  onClose,
  placement,
  container,
}: {
  config: AgentConfig
  topic: string
  open: boolean
  onClose: () => void
  placement: GuidePlacement
  container?: HTMLElement | React.RefObject<HTMLElement | null> | null
}) {
  const transport = React.useMemo(
    () => new DefaultChatTransport({ api: `/api/agents/${config.id}/chat` }),
    [config.id],
  )
  const behaviour = config.behaviour
  const productHelp = config.surface.productHelp
  const body = React.useMemo(
    () => ({
      behaviour,
      mode: "guide",
      topic,
      productHelp,
      page: window.location.pathname,
    }),
    [behaviour, topic, productHelp],
  )
  // Read when the cart tool answers, after the render body arrived in.
  const bodyRef = React.useRef(body)
  React.useEffect(() => {
    bodyRef.current = body
  }, [body])

  const {
    messages,
    sendMessage,
    setMessages,
    addToolOutput,
    status,
    error,
    stop,
    regenerate,
  } = useChat<AgentUIMessage>({
    transport,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall({ toolCall }) {
      answerViewCart(toolCall, addToolOutput, bodyRef.current)
    },
  })
  const send = React.useCallback(
    (text: string, hidden = false) =>
      void sendMessage(
        { text, metadata: hidden ? { hidden: true } : undefined },
        { body },
      ),
    [sendMessage, body],
  )

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

  const busy = status === "submitted" || status === "streaming"
  const name = config.identity.assistantName.trim() || config.name
  const shown = messages.filter((message) => !message.metadata?.hidden)
  const last = messages.at(-1)

  // On a phone the sheet is the screen, so it follows the visual viewport
  // and the keyboard shortens it rather than covering the composer. Not in
  // the admin's preview, where the drawer lives in a box of its own. The
  // drawer is modal, so Base UI holds the page still underneath.
  const screen = useVisualViewport(placement === "sheet" && open && !container)

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
      swipeDirection={placement === "sheet" ? "down" : productHelp.side}
      showSwipeHandle={placement === "sheet"}
    >
      <DrawerContent
        container={container}
        data-slot="product-help"
        aria-label={`${name} guide`}
        className={cn(
          // The primitive's "bleed" past its leading edge, for overscroll,
          // would show in the margin once inset from the edge; hide it.
          "minimal-agent-root ma:font-sans ma:text-foreground ma:shadow-2xl ma:after:hidden!",
          placement === "side"
            ? // Floating, not flush: a margin all round and every corner
              // rounded, the way the shadcn drawer is shown. `--drawer-inset`
              // is the primitive's own knob for the margin; the corners it
              // rounds only on the leading edge, so they are set here for
              // all four.
              "ma:rounded-2xl! ma:border! ma:[--drawer-inset:1rem] ma:sm:[--drawer-content-width:30rem]!"
            : // The whole screen, like the site chat: a floating card at
              // that size is a keyhole. Top to bottom until the visual
              // viewport has been measured, then whatever it says.
              "ma:top-0 ma:max-h-none! ma:rounded-none! ma:border-0! ma:[--drawer-content-height:100dvh]! ma:[--drawer-inset:0px]",
        )}
        style={{ ...themeStyle(config.theme), ...visualViewportStyle(screen) }}
      >
        <MessageScrollerProvider>
          <FollowEnd count={messages.length} status={status} />
          <DrawerHeader className="ma:flex-row ma:items-center ma:justify-between ma:border-b ma:border-border ma:p-4 ma:text-left">
            <DrawerTitle
              className="ma:text-sm"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {name}
            </DrawerTitle>
            <div className="ma:flex ma:items-center ma:gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={startOver}
                className="ma:text-muted-foreground"
              >
                <RotateCcwIcon />
                Start over
              </Button>
              <DrawerClose
                render={<Button size="icon-sm" variant="ghost" />}
                aria-label="Close"
              >
                <XIcon />
              </DrawerClose>
            </div>
          </DrawerHeader>

          <MessageScroller className="ma:flex-1">
            <MessageScrollerViewport>
              <MessageScrollerContent className="ma:gap-4 ma:p-4">
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

                {/* Covers the gap between send and the reply's first visible part. */}
                {status === "submitted" ||
                (status === "streaming" &&
                  last?.role === "assistant" &&
                  !hasVisibleParts(last)) ? (
                  <MessageScrollerItem>
                    <Message>
                      <MessageContent>
                        <Bubble variant="muted">
                          <BubbleContent className="ma:flex ma:h-9 ma:items-center ma:px-3.5 ma:text-muted-foreground">
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
                          <BubbleContent className="ma:text-muted-foreground">
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

          <div className="ma:shrink-0 ma:border-t ma:border-border ma:p-3">
            <Composer
              busy={busy}
              placeholder={behaviour.placeholders.guide}
              onSend={(text) => send(text)}
              onStop={() => void stop()}
            />
          </div>
        </MessageScrollerProvider>
      </DrawerContent>
    </Drawer>
  )
}

function hasVisibleParts(message: AgentUIMessage): boolean {
  return message.parts.some(
    (part) =>
      (part.type === "text" && part.text.trim().length > 0) ||
      (part.type === "tool-askChoice" &&
        (part.state === "input-available" ||
          part.state === "output-available")) ||
      part.type === "tool-showProducts",
  )
}

function Turn({
  message,
  config,
  current,
  onChoose,
}: {
  message: AgentUIMessage
  config: AgentConfig
  /** True for the latest message, whose answers can still be tapped. */
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
            <BubbleContent className="ma:whitespace-pre-wrap">
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
        {withoutRepeatedQuestion(message.parts).map((part, index) => {
          if (part.type === "text") {
            if (part.text.trim().length === 0) return null
            return (
              <Bubble key={index} variant="muted">
                <BubbleContent className="ma:whitespace-pre-wrap">
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
                  <div className="ma:flex ma:flex-wrap ma:gap-2">
                    {part.input.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => onChoose(option)}
                        className="ma:cursor-pointer ma:rounded-(--radius) ma:border ma:border-border ma:bg-card ma:px-3 ma:py-2 ma:text-sm ma:text-foreground ma:outline-none ma:hover:bg-muted ma:focus-visible:ring-3 ma:focus-visible:ring-ring/50"
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
                <div key={index} className="ma:grid ma:grid-cols-2 ma:gap-2">
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
                <BubbleContent className="ma:text-muted-foreground">
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

/**
 * The model sometimes writes its question as text and then passes the same
 * question to askChoice. Only the askChoice copy gets the answer buttons, so
 * strip the question from any text that precedes it.
 */
function withoutRepeatedQuestion(
  parts: AgentUIMessage["parts"],
): AgentUIMessage["parts"] {
  const questions = parts.flatMap((part) =>
    part.type === "tool-askChoice" &&
    (part.state === "input-available" || part.state === "output-available")
      ? [part.input.question.trim()]
      : [],
  )
  if (questions.length === 0) return parts

  return parts.flatMap((part): AgentUIMessage["parts"] => {
    if (part.type !== "text") return [part]
    const text = part.text.trim()
    const lower = text.toLowerCase()
    const repeated = questions.find(
      (question) =>
        question.length > 0 && lower.endsWith(question.toLowerCase()),
    )
    if (!repeated) return [part]
    const kept = text.slice(0, text.length - repeated.length).trim()
    return kept.length > 0 ? [{ ...part, text: kept }] : []
  })
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

/** Keeps the newest question in view as it arrives, and as the keyboard comes up. */
function FollowEnd({ count, status }: { count: number; status: string }) {
  const { scrollToEnd } = useMessageScroller()
  React.useEffect(() => {
    scrollToEnd({ behavior: "smooth" })
  }, [count, status, scrollToEnd])
  React.useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return
    const follow = () => scrollToEnd({ behavior: "instant" })
    viewport.addEventListener("resize", follow)
    return () => viewport.removeEventListener("resize", follow)
  }, [scrollToEnd])
  return null
}
