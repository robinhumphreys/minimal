import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Onboarding · Minimal AI",
}

/**
 * The steps are routes rather than state on one page, so any of them can be
 * opened directly — worth more than guarding the order while the flow is still
 * being built and demoed.
 */
export default function OnboardingLayout({
  children,
}: LayoutProps<"/admin/[org]/agent/onboarding">) {
  return children
}
