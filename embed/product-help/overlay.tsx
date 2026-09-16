import * as React from "react"
import { useChat } from "@ai-sdk/react"
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai"
import { ArrowUpIcon, RotateCcwIcon, XIcon } from "lucide-react"
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "../ui/input-group"
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

import { ProductCard } from "../site-chat/products"
import { Working } from "../site-chat/thinking"
import { themeStyle } from "../theme"

/** What the guide opens with. Never shown; it only gets the first question asked. */
const KICKOFF = "Begin."

/** A side panel on a wide screen, a sheet from the bottom on a phone. */
export type GuidePlacement = "side" | "sheet"

/**
 * Product help: the guide itself, in a drawer over the page.
 *
 * Not the site chat in a different place. There is no launcher, no small
 * talk and no open question: the agent asks, the shopper taps, and the guide
 * ends on a product. The drawer is the shadcn one on Base UI: it slides in
 * from the side on a wide screen and up from the bottom on a phone, and can
 * be swiped away either way. Start over clears it and asks again.
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
  /** Where the drawer mounts: the document on a site, the preview in the admin. */
  container?: HTMLElement | React.RefObject<HTMLElement | null> | null
}) {
  const transport = React.useMemo(
    () => new DefaultChatTransport({ api: `/api/agents/${config.id}/chat` }),
    [config.id],
  )
  const behaviour = config.behaviour
  const productHelp = config.surface.productHelp
  // The page is the one the guide opened on; a guide does not outlive it.
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
  // Read when the cart tool answers, which is after the render the latest
  // body arrived in, so an effect is early enough.
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
    // The cart is read from the page, then the guide carries on by itself.
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

  const busy = status === "submitted" || status === "streaming"
  const name = config.identity.assistantName.trim() || config.name
  const shown = messages.filter((message) => !message.metadata?.hidden)
  const last = messages.at(-1)

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
        // The drawer mounts outside the embed's own root, so the theme has to
        // travel with it: this is the root for everything inside.
        // Floating, not flush: a margin all round and every corner rounded,
        // the way the shadcn drawer is shown. `--drawer-inset` is the
        // primitive's own knob for the margin; the corners it rounds only on
        // the leading edge, so they are set here for all four.
        className={cn(
          // The primitive paints a "bleed" past its leading edge for overscroll;
          // inset from the edge, that bleed would show in the margin.
          "minimal-agent-root ma:rounded-2xl! ma:border! ma:font-sans ma:text-foreground ma:shadow-2xl ma:after:hidden!",
          placement === "side"
            ? "ma:[--drawer-inset:1rem] ma:sm:[--drawer-content-width:30rem]!"
            : "ma:[--drawer-content-height:calc(100dvh-4.5rem)] ma:[--drawer-content-max-height:calc(100dvh-4.5rem)] ma:[--drawer-inset:0.75rem]",
        )}
        style={themeStyle(config.theme)}
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

                {/* Waiting is one state from the send to the first thing
                    worth showing. The reply exists, empty, before its first
                    part has arrived; the dots stay until it has. */}
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

          <Composer
            busy={busy}
            placeholder={behaviour.placeholders.guide}
            onSend={(text) => send(text)}
            onStop={() => void stop()}
          />
        </MessageScrollerProvider>
      </DrawerContent>
    </Drawer>
  )
}

/** Whether a reply has anything on screen yet. */
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
        {message.parts.map((part, index) => {
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
      className="ma:shrink-0 ma:border-t ma:border-border ma:p-3"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <InputGroup className="ma:rounded-[calc(var(--radius)+0.25rem)] ma:border-transparent ma:bg-muted ma:ring-inset">
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
          className="ma:max-h-28 ma:min-h-12 ma:px-3 ma:py-2.5 ma:text-base ma:md:text-sm"
        />
        <InputGroupAddon align="block-end" className="ma:px-2 ma:pb-2">
          {busy ? (
            <InputGroupButton
              type="button"
              variant="default"
              size="icon-sm"
              onClick={onStop}
              aria-label="Stop"
              className="ma:ml-auto"
            >
              <span className="ma:size-3 ma:rounded-[2px] ma:bg-current" />
            </InputGroupButton>
          ) : (
            <InputGroupButton
              type="submit"
              variant="default"
              size="icon-sm"
              disabled={draft.trim().length === 0}
              aria-label="Send"
              className="ma:ml-auto"
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
