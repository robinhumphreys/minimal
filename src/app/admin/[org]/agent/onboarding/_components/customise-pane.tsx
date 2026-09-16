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
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Message, MessageContent, MessageGroup } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "cn"

import {
  applySiteChatPatch,
  type SiteChatUIMessage,
} from "@/app/api/admin/site-chat/tools"

import {
  AVATARS,
  DENSITIES,
  FONTS,
  HEADERS,
  ICON_STYLES,
  LAUNCHER_ICONS,
  PLACEMENTS,
  RATIOS,
  ROUNDNESS,
  SHAPES,
  SIZES,
  SPELLINGS,
  THINKING,
  VOICES,
  type IconStyle,
  type LauncherIcon,
  type Placement,
  type SiteChatSettings,
} from "./site-chat"

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
const WORKING = ["Reading the site chat settings", "Updating the chat button"]

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
   * Another surface's options, in place of the site chat's. The chat is the
   * same either way: one conversation about one agent, across its surfaces.
   */
  options?: React.ReactNode
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
        {options ?? <OptionsForm settings={settings} onChange={onChange} />}
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

/** The same settings the chat edits, for when typing a sentence is slower. */
function OptionsForm({
  settings,
  onChange,
}: {
  settings: SiteChatSettings
  onChange: (next: SiteChatSettings) => void
}) {
  const set = <K extends keyof SiteChatSettings>(
    key: K,
    value: SiteChatSettings[K],
  ) => onChange({ ...settings, [key]: value })

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto pr-1">
      <Group title="Surfaces">
        <div className="flex flex-wrap gap-1.5">
          <Toggle
            label="Site chat"
            on={settings.siteChat}
            onToggle={() => set("siteChat", !settings.siteChat)}
          />
          <Toggle
            label="Search assist"
            on={settings.searchAssist}
            onToggle={() => set("searchAssist", !settings.searchAssist)}
          />
        </div>
      </Group>

      <Group title="What it says">
        <Field label="Opening message" hint="What the agent says first.">
          <Textarea
            rows={3}
            className="ring-inset"
            value={settings.greeting}
            onChange={(event) => set("greeting", event.target.value)}
          />
        </Field>
        <Field
          label="Suggested questions"
          hint="Shown as taps under the opening message. One per line."
        >
          <Textarea
            rows={3}
            className="ring-inset"
            value={settings.starters.join("\n")}
            onChange={(event) => set("starters", lines(event.target.value))}
          />
        </Field>
        <Field label="Voice">
          <Choices
            options={VOICES}
            value={settings.voice}
            onSelect={(value) => set("voice", value)}
          />
        </Field>
        <Field label="Spelling">
          <Choices
            options={SPELLINGS}
            value={settings.spelling}
            onSelect={(value) => set("spelling", value)}
          />
        </Field>
        <Field
          label="Language"
          hint="The agent answers in the shopper's language; this is the fallback."
        >
          <Input
            className="ring-inset"
            value={settings.language}
            onChange={(event) => set("language", event.target.value)}
          />
        </Field>
      </Group>

      <Group title="Who it is">
        <Field label="Name">
          <Input
            className="ring-inset"
            value={settings.assistantName}
            placeholder="Your brand's name"
            onChange={(event) => set("assistantName", event.target.value)}
          />
        </Field>
        <Field label="Subtitle">
          <Input
            className="ring-inset"
            value={settings.subtitle}
            placeholder="None"
            onChange={(event) => set("subtitle", event.target.value)}
          />
        </Field>
        <Field label="Avatar">
          <Choices
            options={AVATARS}
            value={settings.avatar}
            onSelect={(value) => set("avatar", value)}
          />
        </Field>
      </Group>

      <Group title="The button">
        <Field label="Placement">
          <Choices
            options={PLACEMENTS}
            value={settings.placement}
            onSelect={(value: Placement) => set("placement", value)}
          />
        </Field>
        <Field label="Shape">
          <Choices
            options={SHAPES}
            value={settings.shape}
            onSelect={(value) => set("shape", value)}
          />
        </Field>
        <Field label="Size">
          <Choices
            options={SIZES}
            value={settings.size}
            onSelect={(value) => set("size", value)}
          />
        </Field>
        <Field label="Icon">
          <Choices
            options={LAUNCHER_ICONS}
            value={settings.icon}
            onSelect={(value: LauncherIcon) => set("icon", value)}
          />
        </Field>
        <Field label="Icon style">
          <Choices
            options={ICON_STYLES}
            value={settings.iconStyle}
            onSelect={(value: IconStyle) => set("iconStyle", value)}
          />
        </Field>
        <Field label="Label">
          <Input
            className="ring-inset"
            value={settings.label}
            placeholder="Icon only"
            onChange={(event) => set("label", event.target.value)}
          />
        </Field>
      </Group>

      <Group title="The window">
        <Field label="Accent">
          {/* One field, not a swatch parked beside one. The native colour
              input draws its own bevelled box that nothing in this admin
              matches, so it is laid over a plain disc at zero opacity and only
              the disc is ever seen. */}
          <InputGroup className="ring-inset">
            <InputGroupAddon align="inline-start">
              <span
                style={{ backgroundColor: settings.accent }}
                className="relative size-4 shrink-0 rounded-full ring-1 ring-black/10 ring-inset"
              >
                <input
                  type="color"
                  aria-label="Accent colour"
                  value={settings.accent}
                  onChange={(event) => set("accent", event.target.value)}
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                />
              </span>
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Accent hex"
              value={settings.accent}
              onChange={(event) => set("accent", event.target.value)}
            />
          </InputGroup>
        </Field>
        <Field label="Header">
          <Choices
            options={HEADERS}
            value={settings.header}
            onSelect={(value) => set("header", value)}
          />
        </Field>
        <Field label="Corners">
          <Choices
            options={ROUNDNESS}
            value={settings.roundness}
            onSelect={(value) => set("roundness", value)}
          />
        </Field>
        <Field label="Font">
          <Choices
            options={FONTS}
            value={settings.font}
            onSelect={(value) => set("font", value)}
          />
        </Field>
        <Field label="Spacing">
          <Choices
            options={DENSITIES}
            value={settings.density}
            onSelect={(value) => set("density", value)}
          />
        </Field>
        <Field label="While it works">
          <Choices
            options={THINKING}
            value={settings.thinking}
            onSelect={(value) => set("thinking", value)}
          />
        </Field>
      </Group>

      <Group title="Products">
        <Field label="Image shape">
          <Choices
            options={RATIOS}
            value={settings.ratio}
            onSelect={(value) => set("ratio", value)}
          />
        </Field>
        <Field label="On cards">
          <div className="flex flex-wrap gap-1.5">
            <Toggle
              label="Price"
              on={settings.price}
              onToggle={() => set("price", !settings.price)}
            />
            <Toggle
              label="Rating"
              on={settings.rating}
              onToggle={() => set("rating", !settings.rating)}
            />
          </div>
        </Field>
        <Field label="Picks per answer">
          <Choices
            options={[
              { value: "2", label: "Two" },
              { value: "3", label: "Three" },
              { value: "4", label: "Four" },
            ]}
            value={String(settings.picks)}
            onSelect={(value) => set("picks", Number(value))}
          />
        </Field>
      </Group>

      <Group title="When it appears">
        <Field
          label="Nudge"
          hint="Pops the opening message up beside the closed button."
        >
          <Choices
            options={[
              { value: "0", label: "Never" },
              { value: "5", label: "After 5s" },
              { value: "15", label: "After 15s" },
              { value: "30", label: "After 30s" },
            ]}
            value={String(settings.nudge)}
            onSelect={(value) => set("nudge", Number(value))}
          />
        </Field>
        <Field label="Product pages">
          <Toggle
            label="Open the window by itself"
            on={settings.openOnProductPages}
            onToggle={() =>
              set("openOnProductPages", !settings.openOnProductPages)
            }
          />
        </Field>
        <Field
          label="Stay off these paths"
          hint="Path prefixes, one per line, e.g. /checkout."
        >
          <Textarea
            rows={2}
            className="ring-inset"
            value={settings.hiddenPaths.join("\n")}
            onChange={(event) => set("hiddenPaths", lines(event.target.value))}
          />
        </Field>
      </Group>
    </div>
  )
}

function lines(value: string): string[] {
  return value.split("\n").filter((line) => line.trim().length > 0)
}

function Group({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </section>
  )
}

/** A pill that is on or off. */
function Toggle({
  label,
  on,
  onToggle,
}: {
  label: string
  on: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onToggle}
      className={cn(
        "rounded-full border px-3 py-1 text-sm transition-colors",
        on
          ? "border-transparent bg-primary text-primary-foreground"
          : "border-input text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  /** Only where the label alone leaves the field's job ambiguous. */
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-muted-foreground">{label}</Label>
      {hint ? (
        <p className="-mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {children}
    </div>
  )
}

/** A row of mutually exclusive pills. */
function Choices<T extends string>({
  options,
  value,
  onSelect,
}: {
  options: { value: T; label: string }[]
  value: T
  onSelect: (value: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={cn(
            "rounded-full border px-3 py-1 text-sm transition-colors",
            option.value === value
              ? "border-transparent bg-primary text-primary-foreground"
              : "border-input text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
