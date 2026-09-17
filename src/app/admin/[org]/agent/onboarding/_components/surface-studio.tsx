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
import { useIsMobile } from "@/hooks/use-mobile"
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

/** Only what step three switched on is previewed. */
export function SurfaceStudio({ next }: { next: string }) {
  const org = useOrg()
  const config = useAdminStore((state) => state.drafts[org])

  React.useEffect(() => {
    useAdminStore.getState().hydrate()
  }, [])

  return (
    // Keyed on the brand so switching accounts mid-flow starts from that merchant's own draft, not the last one's.
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
  // Shared across surfaces so switching tabs doesn't reset the chosen device.
  const [device, setDevice] = React.useState<Device>("desktop")
  const isMobile = useIsMobile()
  const orientation = isMobile ? "vertical" : "horizontal"

  // A view of the draft, not a copy: every change goes straight into the store, so install publishes exactly this.
  const settings = settingsFrom(config)
  const onChange = (next: SiteChatSettings) =>
    editDraft(config.id, (current) => applySettings(current, next))

  return (
    <div className="flex h-full flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-3 md:gap-4">
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

        {/* On the tabs' own line since it acts on the whole screen, not either half. */}
        <div className="ml-auto flex items-center gap-1">
          <NextButton href={next}>Next</NextButton>
        </div>
      </div>

      {/* `min-h-0` and `overflow-hidden` stop the message list's intrinsic sizing from pushing past the space left for it. */}
      <div className="min-h-0 flex-1 overflow-hidden">
        {/* Keyed on orientation so a change starts panels afresh, not carrying sizes measured along the other axis. */}
        <ResizablePanelGroup key={orientation} orientation={orientation}>
          <ResizablePanel
            defaultSize="62"
            minSize="35"
            className={isMobile ? "pb-3" : "pr-4"}
          >
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

          {/* Bar made transparent: the handle's default full-height rule doubled as a second border between the panes. */}
          <ResizableHandle withHandle className="bg-transparent" />

          <ResizablePanel
            defaultSize="38"
            minSize="25"
            className={isMobile ? "pt-3" : "pl-4"}
          >
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
