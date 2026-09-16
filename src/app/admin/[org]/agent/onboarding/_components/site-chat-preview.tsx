"use client"

import * as React from "react"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

import { SiteChatLayer, type ChatDriver } from "@embed/site-chat"
import type { AgentUIMessage } from "@/lib/agent/types"
import type { AgentConfig } from "@/lib/config/schema"

import { DeviceToggle, PhoneFrame, type Device } from "./device-toggle"
import { DotField } from "./dot-field"

/**
 * The left half: the widget as a shopper would meet it, on a stand-in for the
 * merchant's page.
 *
 * Not a picture and not a replica: this is the embed's own surface, rendered
 * from the same draft the storefront will be handed on publish, talking to
 * the same route. What the merchant approves here is the thing that ships,
 * to the pixel and to the answer.
 */
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
      {/* On a phone the layer is its own container, so the window fills the
          frame the way it fills a real screen. */}
      {device === "mobile" ? (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <PhoneFrame>{layer}</PhoneFrame>
        </div>
      ) : (
        layer
      )}
      <DeviceToggle
        value={device}
        onChange={onDeviceChange}
        className="absolute top-3 right-3 z-20"
      />
    </div>
  )
}

/**
 * The same route the embed posts to, with the same body: the draft's prompt,
 * model, greeting and starters, so the preview answers as the published agent
 * would. Held here rather than in the window so closing and reopening the
 * launcher keeps the conversation, the same as the real embed.
 */
function useDraftChat(config: AgentConfig): ChatDriver {
  const transport = React.useMemo(
    () => new DefaultChatTransport({ api: `/api/agents/${config.id}/chat` }),
    [config.id],
  )
  const { messages, sendMessage, status, error, stop, regenerate } =
    useChat<AgentUIMessage>({ transport })

  const behaviour = config.behaviour
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
