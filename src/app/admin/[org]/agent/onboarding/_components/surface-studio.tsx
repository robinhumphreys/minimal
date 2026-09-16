"use client"

import * as React from "react"

import Link from "next/link"
import {
  ArrowRightIcon,
  CheckIcon,
  SlidersHorizontalIcon,
  UploadIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { agentConfigSchema, type AgentConfig } from "@/lib/config/schema"
import { useOrg } from "@/app/admin/_components/use-org"
import { useAdminStore } from "@/lib/store/admin"

import { readPublishedOrDefault } from "@/lib/config/storage"

import { CustomisePane } from "./customise-pane"
import type { Device } from "./device-toggle"
import { InstallPanel } from "./install-panel"
import { SearchAssistPreview } from "./search-assist-preview"
import { applySettings, settingsFrom, type SiteChatSettings } from "./site-chat"
import { SiteChatPreview } from "./site-chat-preview"

const SURFACES = [
  { value: "site-chat", label: "Site chat" },
  { value: "search-assist", label: "Search assist" },
  { value: "install", label: "Install" },
] as const

type SurfaceId = (typeof SURFACES)[number]["value"]

/**
 * Onboarding previews only what step three switched on and moves on with
 * Next; management shows every surface, the install, and Publish.
 */
export type StudioMode = "onboarding" | "manage"

/** How long the Publish button says it has done so. */
const PUBLISHED_MS = 2000

/**
 * Step three: the merchant meets what was built for them and adjusts it.
 *
 * The screen is one idea repeated per surface — the thing on the left, the way
 * to change it on the right — so the tabs swap only the left half's subject.
 */
export function SurfaceStudio({
  mode,
  next,
}: {
  mode: StudioMode
  /** Where Next goes, in onboarding. */
  next?: string
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
    <Studio key={config.id} config={config} mode={mode} next={next} />
  )
}

function Studio({
  config,
  mode,
  next,
}: {
  config: AgentConfig
  mode: StudioMode
  next?: string
}) {
  const editDraft = useAdminStore((state) => state.editDraft)
  const publish = useAdminStore((state) => state.publish)
  const [published, setPublished] = React.useState(false)
  const enabled: Record<SurfaceId, boolean> = {
    "site-chat": config.surface.entry === "launcher",
    "search-assist": config.surface.searchAssist,
    install: mode === "manage",
  }
  const tabs = SURFACES.filter(
    (entry) => mode === "manage" || enabled[entry.value],
  )
  const [surface, setSurface] = React.useState<SurfaceId>(
    () => tabs[0]?.value ?? "site-chat",
  )
  const revision = useAdminStore((state) => state.revision)
  const hydrated = useAdminStore((state) => state.hydrated)
  // Whether the draft differs from what the site is running. Read on every
  // revision rather than kept in state: localStorage is the source.
  const dirty = React.useMemo(
    () =>
      hydrated &&
      JSON.stringify(config) !==
        JSON.stringify(readPublishedOrDefault(config.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config, hydrated, revision, published],
  )
  const [showing, setShowing] = React.useState<"chat" | "options">("chat")
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
            {tabs.map((entry) => (
              <TabsTrigger key={entry.value} value={entry.value}>
                {entry.label}
                {mode === "manage" &&
                entry.value !== "install" &&
                !enabled[entry.value] ? (
                  <span className="ml-1 text-muted-foreground">off</span>
                ) : null}
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
          {mode === "manage" ? (
            <>
              {dirty && !published ? (
                <span className="px-2 text-xs text-muted-foreground">
                  Unpublished changes
                </span>
              ) : null}
              <Button
                size="sm"
                disabled={!valid || (!dirty && !published)}
                onClick={() => {
                  publish(config.id)
                  setPublished(true)
                }}
              >
                {published ? <CheckIcon /> : <UploadIcon />}
                {published ? "Published" : "Publish"}
              </Button>
            </>
          ) : next ? (
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href={next} />}
            >
              Next
              <ArrowRightIcon />
            </Button>
          ) : null}
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
              <InstallPanel config={config} />
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
              onChange={onChange}
              options={
                surface === "search-assist" ? (
                  <SearchAssistOptions
                    enabled={settings.searchAssist}
                    onChange={(enabled) =>
                      onChange({ ...settings, searchAssist: enabled })
                    }
                  />
                ) : undefined
              }
            />
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
