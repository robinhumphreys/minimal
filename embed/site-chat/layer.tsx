import * as React from "react"
import { cn } from "../cn"

import { XIcon } from "lucide-react"

import type { AgentConfig, Position } from "@/lib/config/schema"

import { themeStyle } from "../theme"
import { Launcher } from "./launcher"
import type { ChatDriver } from "./types"
import { ChatWindow } from "./window"

const ANCHORS: Record<Position, string> = {
  "bottom-right": "ma:items-end",
  "bottom-center": "ma:items-center",
  "bottom-left": "ma:items-start",
}

/** Must match the `@max-md` container query breakpoint below. */
const PHONE_MAX_PX = 448

/**
 * Laid over the whole host rather than pinned to a corner so it forms its own
 * container-query context, sized to the surface it's in, not the screen.
 */
export function SiteChatLayer({
  config,
  chat,
  open,
  onOpenChange,
  mode,
  hidden = false,
  onLeave,
}: {
  config: AgentConfig
  chat: ChatDriver
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "fixed" | "absolute"
  /** True when the host has a modal of its own open. */
  hidden?: boolean
  /** Called before navigation so the open state isn't persisted for the page underneath. */
  onLeave?: () => void
}) {
  const position = config.surface.position ?? "bottom-right"
  const nudge = useNudge(config, open, mode)

  return (
    <div
      data-slot="site-chat"
      className={cn(
        "minimal-agent-root ma:@container ma:pointer-events-none ma:inset-0 ma:font-sans ma:text-foreground",
        mode === "fixed" ? "ma:fixed ma:z-[2147483000]" : "ma:absolute",
        hidden && "ma:hidden",
      )}
      style={themeStyle(config.theme)}
      onClick={(event) => {
        if (!open || !onLeave) return
        const link = (event.target as HTMLElement | null)?.closest("a[href]")
        if (!link || event.currentTarget.clientWidth >= PHONE_MAX_PX) return
        onLeave()
      }}
    >
      <div
        className={cn(
          "ma:absolute ma:inset-0 ma:flex ma:flex-col ma:justify-end ma:gap-3 ma:p-4 ma:@md:p-6",
          ANCHORS[position],
        )}
      >
        {open ? (
          <ChatWindow
            config={config}
            chat={chat}
            onClose={() => onOpenChange(false)}
            className={cn(
              "ma:pointer-events-auto ma:w-[22rem] ma:max-w-full ma:animate-in ma:duration-200 ma:fade-in ma:slide-in-from-bottom-2",
              // As tall as it can be without crowding the launcher below it.
              "ma:h-[min(34rem,calc(100cqh-7.5rem))]",
              // The whole layer on a phone: a floating card at that size is a
              // keyhole, and the launcher has nothing left to float over.
              "ma:@max-md:absolute ma:@max-md:inset-0 ma:@max-md:h-auto ma:@max-md:w-auto ma:@max-md:max-w-none ma:@max-md:rounded-none ma:@max-md:ring-0",
            )}
          />
        ) : null}

        {nudge.showing ? (
          <div
            role="status"
            className={cn(
              "ma:pointer-events-auto ma:flex ma:max-w-[18rem] ma:animate-in ma:items-start ma:gap-2 ma:rounded-(--radius) ma:border ma:border-border ma:bg-card ma:px-3 ma:py-2.5 ma:text-sm ma:text-card-foreground ma:shadow-lg ma:duration-300 ma:fade-in ma:slide-in-from-bottom-2",
            )}
          >
            <button
              type="button"
              onClick={() => {
                nudge.dismiss()
                onOpenChange(true)
              }}
              className="ma:min-w-0 ma:flex-1 ma:cursor-pointer ma:text-left ma:leading-relaxed"
            >
              {config.behaviour.greeting}
            </button>
            <button
              type="button"
              onClick={nudge.dismiss}
              aria-label="Dismiss"
              className="ma:-mr-1 ma:flex ma:size-6 ma:shrink-0 ma:cursor-pointer ma:items-center ma:justify-center ma:rounded-full ma:text-muted-foreground ma:hover:bg-muted ma:hover:text-foreground"
            >
              <XIcon className="ma:size-3.5" />
            </button>
          </div>
        ) : null}

        <Launcher
          surface={config.surface}
          open={open}
          onClick={() => {
            nudge.dismiss()
            onOpenChange(!open)
          }}
          className={cn("ma:pointer-events-auto", open && "ma:@max-md:hidden")}
        />
      </div>
    </div>
  )
}

/**
 * Once dismissed it stays dismissed for the tab's session on a storefront,
 * but only for the preview's own lifetime in the admin, so it replays there.
 */
function useNudge(
  config: AgentConfig,
  open: boolean,
  mode: "fixed" | "absolute",
) {
  const seconds = config.surface.nudge
  const key = `minimal-agent:${config.id}:nudged`
  const [dismissed, setDismissed] = React.useState(() => {
    if (mode !== "fixed") return false
    try {
      return window.sessionStorage.getItem(key) === "1"
    } catch {
      return false
    }
  })
  const [due, setDue] = React.useState(false)

  React.useEffect(() => {
    if (seconds === 0 || dismissed) return
    const timer = window.setTimeout(() => setDue(true), seconds * 1000)
    return () => window.clearTimeout(timer)
  }, [seconds, dismissed])

  const dismiss = React.useCallback(() => {
    setDismissed(true)
    if (mode !== "fixed") return
    try {
      window.sessionStorage.setItem(key, "1")
    } catch {
      // Falls back to reappearing next page; no worse than no storage.
    }
  }, [key, mode])

  return { showing: seconds > 0 && due && !dismissed && !open, dismiss }
}
