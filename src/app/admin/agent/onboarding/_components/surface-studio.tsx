"use client"

import * as React from "react"

import { SlidersHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AgentConfig } from "@/lib/config/schema"
import { useAdminStore } from "@/lib/store/admin"

import { CustomisePane } from "./customise-pane"
import { settingsFrom, type SiteChatSettings } from "./site-chat"
import { SiteChatPreview } from "./site-chat-preview"

const SURFACES = [
  { value: "site-chat", label: "Site chat" },
  { value: "search-assist", label: "Search assist" },
  { value: "product-help", label: "Product help" },
] as const

type SurfaceId = (typeof SURFACES)[number]["value"]

/**
 * Step three: the merchant meets what was built for them and adjusts it.
 *
 * The screen is one idea repeated per surface — the thing on the left, the way
 * to change it on the right — so the tabs swap only the left half's subject.
 */
export function SurfaceStudio() {
  const config = useAdminStore((state) => state.drafts[state.active])

  return (
    // Keyed on the brand: switching accounts mid-flow should start the surface
    // over from that merchant's own matched settings, not carry the last one's.
    <Studio key={config.id} config={config} />
  )
}

function Studio({ config }: { config: AgentConfig }) {
  const [surface, setSurface] = React.useState<SurfaceId>("site-chat")
  const [showing, setShowing] = React.useState<"chat" | "options">("chat")
  const [settings, setSettings] = React.useState<SiteChatSettings>(() =>
    settingsFrom(config),
  )

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center gap-4">
        <Tabs
          value={surface}
          onValueChange={(value) => setSurface(value as SurfaceId)}
        >
          <TabsList>
            {SURFACES.map((entry) => (
              <TabsTrigger key={entry.value} value={entry.value}>
                {entry.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* The tray. Sits on the tabs' own line because what it holds acts on
            the whole screen, not on either half of it — and it is empty until
            a surface has something to put there. */}
        <div className="ml-auto flex items-center gap-1">
          <Button
            size="sm"
            variant={showing === "options" ? "secondary" : "ghost"}
            aria-pressed={showing === "options"}
            onClick={() =>
              setShowing((value) => (value === "options" ? "chat" : "options"))
            }
            className={
              showing === "options" ? undefined : "text-muted-foreground"
            }
          >
            <SlidersHorizontalIcon />
            Options
          </Button>
        </div>
      </div>

      {/* `min-h-0` so the panels take the height that is left rather than the
          height of whatever ends up inside them, and `overflow-hidden` so the
          message list's own intrinsic sizing cannot push past that. */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize="62" minSize="35" className="pr-4">
            {surface === "site-chat" ? (
              <SiteChatPreview agent={config} settings={settings} />
            ) : (
              <NotBuiltYet />
            )}
          </ResizablePanel>

          {/* Grip only. The full-height rule the handle draws by default was
              a second border between two panes that already read as separate,
              so the bar is made transparent and the grip left to stand for it. */}
          <ResizableHandle withHandle className="bg-transparent" />

          <ResizablePanel defaultSize="38" minSize="25" className="pl-4">
            <CustomisePane
              showing={showing}
              settings={settings}
              onChange={setSettings}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

/** The other two surfaces exist as tabs before they exist as screens. */
function NotBuiltYet() {
  return (
    <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
      <p className="text-sm text-muted-foreground">Not built yet</p>
    </div>
  )
}
