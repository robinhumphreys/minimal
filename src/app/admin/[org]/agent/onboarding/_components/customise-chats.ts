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

/** `after` is the pause, in ms, before the line lands; a beat delay reads as the agent working, not a static transcript. */
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
      text: "I put the agent under your search box. When a shopper types, it works out what they mean and answers with products from your catalogue. Tell me what to change and I’ll do it here.",
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

/** Read when the tool call lands, not when the chat was made, since the draft may have been re-read since. */
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

// Held outside React so each `Chat` keeps streaming and its messages while nothing is mounted to show it.
// Memory-only: a hard refresh starts conversations over from whatever was published.
const entries = new Map<string, CustomiseChatEntry>()

function keyFor(brand: BrandId, surface: ChatSurface) {
  return `${brand}:${surface}`
}

function opener(surface: ChatSurface): SiteChatUIMessage[] {
  // Seeded so the model knows what it already told the merchant and "change that" has something to refer to.
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
      // Settings are added per send so they reflect whatever the draft is at that moment.
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
