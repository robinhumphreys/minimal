"use client"

import * as React from "react"

import { GuideOverlay, GuideTrigger } from "@embed/product-help"
import { readableOn } from "@/lib/config/contrast"
import type { AgentConfig } from "@/lib/config/schema"

import { DeviceStage, DeviceToggle, type Device } from "./device-toggle"
import { DotField, groundFor } from "./dot-field"

/** What the guide is about in the preview; on the site it is the page's category. */
const TOPIC = "Suits"

/** The guide talks to the real route, so the questions are real ones. */
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
  // State, not a ref, since the portal needs the element itself and must re-render once it exists.
  const [box, setBox] = React.useState<HTMLDivElement | null>(null)
  const ink = readableOn(config.theme.surface)
  const ground = groundFor(config.theme.surface, ink)

  const stage = (
    <>
      <div
        className="absolute inset-0 flex items-center justify-center p-6"
        style={{ color: ink }}
      >
        <GuideTrigger
          config={config}
          // Opened a tick later: a drawer mounted during the click that opens it takes that click as an outside click and closes.
          onOpen={() => window.setTimeout(() => setOpen(true), 0)}
        />
      </div>
      {/* Mounted only while open: if already on the page, the opening click reads as an outside click and closes it. */}
      {open ? (
        <GuideOverlay
          key={config.surface.productHelp.greeting}
          config={config}
          topic={TOPIC}
          open
          onClose={() => setOpen(false)}
          placement={device === "mobile" ? "sheet" : "side"}
          container={box}
        />
      ) : null}
    </>
  )

  return (
    <div
      ref={setBox}
      // The transform makes this box a containing block, so the drawer's fixed layers stay inside it.
      className="relative h-full [transform:translateZ(0)] overflow-hidden rounded-lg"
    >
      <DotField
        className="absolute inset-0"
        back={ground.back}
        fill={ground.fill}
      />
      <DeviceStage device={device}>{stage}</DeviceStage>
      {/* Hidden while open: the guide's own header sits where the toggle does. */}
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
