"use client"

import * as React from "react"

import { useChat } from "@ai-sdk/react"
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai"

import { SiteChatLayer, type ChatDriver } from "@embed/site-chat"
import { answerViewCart } from "@/lib/agent/cart"
import type { AgentUIMessage } from "@/lib/agent/types"
import type { AgentConfig } from "@/lib/config/schema"

import { DeviceStage, DeviceToggle, type Device } from "./device-toggle"
import { DotField } from "./dot-field"

/** Not a mockup: this renders the embed's own surface from the same draft and route the storefront gets on publish. */
export function SiteChatPreview({
  config,
  device,
  onDeviceChange,
}: {
  config: AgentConfig
  device: Device
  onDeviceChange: (device: Device) => void
}) {
  const [open, setOpen] = React.useState(false)
  const chat = useDraftChat(config)

  const layer = (
    <SiteChatLayer
      mode="absolute"
      config={config}
      chat={chat}
      open={open}
      onOpenChange={setOpen}
    />
  )

  return (
    <div className="relative h-full overflow-hidden rounded-xl">
      <DotField className="absolute inset-0" />
      <DeviceStage device={device}>{layer}</DeviceStage>
      <DeviceToggle
        value={device}
        onChange={onDeviceChange}
        className="absolute top-3 right-3 z-20"
      />
    </div>
  )
}

/** Held here, not in the window, so closing and reopening the launcher keeps the conversation, as in the real embed. */
function useDraftChat(config: AgentConfig): ChatDriver {
  const transport = React.useMemo(
    () => new DefaultChatTransport({ api: `/api/agents/${config.id}/chat` }),
    [config.id],
  )
  const behaviour = config.behaviour
  // Read when the cart tool answers, after the render behaviour arrived in, so an effect is early enough.
  const bodyRef = React.useRef({ behaviour })
  React.useEffect(() => {
    bodyRef.current = { behaviour }
  }, [behaviour])

  const {
    messages,
    sendMessage,
    addToolOutput,
    status,
    error,
    stop,
    regenerate,
  } = useChat<AgentUIMessage>({
    transport,
    // The cart tool call must still be answered even though there's no real cart, or the reply never comes.
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall({ toolCall }) {
      answerViewCart(toolCall, addToolOutput, bodyRef.current)
    },
  })
  const send = React.useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      void sendMessage({ text: trimmed }, { body: { behaviour } })
    },
    [sendMessage, behaviour],
  )

  return {
    messages,
    status,
    error,
    send,
    stop: () => void stop(),
    retry: () => void regenerate(),
  }
}
