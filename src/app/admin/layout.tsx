import type { Metadata } from "next"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

import { AppSidebar } from "./_components/app-sidebar"
import { TopBar } from "./_components/top-bar"

export const metadata: Metadata = {
  title: "Minimal AI",
}

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    // The rail starts collapsed: the admin is a handful of screens, and the
    // icons plus their tooltips carry it. `flex-col` turns the sidebar wrapper
    // into a column so the top bar can span the full width above the rail.
    <TooltipProvider>
      <SidebarProvider defaultOpen={false} className="flex-col">
        <TopBar />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset className="bg-muted/40">
            <div className="flex flex-1 flex-col p-4">
              <div className="flex-1 rounded-xl border bg-card shadow-xs">
                {children}
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
