"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"

import { MinimalLogo } from "./minimal-logo"

// There is no auth, so the signed-in operator is a placeholder.
const USER = { name: "Merchant admin", initials: "MA" }

/**
 * The shell's top bar. It spans the full width above the sidebar rather than
 * sitting inside the content column, so the mark stays pinned to the top-left
 * corner whether the rail is collapsed or not.
 */
export function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-3">
      <SidebarTrigger className="text-muted-foreground" />
      <span className="flex items-center gap-2">
        <MinimalLogo />
        <span className="text-sm font-medium">Minimal AI</span>
      </span>
      <div className="ml-auto flex items-center gap-4">
        <a
          href="#"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Documentation
        </a>
        <Avatar size="sm">
          <AvatarFallback className="text-xs">{USER.initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
