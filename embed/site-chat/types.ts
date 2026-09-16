import type { ChatStatus } from "ai"

import type { AgentUIMessage } from "@/lib/agent/types"

/**
 * What the window needs from whoever is running the conversation.
 *
 * On a storefront that is `useChat` against the real route; in the admin's
 * preview it is a stand-in that answers with a fixed line. Same window, so what
 * the merchant approves is what ships.
 */
export type ChatDriver = {
  messages: AgentUIMessage[]
  status: ChatStatus
  error?: Error
  send: (text: string) => void
  stop: () => void
  retry: () => void
}
