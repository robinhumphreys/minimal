"use client"

import * as React from "react"

import { useChat } from "@ai-sdk/react"
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai"
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
import { cn } from "cn"

import {
  applySiteChatPatch,
  type SiteChatUIMessage,
} from "@/app/api/admin/site-chat/tools"

import type { SiteChatSettings } from "./site-chat"

type Turn = { id: string; from: "agent" | "merchant"; text: string }

/**
 * What the agent opens with. It plays rather than sits there: arriving a line
 * at a time says the agent has been working on this, where a finished
 * transcript on mount just looks like placeholder copy.
 *
 * Both lines are the agent's — putting words in the merchant's mouth before
 * they have said anything is a transcript pretending to be a conversation.
 *
 * `after` is the pause before each line lands.
 */
const SCRIPT: { text: string; after: number }[] = [
  {
    text: "I matched the chat button to your site — your accent, your corner radius, bottom right where your live chat used to sit.",
    after: 500,
  },
  {
    text: "Tell me what to change, or open Options if you would rather set it yourself.",
    after: 1200,
  },
]

/**
 * The opener as the model sees it. Seeding the conversation with it means
 * the model knows what it has already told the merchant, so "change that"
 * has something to refer to.
 */
const OPENER: SiteChatUIMessage[] = SCRIPT.map((line, index) => ({
  id: `script-${index}`,
  role: "assistant",
  parts: [{ type: "text", text: line.text }],
}))

/**
 * What the agent is doing while the merchant waits. Two lines rather than one
 * spinner: the first covers the round trip to the model, the second the
 * moment its tool call lands and the preview redraws.
 */
const WORKING = ["Reading the settings", "Updating the preview"]

/**
 * The right half: the merchant changes the surface by asking, and the preview
 * on the left answers. The same settings sit behind the tray's options toggle
 * — chat is the way in, not the only way, because nobody wants to negotiate
 * with a model over a hex code.
 *
 * Which of the two is showing is owned by the studio, since the control that
 * switches them lives up in the tray rather than in here.
 */
export function CustomisePane({
  showing,
  settings,
  onChange,
  options,
}: {
  showing: "chat" | "options"
  settings: SiteChatSettings
  onChange: (next: SiteChatSettings) => void
  /**
   * The surface's own options. The chat is the same for every surface: one
   * conversation about one agent.
   */
  options: React.ReactNode
}) {
  return (
    // Both stay mounted. Swapping them out and back would unmount the chat,
    // and the chat is the one thing here with a history worth keeping — the
    // opener would replay every time the merchant closed the options.
    <div className="flex h-full min-h-0 flex-col">
      <div
        className={cn(
          "min-h-0 flex-1 flex-col",
          showing === "chat" ? "flex" : "hidden",
        )}
      >
        <CustomiseChat settings={settings} onChange={onChange} />
      </div>
      <div
        className={cn(
          "min-h-0 flex-1 flex-col",
          showing === "options" ? "flex" : "hidden",
        )}
      >
        {options}
      </div>
    </div>
  )
}

/**
 * The model does the editing through a tool call. The settings live in this
 * browser, not on the server, so the call comes back here to be applied and
 * its result is posted back so the model can say how it looks.
 */
function CustomiseChat({
  settings,
  onChange,
}: {
  settings: SiteChatSettings
  onChange: (next: SiteChatSettings) => void
}) {
  const [draft, setDraft] = React.useState("")
  /** How many of the scripted opener's lines have landed. */
  const [revealed, setRevealed] = React.useState(0)

  // The tool call reads whatever the settings are when it lands, not what
  // they were when the hook was set up: the merchant may have used the
  // options form in between.
  const latest = React.useRef({ settings, onChange })
  React.useEffect(() => {
    latest.current = { settings, onChange }
  }, [settings, onChange])

  const transport = React.useMemo(
    () => new DefaultChatTransport({ api: "/api/admin/site-chat" }),
    [],
  )
  const { messages, status, error, sendMessage, addToolOutput } =
    useChat<SiteChatUIMessage>({
      transport,
      messages: OPENER,
      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
      onToolCall: ({ toolCall }) => {
        if (toolCall.dynamic || toolCall.toolName !== "updateSiteChat") return
        const next = applySiteChatPatch(latest.current.settings, toolCall.input)
        latest.current.onChange(next)
        addToolOutput({
          tool: "updateSiteChat",
          toolCallId: toolCall.toolCallId,
          output: { applied: toolCall.input },
        })
      },
    })

  React.useEffect(() => {
    const timers: number[] = []
    let elapsed = 0
    SCRIPT.forEach((line, index) => {
      elapsed += line.after
      timers.push(window.setTimeout(() => setRevealed(index + 1), elapsed))
    })
    return () => timers.forEach(window.clearTimeout)
  }, [])

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
    void sendMessage({ text }, { body: { settings: latest.current.settings } })
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
                  initial={{ opacity: 0, y: 6 }}
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
