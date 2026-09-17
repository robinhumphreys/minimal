"use client"

import * as React from "react"

import { SearchIcon } from "lucide-react"
import { cn } from "cn"
import { SearchPanel } from "@embed/search-assist"
import type { BrandId } from "@/lib/catalog/types"
import { readableOn } from "@/lib/config/contrast"
import type { AgentConfig } from "@/lib/config/schema"

import { DeviceStage, DeviceToggle, type Device } from "./device-toggle"
import { DotField, groundFor } from "./dot-field"

/** Each prompt is one the shop can answer, so trying one lands on a result. */
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

/** The search box itself is deliberately generic; it's the merchant's, and every shop's is different. */
export function SearchAssistPreview({
  config,
  device,
  onDeviceChange,
}: {
  config: AgentConfig
  device: Device
  onDeviceChange: (device: Device) => void
}) {
  // Nothing is read until submitted, as on the site.
  const [query, setQuery] = React.useState("")
  const [submitted, setSubmitted] = React.useState("")
  const [focused, setFocused] = React.useState(false)
  const prompts = focused && query.trim().length === 0 ? PROMPTS[config.id] : []
  const ink = readableOn(config.theme.surface)
  const ground = groundFor(config.theme.surface, ink)
  // The panel takes the studio's ground as its surface, so its greys are mixed from what is actually behind them.
  const grounded = React.useMemo(
    () => ({ ...config, theme: { ...config.theme, surface: ground.back } }),
    [config, ground.back],
  )

  const submit = (text: string) => {
    const next = text.trim()
    if (next.length < 2) return
    setQuery(next)
    setSubmitted(next)
  }

  const panel = config.surface.searchAssist ? (
    <SearchPanel config={grounded} query={submitted} />
  ) : (
    <p className="pt-4 text-sm opacity-60">
      The search box is the site&rsquo;s own. Switch the agent on to have it
      read what shoppers type here.
    </p>
  )

  // `data-native-search` lets the panel step aside exactly as the site's would once it has a search.
  const box = (
    <form
      data-native-search
      className="flex shrink-0 flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        submit(query)
      }}
    >
      <label className="flex h-11 items-center gap-2 rounded-lg border border-current/20 px-3 text-sm focus-within:border-current/50">
        <SearchIcon className="size-4 shrink-0 opacity-60" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          // Delayed so a tap on a prompt below can land before the prompts disappear on blur.
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
                onClick={() => submit(prompt)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm opacity-70 hover:bg-current/5 hover:opacity-100"
              >
                <SearchIcon className="size-3.5 shrink-0" />
                {prompt}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </form>
  )

  const fresh = submitted ? (
    <button
      type="button"
      onClick={() => {
        setSubmitted("")
        setQuery("")
      }}
      className="w-fit shrink-0 text-xs underline-offset-4 opacity-60 hover:underline hover:opacity-100"
    >
      New search
    </button>
  ) : null

  return (
    <div className="relative h-full overflow-hidden rounded-xl">
      <DotField
        className="absolute inset-0"
        back={ground.back}
        fill={ground.fill}
      />

      {/* The panel measures this column to reach the foot of it. */}
      <DeviceStage device={device} align="start">
        <div
          className={cn(
            "absolute inset-0 overflow-y-auto overscroll-contain",
            device === "mobile" ? "px-4 pt-4" : "px-6 pt-6",
          )}
          style={{ color: ink }}
        >
          <div
            className={cn(
              "mx-auto flex min-h-full w-full flex-col",
              device === "mobile" ? "max-w-none" : "max-w-lg",
            )}
          >
            {fresh}
            {box}
            {panel}
          </div>
        </div>
      </DeviceStage>

      <DeviceToggle
        value={device}
        onChange={onDeviceChange}
        className="absolute top-3 right-3 z-20"
      />
    </div>
  )
}
