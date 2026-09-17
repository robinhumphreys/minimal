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

/** Built on `Card` rather than a hand-rolled box to inherit the design system's spacing and surfaces. */
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
        {/* Flex row, not CardHeader's own grid: that grid re-columns when a
            CardAction is present, stranding the name from its avatar. */}
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

                {/* No scroll anchors: in a window this size, pinning the
                    question to the top would scroll the greeting out of view. */}
                {chat.messages.map((message) => (
                  <MessageScrollerItem key={message.id}>
                    <MessageItem message={message} config={config} />
                  </MessageScrollerItem>
                ))}

                {/* Covers the gap between send and the reply's first visible part. */}
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
                          {/* Demo app: the gateway's own error is more use than a blank apology. */}
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
      <InputGroup className="ma:rounded-[calc(var(--radius)+0.25rem)] ma:border-transparent ma:bg-muted ma:ring-inset">
        <InputGroupTextarea
          placeholder={placeholder}
          rows={1}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          // Enter sends; shift-Enter is the rarer newline case.
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              submit()
            }
          }}
          className="ma:max-h-28 ma:min-h-14 ma:px-3 ma:py-2.5 ma:text-base ma:md:text-sm"
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
              <SquareIcon className="ma:size-3 ma:fill-current" />
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

function hasVisibleParts(message: AgentUIMessage | undefined): boolean {
  return (
    message?.parts.some(
      (part) =>
        (part.type === "text" && part.text.trim().length > 0) ||
        part.type === "tool-showProducts",
    ) ?? false
  )
}

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
