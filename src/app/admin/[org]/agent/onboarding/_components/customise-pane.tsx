"use client"

import * as React from "react"

import { useChat } from "@ai-sdk/react"
import { ArrowUpIcon } from "lucide-react"
import { motion } from "motion/react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
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

import type { ChatSurface } from "@/app/api/admin/site-chat/surfaces"
import type { BrandId } from "@/lib/catalog/types"

import {
  OPENERS,
  customiseChatFor,
  type CustomiseChatEntry,
} from "./customise-chats"
import type { SiteChatSettings } from "./site-chat"

type Turn = { id: string; from: "agent" | "merchant"; text: string }

/**
 * What the agent is doing while the merchant waits. Two lines rather than one
 * spinner: the first covers the round trip to the model, the second the
 * moment its tool call lands and the preview redraws.
 */
const WORKING = ["Reading the settings", "Updating the preview"]

/**
 * The right half: the merchant changes the surface by asking, and the preview
 * on the left answers. The chat is the only way in — the agent is the one
 * that edits the settings, so there is no form beside it.
 */
export function CustomisePane({
  brand,
  surface,
  settings,
  onChange,
}: {
  brand: BrandId
  /**
   * Which surface the merchant is looking at. Each has a conversation of its
   * own, briefed on that surface and allowed to change only its settings.
   */
  surface: ChatSurface
  settings: SiteChatSettings
  onChange: (next: SiteChatSettings) => void
}) {
  // The conversation lives outside React, so swapping the chat out for
  // another tab's and back — or leaving the step and returning — picks it up
  // where it was, opener and all.
  const entry = customiseChatFor(brand, surface)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <CustomiseChat
        key={entry.chat.id}
        entry={entry}
        settings={settings}
        onChange={onChange}
      />
    </div>
  )
}

/**
 * The model does the editing through a tool call. The settings live in this
 * browser, not on the server, so the call comes back here to be applied and
 * its result is posted back so the model can say how it looks.
 */
function CustomiseChat({
  entry,
  settings,
  onChange,
}: {
  entry: CustomiseChatEntry
  settings: SiteChatSettings
  onChange: (next: SiteChatSettings) => void
}) {
  const SCRIPT = OPENERS[entry.surface]
  const [draft, setDraft] = React.useState("")
  /**
   * How many of the scripted opener's lines have landed. A conversation that
   * has already opened once shows all of them at once: the merchant has seen
   * it play, and a replay on every return would be a tic.
   */
  const [revealed, setRevealed] = React.useState(() =>
    entry.opened ? SCRIPT.length : 0,
  )

  // The tool call reads whatever the settings are when it lands, not what
  // they were when the chat was made: the draft may have been re-read from
  // what was published in between. Bound in an effect rather than in render
  // so a render that is thrown away cannot leave the entry pointing at stale
  // callbacks.
  React.useEffect(() => {
    entry.bind({ settings, onChange })
  }, [entry, settings, onChange])

  const { messages, status, error, sendMessage } = useChat({ chat: entry.chat })

  // Bubbles that were already there when this pane mounted — a conversation
  // picked up again after a tab switch or a step back — land at once. Only
  // what arrives from now on fades in.
  const [restored] = React.useState(
    () => new Set(entry.opened ? messages.map((message) => message.id) : []),
  )

  React.useEffect(() => {
    if (entry.opened) return
    const timers: number[] = []
    let elapsed = 0
    SCRIPT.forEach((line, index) => {
      elapsed += line.after
      timers.push(
        window.setTimeout(() => {
          setRevealed(index + 1)
          if (index === SCRIPT.length - 1) entry.markOpened()
        }, elapsed),
      )
    })
    return () => timers.forEach(window.clearTimeout)
  }, [entry, SCRIPT])

  const busy = status === "submitted" || status === "streaming"

  // One bubble per message with something to say. A step that was only a
  // tool call has no text and draws nothing; the shimmer stands in for it.
  const turns: Turn[] = []
  messages.forEach((message, index) => {
    if (index < SCRIPT.length && index >= revealed) return
    const text = message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("")
    if (!text) return
    turns.push({
      id: message.id,
      from: message.role === "user" ? "merchant" : "agent",
      text,
    })
  })

  const last = messages.at(-1)
  const lastHasText =
    last?.role === "assistant" &&
    last.parts.some((part) => part.type === "text" && part.text.length > 0)
  const lastHasTool =
    last?.role === "assistant" &&
    last.parts.some((part) => part.type === "tool-updateSiteChat")
  const working = busy && !lastHasText ? (lastHasTool ? 1 : 0) : -1

  const send = () => {
    const text = draft.trim()
    if (!text || busy) return
    setDraft("")
    void sendMessage({ text }, { body: { settings, surface: entry.surface } })
  }

  return (
    <MessageScrollerProvider>
      <MessageScroller className="flex-1">
        <MessageScrollerViewport>
          {/* No gutter of its own either: the bubbles run to the same edges
              as the composer below them, and the first one starts level with
              the top of the preview across the divide. */}
          <MessageScrollerContent className="gap-5">
            {turns.map((turn) => (
              <MessageScrollerItem
                key={turn.id}
                scrollAnchor={turn.from === "merchant"}
              >
                <motion.div
                  initial={restored.has(turn.id) ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <MessageGroup>
                    <Message align={turn.from === "merchant" ? "end" : "start"}>
                      <MessageContent>
                        <Bubble
                          align={turn.from === "merchant" ? "end" : "start"}
                          variant={
                            turn.from === "merchant" ? "default" : "muted"
                          }
                        >
                          <BubbleContent className="whitespace-pre-wrap">
                            {turn.text}
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageGroup>
                </motion.div>
              </MessageScrollerItem>
            ))}

            {working >= 0 ? (
              <MessageScrollerItem>
                <Message>
                  <MessageContent>
                    <Bubble variant="ghost">
                      <BubbleContent className="shimmer text-muted-foreground">
                        {WORKING[working]}
                      </BubbleContent>
                    </Bubble>
                  </MessageContent>
                </Message>
              </MessageScrollerItem>
            ) : null}

            {error ? (
              <MessageScrollerItem>
                <Message>
                  <MessageContent>
                    <Bubble variant="muted">
                      <BubbleContent className="text-destructive">
                        {error.message}
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

      {/* Flush to the pane on all four sides. The composer is part of the
          column, not a field parked at the bottom of it, so its own border is
          the only edge — and its foot lines up with the foot of the preview
          across the divide. */}
      <form
        className="shrink-0"
        onSubmit={(event) => {
          event.preventDefault()
          send()
        }}
      >
        <InputGroup className="rounded-2xl border-transparent bg-muted ring-inset">
          <InputGroupTextarea
            placeholder="Describe a change…"
            rows={1}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            // Enter sends; the composer is one sentence at a time, and a
            // newline is the rarer thing to want here.
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                send()
              }
            }}
            // Its own block above the control row, the way the native
            // composer is laid out — not a single line with buttons
            // crammed onto it.
            className="max-h-28 min-h-14 px-3 py-2.5"
          />
          <InputGroupAddon align="block-end" className="px-2 pb-2">
            <InputGroupButton
              type="submit"
              variant="default"
              size="icon-sm"
              disabled={draft.trim().length === 0 || busy}
              className="ml-auto"
            >
              <ArrowUpIcon />
              <span className="sr-only">Send</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </MessageScrollerProvider>
  )
}
