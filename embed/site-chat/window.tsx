import * as React from "react"
import { ArrowUpIcon, SquareIcon, XIcon } from "lucide-react"
import { cn } from "cn"

import type { AgentUIMessage } from "@/lib/agent/types"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Message, MessageContent, MessageGroup } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import type { AgentConfig } from "@/lib/config/schema"

import { ProductCards } from "./products"
import type { ChatDriver } from "./types"

/**
 * The panel the launcher opens.
 *
 * A `Card` rather than a hand-rolled box: the header/content/footer split, the
 * spacing scale and the footer's own surface all come from the design system,
 * which is the difference between a chat window and a div with a border on it.
 * The merchant's accent is spent on the header and the send button only; the
 * rest is mixed from their surface.
 */
export function ChatWindow({
  config,
  chat,
  onClose,
  className,
}: {
  config: AgentConfig
  chat: ChatDriver
  onClose: () => void
  className?: string
}) {
  const busy = chat.status === "submitted" || chat.status === "streaming"
  const initial = config.name.trim().charAt(0).toUpperCase() || "A"

  return (
    <MessageScrollerProvider>
      <Card
        size="sm"
        role="dialog"
        aria-label={`${config.name} chat`}
        // Corners follow the merchant's own radius token, the same as every
        // other rounded thing the agent draws on their site.
        style={
          {
            "--window-radius": `calc(var(--radius) + 0.5rem)`,
          } as React.CSSProperties
        }
        className={cn(
          "gap-0 rounded-(--window-radius) py-0 shadow-2xl ring-border",
          className,
        )}
      >
        {/* A flex row rather than `CardHeader`'s own grid: that grid
            re-columns itself when a `CardAction` is present, which strands
            the name from its avatar. */}
        <CardHeader className="flex items-center gap-3 rounded-t-[inherit] bg-primary py-3 text-primary-foreground">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-current/20 text-xs font-medium">
            {initial}
          </div>
          <div className="flex min-w-0 flex-col">
            <CardTitle
              className="truncate text-sm"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {config.name}
            </CardTitle>
            <CardDescription className="text-xs text-current/70">
              Shopping assistant
            </CardDescription>
          </div>
          <CardAction className="ml-auto self-center">
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={onClose}
              aria-label="Close chat"
              className="text-current hover:bg-current/15 hover:text-current"
            >
              <XIcon />
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent className="gap-4 p-(--card-spacing)">
                <MessageScrollerItem>
                  <AgentLine>{config.behaviour.greeting}</AgentLine>
                </MessageScrollerItem>

                {chat.messages.length === 0 &&
                config.behaviour.starterPrompts.length > 0 ? (
                  <MessageScrollerItem>
                    {/* Aligned to the shopper's side: these are things they
                        would say, not things the agent has said. */}
                    <Message align="end">
                      <MessageContent>
                        <BubbleGroup>
                          {config.behaviour.starterPrompts.map((starter) => (
                            <Bubble key={starter} align="end" variant="outline">
                              <BubbleContent
                                render={
                                  <button
                                    type="button"
                                    onClick={() => chat.send(starter)}
                                  />
                                }
                              >
                                {starter}
                              </BubbleContent>
                            </Bubble>
                          ))}
                        </BubbleGroup>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ) : null}

                {/* No scroll anchors: pinning the shopper's question to the
                    top and leaving a gap for the answer is a full-page
                    pattern, and in a window this size it scrolls the
                    greeting out of view. The list just follows the end. */}
                {chat.messages.map((message) => (
                  <MessageScrollerItem key={message.id}>
                    <MessageItem message={message} />
                  </MessageScrollerItem>
                ))}

                {chat.status === "submitted" ? (
                  <MessageScrollerItem>
                    <Thinking />
                  </MessageScrollerItem>
                ) : null}

                {chat.status === "error" ? (
                  <MessageScrollerItem>
                    <Message>
                      <MessageContent>
                        <Bubble variant="muted">
                          {/* Demo app: the gateway's own message is more use
                              than a blank apology. */}
                          <BubbleContent className="text-muted-foreground">
                            {chat.error?.message?.trim() ||
                              "That didn\u2019t go through."}
                          </BubbleContent>
                        </Bubble>
                        <Bubble variant="outline">
                          <BubbleContent
                            render={
                              <button type="button" onClick={chat.retry} />
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
        </CardContent>

        <CardFooter className="flex-col gap-2 rounded-b-[inherit]">
          <Composer busy={busy} onSend={chat.send} onStop={chat.stop} />
        </CardFooter>
      </Card>
    </MessageScrollerProvider>
  )
}

function Composer({
  busy,
  onSend,
  onStop,
}: {
  busy: boolean
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
      className="w-full"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <InputGroup className="rounded-[calc(var(--radius)+0.25rem)] border-transparent bg-muted ring-inset">
        <InputGroupTextarea
          placeholder="Ask anything…"
          rows={1}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          // Enter sends; the composer is one sentence at a time, and a newline
          // is the rarer thing to want here.
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              submit()
            }
          }}
          // Its own block above the control row, the way the native composer
          // is laid out.
          className="max-h-28 min-h-14 px-3 py-2.5 text-base md:text-sm"
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
              <SquareIcon className="size-3 fill-current" />
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

/** One message, part by part: text as bubbles, product picks as cards. */
function MessageItem({ message }: { message: AgentUIMessage }) {
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

          if (part.type === "tool-showProducts") {
            if (part.state === "output-available") {
              return (
                <ProductCards key={index} products={part.output.products} />
              )
            }
            if (part.state === "output-error") return null
            return (
              <Bubble key={index} variant="ghost">
                <BubbleContent className="animate-pulse text-muted-foreground">
                  Finding products…
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

function AgentLine({ children }: { children: React.ReactNode }) {
  return (
    <MessageGroup>
      <Message>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>{children}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}

/** Three dots, until the first token lands. */
function Thinking() {
  return (
    <Message>
      <MessageContent>
        <Bubble variant="muted">
          <BubbleContent
            aria-label="Thinking"
            className="flex h-9 items-center gap-1 px-3.5"
          >
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="size-1.5 animate-bounce rounded-full bg-current/60"
                style={{ animationDelay: `${dot * 120}ms` }}
              />
            ))}
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  )
}
