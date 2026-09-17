import type { ChatStatus } from "ai"

import type { AgentUIMessage } from "@/lib/agent/types"

/**
 * On a storefront this is `useChat` against the real route; in the admin
 * preview it is a stand-in with a fixed reply, so the same window renders both.
 */
export type ChatDriver = {
  messages: AgentUIMessage[]
  status: ChatStatus
  error?: Error
  send: (text: string) => void
  stop: () => void
  retry: () => void
}
