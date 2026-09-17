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

/** The org slug is the one source of truth for which merchant is being edited; the store follows it. */
export default async function OrgLayout({
  children,
  params,
}: LayoutProps<"/admin/[org]">) {
  const { org } = await params
  if (!isBrandId(org)) notFound()

  return (
    <OrgSync org={org}>
      {/* The embed's utility classes live in its own stylesheet; React 19 hoists this `precedence` link into <head>. */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/embed.css" precedence="default" />
      <TooltipProvider>
        {/* `h-svh overflow-hidden` pins the shell to the viewport; `min-h-svh` alone would let a long screen stretch the whole admin. */}
        <SidebarProvider defaultOpen={false} className="h-svh overflow-hidden">
          <AppSidebar org={org} />
          <SidebarInset className="min-h-0 bg-muted/40">
            {/* See `Pane`: each screen brings its own, so a flow can put something above it without losing its corners. */}
            <div className="flex min-h-0 flex-1 flex-col p-2 md:p-4">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </OrgSync>
  )
}
