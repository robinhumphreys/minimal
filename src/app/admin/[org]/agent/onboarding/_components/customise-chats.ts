"use client"

import { Chat } from "@ai-sdk/react"
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai"

import type { ChatSurface } from "@/app/api/admin/site-chat/surfaces"
import {
  applySiteChatPatch,
  type SiteChatUIMessage,
} from "@/app/api/admin/site-chat/tools"
import type { BrandId } from "@/lib/catalog/types"

import type { SiteChatSettings } from "./site-chat"

/**
 * What each surface's agent opens with: one message that says what was set
 * up and hands over. It lands after a beat rather than sitting there on
 * mount, which says the agent has been working on this where a finished
 * transcript just looks like placeholder copy.
 *
 * The line is the agent's — putting words in the merchant's mouth before
 * they have said anything is a transcript pretending to be a conversation.
 *
 * `after` is the pause before the line lands.
 */
export type ScriptLine = { text: string; after: number }

export const OPENERS: Record<ChatSurface, ScriptLine[]> = {
  "site-chat": [
    {
      text: "I matched the chat button to your site — your accent, your corner radius, bottom right where your live chat used to sit. Tell me what to change and I’ll do it here.",
      after: 500,
    },
  ],
  "search-assist": [
    {
      text: "I put the agent under your search box — it reads what a shopper meant, in the same voice and with the same cards as the chat, from your own catalogue. Tell me what to change and I’ll do it here.",
      after: 500,
    },
  ],
  "product-help": [
    {
      text: "I set Product help up as a button on your category pages — it opens a guided choice, one question at a time, and ends on a product. Tell me what to change and I’ll do it here.",
      after: 500,
    },
  ],
}

/**
 * How a tool call reaches the settings. Read when the call lands, not when
 * the chat was made: the draft may have been re-read from what was
 * published since.
 */
export type Latest = {
  settings: SiteChatSettings
  onChange: (next: SiteChatSettings) => void
}

export type CustomiseChatEntry = {
  readonly chat: Chat<SiteChatUIMessage>
  readonly surface: ChatSurface
  /** Whether the scripted opener has finished playing, so it never replays. */
  readonly opened: boolean
  markOpened: () => void
  /** Called by whichever pane is showing the chat, with the draft it edits. */
  bind: (latest: Latest) => void
}

/**
 * One conversation per brand per surface, held outside React.
 *
 * The studio comes and goes — tabs swap, the merchant pages back a step and
 * forward again, the management screen opens later — and each time the chat
 * should be where they left it. A `Chat` keeps its messages and its status,
 * and carries on streaming while nothing is mounted to show it; the pane
 * subscribes to whichever entry is current and lets go of it on unmount.
 *
 * Memory-only, like the drafts: a hard refresh starts the conversations over
 * from whatever was published.
 */
const entries = new Map<string, CustomiseChatEntry>()

function keyFor(brand: BrandId, surface: ChatSurface) {
  return `${brand}:${surface}`
}

function opener(surface: ChatSurface): SiteChatUIMessage[] {
  // Seeding the conversation with it means the model knows what it has
  // already told the merchant, so "change that" has something to refer to.
  return OPENERS[surface].map((line, index) => ({
    id: `script-${index}`,
    role: "assistant",
    parts: [{ type: "text", text: line.text }],
  }))
}

export function customiseChatFor(
  brand: BrandId,
  surface: ChatSurface,
): CustomiseChatEntry {
  const key = keyFor(brand, surface)
  const existing = entries.get(key)
  if (existing) return existing

  let latest: Latest | null = null
  let opened = false
  const chat = new Chat<SiteChatUIMessage>({
    id: key,
    transport: new DefaultChatTransport({
      api: "/api/admin/site-chat",
      // The surface rides on every request; the settings are added per send
      // so they are whatever the draft is at that moment.
      body: { surface },
    }),
    messages: opener(surface),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall: ({ toolCall }) => {
      if (toolCall.dynamic || toolCall.toolName !== "updateSiteChat") return
      if (!latest) return
      const next = applySiteChatPatch(latest.settings, toolCall.input)
      latest.onChange(next)
      void chat.addToolOutput({
        tool: "updateSiteChat",
        toolCallId: toolCall.toolCallId,
        output: { applied: toolCall.input },
      })
    },
  })
  const entry: CustomiseChatEntry = {
    chat,
    surface,
    get opened() {
      return opened
    },
    markOpened: () => {
      opened = true
    },
    bind: (next) => {
      latest = next
    },
  }
  entries.set(key, entry)
  return entry
}
