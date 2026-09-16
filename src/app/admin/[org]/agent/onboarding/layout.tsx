import type { Metadata } from "next"

import { Pane } from "@/app/admin/_components/pane"

export const metadata: Metadata = {
  title: "Onboarding · Minimal AI",
}

/**
 * The steps are routes rather than state on one page, so any of them can be
 * opened directly — worth more than guarding the order while the flow is still
 * being built and demoed.
 *
 * The flow has a header of its own, a level behind the pane: a grey sheet
 * with a rounded top that the white pane sits on, so the six screens read as
 * one thing with a name rather than six screens.
 */
export default function OnboardingLayout({
  children,
}: LayoutProps<"/admin/[org]/agent/onboarding">) {
  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-xl bg-neutral-200/70">
      <header className="flex h-11 shrink-0 items-center px-4">
        <h1 className="font-heading text-sm font-medium text-foreground/80">
          Set up your agentic storefront
        </h1>
      </header>
      <Pane>{children}</Pane>
    </div>
  )
}
