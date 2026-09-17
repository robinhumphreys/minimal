import type { Metadata } from "next"

import { Pane } from "@/app/admin/_components/pane"
import { SidebarTrigger } from "@/components/ui/sidebar"

import { OnboardingProgress } from "./_components/onboarding-progress"

export const metadata: Metadata = {
  title: "Onboarding · Minimal AI",
}

/** Steps are routes, not state on one page, so any can be opened directly while the flow is still being built. */
export default function OnboardingLayout({
  children,
}: LayoutProps<"/admin/[org]/agent/onboarding">) {
  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-xl bg-neutral-200/70">
      <header className="flex h-11 shrink-0 items-center gap-2 pr-4 pl-2 md:pl-4">
        {/* On a phone the rail is a sheet with nothing to open it from, so this header lends it a button. */}
        <SidebarTrigger className="-ml-1 md:hidden" />
        <h1 className="min-w-0 flex-1 truncate font-heading text-sm font-medium text-foreground/80">
          Set up your agentic storefront
        </h1>
        <OnboardingProgress />
      </header>
      <Pane>{children}</Pane>
    </div>
  )
}
