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
 * Things a shopper might type, offered when the box is focused and empty.
 * Each is one the shop can answer, so trying one lands on a result.
 */
const PROMPTS: Record<BrandId, string[]> = {
  noord: [
    "navy suit for a wedding",
    "something warm for the office",
    "a coat that works with a suit",
  ],
  volta: [
    "protein for after a long run",
    "something for a 5am session",
    "what do I take on a rest day?",
  ],
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
  // Empty until the merchant types: the preview is their search box as a
  // shopper meets it, and a search box does not search by itself.
  const [query, setQuery] = React.useState("")
  const [focused, setFocused] = React.useState(false)
  const prompts = focused && query.trim().length === 0 ? PROMPTS[config.id] : []
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
    <div className="flex shrink-0 flex-col gap-2">
      <label className="flex h-11 items-center gap-2 rounded-lg border border-current/20 px-3 text-sm focus-within:border-current/50">
        <SearchIcon className="size-4 shrink-0 opacity-60" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          // A tap on a prompt below blurs the box first; give it the beat it
          // needs to land before the prompts go.
          onBlur={() => window.setTimeout(() => setFocused(false), 150)}
          placeholder="Search"
          aria-label="Search"
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-current/50"
        />
      </label>
      {prompts.length > 0 ? (
        <ul className="flex flex-col">
          {prompts.map((prompt) => (
            <li key={prompt}>
              <button
                type="button"
                onClick={() => setQuery(prompt)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm opacity-70 hover:bg-current/5 hover:opacity-100"
              >
                <SearchIcon className="size-3.5 shrink-0" />
                {prompt}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )

  return (
    <div className="relative h-full overflow-hidden rounded-xl">
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
          <div className="mx-auto flex min-h-full w-full max-w-lg flex-col">
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
