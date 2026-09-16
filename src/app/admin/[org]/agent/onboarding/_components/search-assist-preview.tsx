"use client"

import * as React from "react"

import { SearchIcon } from "lucide-react"
import { SearchPanel } from "@embed/search-assist"
import type { BrandId } from "@/lib/catalog/types"
import { readableOn } from "@/lib/config/contrast"
import type { AgentConfig } from "@/lib/config/schema"

import { DeviceToggle, PhoneFrame, type Device } from "./device-toggle"
import { DotField, groundFor } from "./dot-field"

/**
 * A search each shop can answer even before the model weighs in, so the
 * preview opens on a grid rather than on an empty state.
 */
const DEMO_QUERY: Record<BrandId, string> = {
  noord: "navy suit for a wedding",
  volta: "protein for after a long run",
}

/**
 * The left half for Search assist.
 *
 * On both storefronts search is a full-screen sheet in the brand's own
 * surface colour, so that is what the whole box becomes: the dot field in
 * the merchant's surface, a stand-in for their search box at the top, and
 * the embed's own panel under it, answering from their real catalogue. No
 * card, no frame — the surface is the screen, the way the site chat's is.
 *
 * The box is deliberately generic: it is the merchant's, and every shop's is
 * different. What is theirs to approve is everything underneath it.
 */
export function SearchAssistPreview({
  config,
  device,
  onDeviceChange,
}: {
  config: AgentConfig
  device: Device
  onDeviceChange: (device: Device) => void
}) {
  const [query, setQuery] = React.useState(DEMO_QUERY[config.id])
  const ink = readableOn(config.theme.surface)
  const ground = groundFor(config.theme.surface, ink)
  // On the studio's ground rather than on a sheet of its own: the panel
  // takes the ground as its surface, so its greys are mixed from what is
  // actually behind them.
  const grounded = React.useMemo(
    () => ({ ...config, theme: { ...config.theme, surface: ground.back } }),
    [config, ground.back],
  )

  const panel = config.surface.searchAssist ? (
    <SearchPanel config={grounded} query={query} />
  ) : (
    <p className="pt-4 text-sm opacity-60">
      The search box is the site&rsquo;s own. Switch the agent on to have it
      read what shoppers type here.
    </p>
  )

  const box = (
    <label className="flex h-11 shrink-0 items-center gap-2 rounded-lg border border-current/20 px-3 text-sm">
      <SearchIcon className="size-4 shrink-0 opacity-60" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search"
        aria-label="Search"
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-current/50"
      />
    </label>
  )

  return (
    <div className="relative h-full overflow-hidden rounded-lg">
      <DotField
        className="absolute inset-0"
        back={ground.back}
        fill={ground.fill}
      />

      {/* The sheet's scrolling column: the page's width on desktop, a phone's
          on mobile. The panel measures this column to reach the foot of it. */}
      {device === "mobile" ? (
        <div className="absolute inset-0 flex items-start justify-center p-6">
          <PhoneFrame>
            <div
              className="absolute inset-0 overflow-y-auto overscroll-contain px-4 pt-4"
              style={{ color: ink }}
            >
              <div className="flex min-h-full flex-col">
                {box}
                {panel}
              </div>
            </div>
          </PhoneFrame>
        </div>
      ) : (
        <div
          className="absolute inset-0 overflow-y-auto overscroll-contain px-6 pt-6"
          style={{ color: ink }}
        >
          <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col">
            {box}
            {panel}
          </div>
        </div>
      )}

      <DeviceToggle
        value={device}
        onChange={onDeviceChange}
        className="absolute top-3 right-3 z-20"
      />
    </div>
  )
}
