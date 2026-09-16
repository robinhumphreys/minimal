"use client"

import * as React from "react"

import { NextButton } from "@/app/admin/_components/next-button"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AgentConfig } from "@/lib/config/schema"
import { useOrg } from "@/app/admin/_components/use-org"
import { useAdminStore } from "@/lib/store/admin"

import { CustomisePane } from "./customise-pane"
import type { Device } from "./device-toggle"
import { ProductHelpPreview } from "./product-help-preview"
import { SearchAssistPreview } from "./search-assist-preview"
import { applySettings, settingsFrom, type SiteChatSettings } from "./site-chat"
import { SiteChatPreview } from "./site-chat-preview"

const SURFACES = [
  { value: "site-chat", label: "Site chat" },
  { value: "search-assist", label: "Search assist" },
  { value: "product-help", label: "Product help" },
] as const

type SurfaceId = (typeof SURFACES)[number]["value"]

/**
 * Step four: the merchant meets what was built for them and adjusts it.
 * Only what step three switched on is previewed.
 *
 * The screen is one idea repeated per surface — the thing on the left, the way
 * to change it on the right — so the tabs swap only the left half's subject.
 */
export function SurfaceStudio({
  next,
}: {
  /** Where Next goes. */
  next: string
}) {
  const org = useOrg()
  const config = useAdminStore((state) => state.drafts[org])

  // Whatever was last published is where the merchant left off.
  React.useEffect(() => {
    useAdminStore.getState().hydrate()
  }, [])

  return (
    // Keyed on the brand: switching accounts mid-flow should start the surface
    // over from that merchant's own draft, not carry the last one's.
    <Studio key={config.id} config={config} next={next} />
  )
}

function Studio({ config, next }: { config: AgentConfig; next: string }) {
  const editDraft = useAdminStore((state) => state.editDraft)
  const enabled: Record<SurfaceId, boolean> = {
    "site-chat": config.surface.entry === "launcher",
    "search-assist": config.surface.searchAssist,
    "product-help": config.surface.productHelp.enabled,
  }
  const tabs = SURFACES.filter((entry) => enabled[entry.value])
  const [surface, setSurface] = React.useState<SurfaceId>(
    () => tabs[0]?.value ?? "site-chat",
  )
  // Shared across surfaces: a merchant checking their phone wants to see
  // every surface on it, not re-choose it per tab.
  const [device, setDevice] = React.useState<Device>("desktop")

  // The settings are a view of the draft, not a copy of it: every change goes
  // straight into the store, so the install step publishes exactly this.
  const settings = settingsFrom(config)
  const onChange = (next: SiteChatSettings) =>
    editDraft(config.id, (current) => applySettings(current, next))

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center gap-4">
        {/* One surface is a title, not a menu of one. */}
        {tabs.length > 1 ? (
          <Tabs
            value={surface}
            onValueChange={(value) => setSurface(value as SurfaceId)}
          >
            <TabsList className="h-10">
              {tabs.map((entry) => (
                <TabsTrigger key={entry.value} value={entry.value}>
                  {entry.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : (
          <h2 className="font-heading text-lg font-medium">
            {tabs[0]?.label ?? "Site chat"}
          </h2>
        )}

        {/* On the tabs' own line because it acts on the whole screen, not on
            either half of it. */}
        <div className="ml-auto flex items-center gap-1">
          <NextButton href={next}>Next</NextButton>
        </div>
      </div>

      {/* `min-h-0` so the panels take the height that is left rather than the
          height of whatever ends up inside them, and `overflow-hidden` so the
          message list's own intrinsic sizing cannot push past that. */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize="62" minSize="35" className="pr-4">
            {surface === "site-chat" ? (
              <SiteChatPreview
                config={config}
                device={device}
                onDeviceChange={setDevice}
              />
            ) : surface === "search-assist" ? (
              <SearchAssistPreview
                config={config}
                device={device}
                onDeviceChange={setDevice}
              />
            ) : (
              <ProductHelpPreview
                config={config}
                device={device}
                onDeviceChange={setDevice}
              />
            )}
          </ResizablePanel>

          {/* Grip only. The full-height rule the handle draws by default was
              a second border between two panes that already read as separate,
              so the bar is made transparent and the grip left to stand for it. */}
          <ResizableHandle withHandle className="bg-transparent" />

          <ResizablePanel defaultSize="38" minSize="25" className="pl-4">
            <CustomisePane
              brand={config.id}
              surface={surface}
              settings={settings}
              onChange={onChange}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
