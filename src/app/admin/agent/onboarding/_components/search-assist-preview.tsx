"use client"

import * as React from "react"

import { SearchIcon } from "lucide-react"
import { cn } from "cn"

import { SearchPanel } from "@embed/search-assist"
import type { BrandId } from "@/lib/catalog/types"
import { readableOn } from "@/lib/config/contrast"
import type { AgentConfig } from "@/lib/config/schema"

import { DeviceToggle, type Device } from "./device-toggle"
import { DotField, mixHex } from "./dot-field"

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
  const surface = config.theme.surface
  const ink = readableOn(surface)

  return (
    <div className="relative h-full overflow-hidden rounded-lg">
      <DotField
        className="absolute inset-0"
        back={surface}
        fill={mixHex(surface, ink, 0.12)}
      />

      {/* The sheet's scrolling column: the page's width on desktop, a phone's
          on mobile. The panel measures this to reach the bottom of it. */}
      <div
        className={cn(
          "absolute inset-y-0 overflow-y-auto overscroll-contain",
          device === "mobile"
            ? "left-1/2 w-[375px] max-w-full -translate-x-1/2 px-4 pt-4"
            : "inset-x-0 px-6 pt-6",
        )}
        style={{ color: ink }}
      >
        <div
          className={cn(
            "flex min-h-full flex-col",
            device === "mobile" ? "w-full" : "mx-auto w-full max-w-2xl",
          )}
        >
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
          <SearchPanel config={config} query={query} />
        </div>
      </div>

      <DeviceToggle
        value={device}
        onChange={onDeviceChange}
        className="absolute top-3 right-3 z-20"
      />
    </div>
  )
}
