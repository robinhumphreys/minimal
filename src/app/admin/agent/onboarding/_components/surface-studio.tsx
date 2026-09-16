"use client"

import * as React from "react"

import { CheckIcon, SlidersHorizontalIcon, UploadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { agentConfigSchema, type AgentConfig } from "@/lib/config/schema"
import { useAdminStore } from "@/lib/store/admin"

import { CustomisePane } from "./customise-pane"
import type { Device } from "./device-toggle"
import { SearchAssistPreview } from "./search-assist-preview"
import { applySettings, settingsFrom, type SiteChatSettings } from "./site-chat"
import { SiteChatPreview } from "./site-chat-preview"

const SURFACES = [
  { value: "site-chat", label: "Site chat" },
  { value: "search-assist", label: "Search assist" },
  { value: "product-help", label: "Product help" },
] as const

type SurfaceId = (typeof SURFACES)[number]["value"]

/** How long the Publish button says it has done so. */
const PUBLISHED_MS = 2000

/**
 * Step three: the merchant meets what was built for them and adjusts it.
 *
 * The screen is one idea repeated per surface — the thing on the left, the way
 * to change it on the right — so the tabs swap only the left half's subject.
 */
export function SurfaceStudio() {
  const config = useAdminStore((state) => state.drafts[state.active])

  // Whatever was last published is where the merchant left off.
  React.useEffect(() => {
    useAdminStore.getState().hydrate()
  }, [])

  return (
    // Keyed on the brand: switching accounts mid-flow should start the surface
    // over from that merchant's own draft, not carry the last one's.
    <Studio key={config.id} config={config} />
  )
}

function Studio({ config }: { config: AgentConfig }) {
  const editDraft = useAdminStore((state) => state.editDraft)
  const publish = useAdminStore((state) => state.publish)
  const [surface, setSurface] = React.useState<SurfaceId>("site-chat")
  const [showing, setShowing] = React.useState<"chat" | "options">("chat")
  const [published, setPublished] = React.useState(false)
  // Shared across surfaces: a merchant checking their phone wants to see
  // every surface on it, not re-choose it per tab.
  const [device, setDevice] = React.useState<Device>("desktop")

  // The settings are a view of the draft, not a copy of it: every change goes
  // straight into the store, so Publish here and Publish on the agent page
  // ship the same thing.
  const settings = settingsFrom(config)
  const onChange = (next: SiteChatSettings) =>
    editDraft(config.id, (current) => applySettings(current, next))

  // An emptied greeting is the one thing the form lets through that the
  // schema does not; hold Publish rather than throw on it.
  const valid = agentConfigSchema.safeParse(config).success

  React.useEffect(() => {
    if (!published) return
    const timer = window.setTimeout(() => setPublished(false), PUBLISHED_MS)
    return () => window.clearTimeout(timer)
  }, [published])

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
            the whole screen, not on either half of it. */}
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
          <Button
            size="sm"
            disabled={!valid}
            onClick={() => {
              publish(config.id)
              setPublished(true)
            }}
          >
            {published ? <CheckIcon /> : <UploadIcon />}
            {published ? "Published" : "Publish"}
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
              <NotBuiltYet />
            )}
          </ResizablePanel>

          {/* Grip only. The full-height rule the handle draws by default was
              a second border between two panes that already read as separate,
              so the bar is made transparent and the grip left to stand for it. */}
          <ResizableHandle withHandle className="bg-transparent" />

          <ResizablePanel defaultSize="38" minSize="25" className="pl-4">
            {surface === "search-assist" ? (
              <SearchAssistOptions
                enabled={config.surface.searchAssist}
                onChange={(enabled) =>
                  editDraft(config.id, (current) => ({
                    ...current,
                    surface: { ...current.surface, searchAssist: enabled },
                  }))
                }
              />
            ) : (
              <CustomisePane
                showing={showing}
                settings={settings}
                onChange={onChange}
              />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

/**
 * Search assist has one decision so far: whether the agent takes the search
 * box over at all. Everything it shows is read from the same voice and
 * catalogue as the chat, so there is nothing else to set yet.
 */
function SearchAssistOptions({
  enabled,
  onChange,
}: {
  enabled: boolean
  onChange: (enabled: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <p className="text-sm text-muted-foreground">Search box</p>
        <div className="flex gap-1.5">
          {[
            { value: true, label: "Agent reads it" },
            { value: false, label: "Leave it alone" },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => onChange(option.value)}
              className={
                option.value === enabled
                  ? "rounded-full border border-transparent bg-primary px-3 py-1 text-sm text-primary-foreground"
                  : "rounded-full border border-input px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
              }
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          When on, the shop&rsquo;s own search box stays where it is. What
          appears under it is the agent&rsquo;s reading of the search: what it
          took the words to mean, the products, one line, and a way to refine.
        </p>
      </div>
    </div>
  )
}

/** The other surface exists as a tab before it exists as a screen. */
function NotBuiltYet() {
  return (
    <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
      <p className="text-sm text-muted-foreground">Not built yet</p>
    </div>
  )
}
