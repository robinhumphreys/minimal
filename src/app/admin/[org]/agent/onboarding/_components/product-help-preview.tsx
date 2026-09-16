"use client"

import * as React from "react"

import { GuideOverlay, GuideTrigger } from "@embed/product-help"
import { readableOn } from "@/lib/config/contrast"
import type { AgentConfig } from "@/lib/config/schema"

import { DeviceToggle, PhoneFrame, type Device } from "./device-toggle"
import { DotField, groundFor } from "./dot-field"

/** What the guide is about in the preview; on the site it is the page's category. */
const TOPIC = "Suits"

/**
 * The left half for Product help: the embed's own button on the ground, and
 * the guide it opens over it.
 * The guide talks to the real route, so the questions are real ones.
 */
export function ProductHelpPreview({
  config,
  device,
  onDeviceChange,
}: {
  config: AgentConfig
  device: Device
  onDeviceChange: (device: Device) => void
}) {
  const [open, setOpen] = React.useState(false)
  // The drawer mounts into the preview rather than the document; the
  // preview box is transformed so the drawer's fixed layers stay inside it.
  const box = React.useRef<HTMLDivElement>(null)
  const ink = readableOn(config.theme.surface)
  const ground = groundFor(config.theme.surface, ink)

  const stage = (
    <>
      <div
        className="absolute inset-0 flex items-center justify-center p-6"
        style={{ color: ink }}
      >
        {/* Just the button: the band it sits in is the merchant's, and the
            guide it opens is what is being judged. */}
        <GuideTrigger config={config} onOpen={() => setOpen(true)} />
      </div>
      <GuideOverlay
        key={config.surface.productHelp.greeting}
        config={config}
        topic={TOPIC}
        open={open}
        onClose={() => setOpen(false)}
        placement={device === "mobile" ? "sheet" : "side"}
        container={box}
      />
    </>
  )

  return (
    <div
      ref={box}
      className="relative h-full [transform:translateZ(0)] overflow-hidden rounded-lg"
    >
      <DotField
        className="absolute inset-0"
        back={ground.back}
        fill={ground.fill}
      />
      {device === "mobile" ? (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <PhoneFrame>{stage}</PhoneFrame>
        </div>
      ) : (
        stage
      )}
      {/* The guide's own header sits where the toggle does; one at a time. */}
      {open ? null : (
        <DeviceToggle
          value={device}
          onChange={onDeviceChange}
          className="absolute top-3 right-3 z-20"
        />
      )}
    </div>
  )
}
