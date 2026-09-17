import * as React from "react"
import { ArrowUpIcon, SquareIcon, XIcon } from "lucide-react"
import { cn } from "../cn"

import type { AgentUIMessage } from "@/lib/agent/types"
import { Bubble, BubbleContent, BubbleGroup } from "../ui/bubble"
import { Button } from "../ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "../ui/input-group"
import { Message, MessageContent, MessageGroup } from "../ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "../ui/message-scroller"
import { BrandMark } from "../ui/brand-mark"
import type { AgentConfig } from "@/lib/config/schema"

import { ProductCards } from "./products"
import { Working } from "./thinking"
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
  const name = config.identity.assistantName.trim() || config.name
  const initial = name.charAt(0).toUpperCase() || "A"
  const plain = config.theme.header === "plain"

  return (
    <MessageScrollerProvider>
      <FollowEnd chat={chat} />
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
          "ma:gap-0 ma:rounded-(--window-radius) ma:py-0 ma:shadow-2xl ma:ring-border",
          className,
        )}
      >
        {/* A flex row rather than `CardHeader`'s own grid: that grid
            re-columns itself when a `CardAction` is present, which strands
            the name from its avatar. */}
        <CardHeader
          className={cn(
            "ma:flex ma:items-center ma:gap-3 ma:rounded-t-[inherit] ma:py-3",
            plain
              ? "ma:border-b ma:border-border ma:bg-card ma:text-foreground"
              : "ma:bg-primary ma:text-primary-foreground",
          )}
        >
          {config.identity.avatar === "mark" ? (
            <BrandMark
              brand={config.id}
              className="ma:size-8 ma:rounded-full ma:ring-1 ma:ring-current/15"
            />
          ) : (
            <div className="ma:flex ma:size-8 ma:shrink-0 ma:items-center ma:justify-center ma:rounded-full ma:bg-current/20 ma:text-xs ma:font-medium">
              {initial}
            </div>
          )}
          <div className="ma:flex ma:min-w-0 ma:flex-col">
            <CardTitle
              className="ma:truncate ma:text-sm"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {name}
            </CardTitle>
            {config.identity.subtitle.trim() ? (
              <CardDescription className="ma:text-xs ma:text-current/70">
                {config.identity.subtitle}
              </CardDescription>
            ) : null}
          </div>
          <CardAction className="ma:ml-auto ma:self-center">
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={onClose}
              aria-label="Close chat"
              className="ma:text-current ma:hover:bg-current/15 ma:hover:text-current"
            >
              <XIcon />
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="ma:flex-1 ma:overflow-hidden ma:p-0">
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent className="ma:gap-(--minimal-gap) ma:p-(--card-spacing)">
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
                    <MessageItem message={message} config={config} />
                  </MessageScrollerItem>
                ))}

                {/* One waiting state from the send to the first visible
                    part: the reply exists, empty, before anything arrives. */}
                {chat.status === "submitted" ||
                (chat.status === "streaming" &&
                  chat.messages.at(-1)?.role === "assistant" &&
                  !hasVisibleParts(chat.messages.at(-1))) ? (
                  <MessageScrollerItem>
                    <Thinking style={config.theme.thinking} />
                  </MessageScrollerItem>
                ) : null}

                {chat.status === "error" ? (
                  <MessageScrollerItem>
                    <Message>
                      <MessageContent>
                        <Bubble variant="muted">
                          {/* Demo app: the gateway's own message is more use
                              than a blank apology. */}
                          <BubbleContent className="ma:text-muted-foreground">
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

        <CardFooter className="ma:flex-col ma:gap-2 ma:rounded-b-[inherit]">
          <Composer
            busy={busy}
            placeholder={config.behaviour.placeholders.chat}
            onSend={chat.send}
            onStop={chat.stop}
          />
        </CardFooter>
      </Card>
    </MessageScrollerProvider>
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
      className="ma:w-full"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      {/* One line with the button beside it, growing to a few lines as the
          shopper types. A composer that starts three lines tall is a third
          of what a phone has left once the keyboard is up. The button rides
          the last line, so it stays where the thumb is as the text grows. */}
      <InputGroup className="ma:items-end ma:rounded-[calc(var(--radius)+0.25rem)] ma:border-transparent ma:bg-muted ma:ring-inset">
        <InputGroupTextarea
          placeholder={placeholder}
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
          // 16px on a phone: below that Safari zooms the page in on focus.
          className="ma:max-h-32 ma:min-h-11 ma:py-2.5 ma:pl-3.5 ma:text-base ma:md:text-sm"
        />
        <InputGroupAddon
          align="inline-end"
          className="ma:self-end ma:pr-1.5 ma:pb-1.5"
        >
          {busy ? (
            <InputGroupButton
              type="button"
              variant="default"
              size="icon-sm"
              onClick={onStop}
              aria-label="Stop"
            >
              <SquareIcon className="ma:size-3 ma:fill-current" />
            </InputGroupButton>
          ) : (
            <InputGroupButton
              type="submit"
              variant="default"
              size="icon-sm"
              disabled={draft.trim().length === 0}
              aria-label="Send"
            >
              <ArrowUpIcon />
            </InputGroupButton>
          )}
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}

/** Whether a reply has anything on screen yet. */
function hasVisibleParts(message: AgentUIMessage | undefined): boolean {
  return (
    message?.parts.some(
      (part) =>
        (part.type === "text" && part.text.trim().length > 0) ||
        part.type === "tool-showProducts",
    ) ?? false
  )
}

/** One message, part by part: text as bubbles, product picks as cards. */
function MessageItem({
  message,
  config,
}: {
  message: AgentUIMessage
  config: AgentConfig
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

          if (part.type === "tool-showProducts") {
            if (part.state === "output-available") {
              return (
                <ProductCards
                  key={index}
                  products={part.output.products}
                  cards={config.surface.cards}
                />
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
 * Keeps the newest part of the answer in view as it arrives. In a window this
 * short there is no reading-behind to protect: whatever the agent is saying
 * now is the thing to look at, and a shopper who has scrolled up to re-read
 * has the scroller's own button to come back down.
 */
function FollowEnd({ chat }: { chat: ChatDriver }) {
  const { scrollToEnd } = useMessageScroller()
  const last = chat.messages.at(-1)
  const growth = last ? last.parts.length : 0
  const lastText = last?.parts.reduce(
    (total, part) => total + (part.type === "text" ? part.text.length : 0),
    0,
  )

  React.useEffect(() => {
    if (chat.status === "submitted" || chat.status === "streaming") {
      scrollToEnd({ behavior: "smooth" })
    }
  }, [chat.status, chat.messages.length, growth, lastText, scrollToEnd])

  // The keyboard coming up halves the window; the end of the conversation
  // is what should stay in view, not the greeting.
  React.useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return
    const follow = () => scrollToEnd({ behavior: "instant" })
    viewport.addEventListener("resize", follow)
    return () => viewport.removeEventListener("resize", follow)
  }, [scrollToEnd])

  return null
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

/** The agent, working, until the first token lands. */
function Thinking({ style }: { style: AgentConfig["theme"]["thinking"] }) {
  return (
    <Message>
      <MessageContent>
        <Bubble variant="muted">
          <BubbleContent className="ma:flex ma:h-9 ma:items-center ma:px-3.5 ma:text-muted-foreground">
            <Working style={style} label="Thinking" />
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  )
}
