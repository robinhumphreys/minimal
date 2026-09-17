import * as React from "react"
import { cn } from "../cn"

import { XIcon } from "lucide-react"

import type { AgentConfig, Position } from "@/lib/config/schema"
import {
  useMediaQuery,
  usePageScrollLock,
  useVisualViewport,
  visualViewportStyle,
} from "@/lib/visual-viewport"

import { themeStyle } from "../theme"
import { Launcher } from "./launcher"
import type { ChatDriver } from "./types"
import { ChatWindow } from "./window"

/** Which corner the column of launcher-plus-window grows out of. */
const ANCHORS: Record<Position, string> = {
  "bottom-right": "ma:items-end",
  "bottom-center": "ma:items-center",
  "bottom-left": "ma:items-start",
}

/** Under this many pixels across, the window fills the layer. Matches `@max-md`. */
const PHONE_MAX_PX = 448
/** The same line as a media query, for when the layer is the viewport. */
const PHONE_QUERY = "(width < 28rem)"

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
  onLeave,
}: {
  config: AgentConfig
  chat: ChatDriver
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "fixed" | "absolute"
  /** The host has a modal of its own open; step out of its way. */
  hidden?: boolean
  /**
   * The shopper followed a link out of the window while it filled the
   * screen. Called before the browser leaves, so whatever remembers the
   * window as open can forget it: on a phone the window is the whole page,
   * and a product page that loads under it is a product page nobody sees.
   */
  onLeave?: () => void
}) {
  const position = config.surface.position ?? "bottom-right"
  const nudge = useNudge(config, open, mode)

  // While the window is the whole screen it is the screen: it follows the
  // visual viewport so the keyboard shortens it rather than covering its
  // foot, and the page under it is held still so nothing of it shows
  // through. Only on a storefront; the admin's preview is its own box.
  const phone = useMediaQuery(PHONE_QUERY, mode === "fixed")
  const fullScreen = mode === "fixed" && open && !hidden && phone
  const screen = useVisualViewport(fullScreen)
  usePageScrollLock(fullScreen)

  return (
    <div
      data-slot="site-chat"
      className={cn(
        "minimal-agent-root ma:@container ma:pointer-events-none ma:inset-0 ma:font-sans ma:text-foreground",
        mode === "fixed" ? "ma:fixed ma:z-[2147483000]" : "ma:absolute",
        hidden && "ma:hidden",
      )}
      style={{ ...themeStyle(config.theme), ...visualViewportStyle(screen) }}
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
