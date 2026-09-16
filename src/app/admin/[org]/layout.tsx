import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { isBrandId } from "@/lib/catalog/types"

import { AppSidebar } from "../_components/app-sidebar"
import { OrgSync } from "../_components/org-sync"

export const metadata: Metadata = {
  title: "Minimal AI",
}

/**
 * Every admin screen lives under its organisation's slug: `/admin/noord/…`,
 * `/admin/volta/…`. The slug is the one source of truth for which merchant
 * is being edited; the store follows it, not the other way round.
 */
export default async function OrgLayout({
  children,
  params,
}: LayoutProps<"/admin/[org]">) {
  const { org } = await params
  if (!isBrandId(org)) notFound()

  return (
    <OrgSync org={org}>
      {/* The rail starts collapsed: the admin is a handful of screens, and
          the icons plus their tooltips carry it. There is no top bar — the
          mark, the account switcher and the operator all live on the rail,
          so the content column starts at the top of the viewport. */}
      <TooltipProvider>
        {/* The shell is pinned to the viewport and each screen scrolls
            inside its own card. `min-h-svh` alone only sets a floor, so a
            long screen would stretch the whole admin — rail included — and
            take the page scrollbar with it. */}
        <SidebarProvider defaultOpen={false} className="h-svh overflow-hidden">
          <AppSidebar org={org} />
          <SidebarInset className="min-h-0 bg-muted/40">
            {/* Each screen brings its own pane — see `Pane` — so a flow can
                put something above the pane without losing its corners. */}
            <div className="flex min-h-0 flex-1 flex-col p-4">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </OrgSync>
  )
}
