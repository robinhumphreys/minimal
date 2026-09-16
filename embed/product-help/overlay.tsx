import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ArrowUpIcon, RotateCcwIcon, XIcon } from "lucide-react"
import { cn } from "cn"

import type { AgentUIMessage } from "@/lib/agent/types"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
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
  container?: React.RefObject<HTMLElement | null>
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
        className={cn(
          "minimal-agent-root font-sans text-foreground",
          placement === "side"
            ? "sm:[--drawer-content-width:30rem]!"
            : "[--drawer-content-height:calc(100dvh-3rem)] [--drawer-content-max-height:calc(100dvh-3rem)]",
        )}
        style={themeStyle(config.theme)}
      >
        <MessageScrollerProvider>
          <FollowEnd count={messages.length} status={status} />
          <DrawerHeader className="flex-row items-center justify-between border-b border-border p-4 text-left">
            <DrawerTitle
              className="text-sm"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {name}
            </DrawerTitle>
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
              <DrawerClose
                render={<Button size="icon-sm" variant="ghost" />}
                aria-label="Close"
              >
                <XIcon />
              </DrawerClose>
            </div>
          </DrawerHeader>

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
