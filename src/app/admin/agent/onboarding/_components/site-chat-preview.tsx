"use client"

import * as React from "react"

import type { ChatStatus } from "ai"

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
 * from the same draft the storefront will be handed on publish. What the
 * merchant approves here is the thing that ships, to the pixel.
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
  const chat = usePreviewChat()

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
    <div className="relative h-full overflow-hidden rounded-lg">
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

const REPLY =
  "On your site I answer this from your catalogue. Publish, then ask me on the storefront."

/**
 * Stands in for the model. The window still takes a message and answers, so
 * the merchant can feel the surface work without spending a token on it.
 */
function usePreviewChat(): ChatDriver {
  const [messages, setMessages] = React.useState<AgentUIMessage[]>([])
  const [status, setStatus] = React.useState<ChatStatus>("ready")
  const timer = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    }
  }, [])

  const send = React.useCallback((text: string) => {
    setMessages((current) => [
      ...current,
      {
        id: `user-${current.length}`,
        role: "user",
        parts: [{ type: "text", text }],
      },
    ])
    setStatus("submitted")
    timer.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `agent-${current.length}`,
          role: "assistant",
          parts: [{ type: "text", text: REPLY }],
        },
      ])
      setStatus("ready")
    }, 700)
  }, [])

  return {
    messages,
    status,
    send,
    stop: () => {},
    retry: () => {},
  }
}
