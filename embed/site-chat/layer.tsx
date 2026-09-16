import * as React from "react"
import { cn } from "cn"

import { XIcon } from "lucide-react"

import type { AgentConfig, Position } from "@/lib/config/schema"

import { themeStyle } from "../theme"
import { Launcher } from "./launcher"
import type { ChatDriver } from "./types"
import { ChatWindow } from "./window"

/** Which corner the column of launcher-plus-window grows out of. */
const ANCHORS: Record<Position, string> = {
  "bottom-right": "items-end",
  "bottom-center": "items-center",
  "bottom-left": "items-start",
}

/**
 * The Site chat surface: a launcher, and the window it opens.
 *
 * Laid over the whole host (`fixed` on a storefront, `absolute` inside the
 * admin's preview) rather than pinned to a corner, so it can be its own
 * container query context: below a phone's width the window takes the entire
 * layer and the launcher steps aside, and that decision is made on the size
 * of whatever the surface is in, not on the size of the screen.
 */
export function SiteChatLayer({
  config,
  chat,
  open,
  onOpenChange,
  mode,
  hidden = false,
}: {
  config: AgentConfig
  chat: ChatDriver
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "fixed" | "absolute"
  /** The host has a modal of its own open; step out of its way. */
  hidden?: boolean
}) {
  const position = config.surface.position ?? "bottom-right"
  const nudge = useNudge(config, open, mode)

  return (
    <div
      data-slot="site-chat"
      className={cn(
        "minimal-agent-root @container pointer-events-none inset-0 font-sans text-foreground",
        mode === "fixed" ? "fixed z-[2147483000]" : "absolute",
        hidden && "hidden",
      )}
      style={themeStyle(config.theme)}
    >
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-end gap-3 p-4 @md:p-6",
          ANCHORS[position],
        )}
      >
        {open ? (
          <ChatWindow
            config={config}
            chat={chat}
            onClose={() => onOpenChange(false)}
            className={cn(
              "pointer-events-auto w-[22rem] max-w-full animate-in duration-200 fade-in slide-in-from-bottom-2",
              // As tall as it can be without crowding the launcher below it.
              "h-[min(34rem,calc(100cqh-7.5rem))]",
              // The whole layer on a phone: a floating card at that size is a
              // keyhole, and the launcher has nothing left to float over.
              "@max-md:absolute @max-md:inset-0 @max-md:h-auto @max-md:w-auto @max-md:max-w-none @max-md:rounded-none @max-md:ring-0",
            )}
          />
        ) : null}

        {nudge.showing ? (
          <div
            role="status"
            className={cn(
              "pointer-events-auto flex max-w-[18rem] animate-in items-start gap-2 rounded-(--radius) border border-border bg-card px-3 py-2.5 text-sm text-card-foreground shadow-lg duration-300 fade-in slide-in-from-bottom-2",
            )}
          >
            <button
              type="button"
              onClick={() => {
                nudge.dismiss()
                onOpenChange(true)
              }}
              className="min-w-0 flex-1 cursor-pointer text-left leading-relaxed"
            >
              {config.behaviour.greeting}
            </button>
            <button
              type="button"
              onClick={nudge.dismiss}
              aria-label="Dismiss"
              className="-mr-1 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <XIcon className="size-3.5" />
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
          className={cn("pointer-events-auto", open && "@max-md:hidden")}
        />
      </div>
    </div>
  )
}

/**
 * The greeting, offered beside a closed launcher once the shopper has been on
 * the page a while. Once dismissed it stays dismissed for the visit: on a
 * storefront that is the tab's session, in the admin's preview it is the
 * preview's own lifetime, so the merchant can watch it happen again.
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
      // Then it comes back next page; no worse than a site without storage.
    }
  }, [key, mode])

  return { showing: seconds > 0 && due && !dismissed && !open, dismiss }
}
