"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "cn"

import { useOrg } from "@/app/admin/_components/use-org"
import { useAdminStore } from "@/lib/store/admin"

/** The steps that count: the start screen is a door, not a step. */
const FIRST = 2
const LAST = 5

/**
 * Where the merchant is in the flow, with a way back and forward. Read off
 * the address, so it is right on any step however it was reached.
 */
export function OnboardingProgress() {
  const org = useOrg()
  const pathname = usePathname()
  // The pager reuses each step's own rule for advancing, since it's a shortcut through the flow, not around it.
  const matched = useAdminStore((state) => state.matched[org])
  const chosen = useAdminStore((state) => {
    const surface = state.drafts[org].surface
    return (
      surface.entry === "launcher" ||
      surface.searchAssist ||
      surface.productHelp.enabled
    )
  })
  const match = pathname.match(/\/step-(\d)$/)
  const step = match ? Number(match[1]) : null
  if (step === null || step < FIRST) return null

  const href = (n: number) => `/admin/${org}/agent/onboarding/step-${n}`
  const complete: Record<number, boolean> = {
    // Step two is done when its loader has run to the end.
    2: matched,
    // Step three when at least one surface is on.
    3: chosen,
    // Step four has nothing to finish: the surfaces are set up as built.
    4: true,
  }
  const canAdvance = step < LAST && complete[step] === true

  return (
    <nav
      aria-label="Onboarding progress"
      className="flex items-center gap-1 text-sm text-muted-foreground"
    >
      <Arrow href={step > FIRST ? href(step - 1) : null} label="Previous step">
        <ChevronLeftIcon className="size-4" />
      </Arrow>
      <span className="tabular-nums">
        {step - FIRST + 1}/{LAST - FIRST + 1}
      </span>
      <Arrow href={canAdvance ? href(step + 1) : null} label="Next step">
        <ChevronRightIcon className="size-4" />
      </Arrow>
    </nav>
  )
}

function Arrow({
  href,
  label,
  children,
}: {
  href: string | null
  label: string
  children: React.ReactNode
}) {
  const className = cn(
    "flex size-7 items-center justify-center rounded-md",
    href ? "hover:bg-black/5 hover:text-foreground" : "opacity-30",
  )
  return href ? (
    <Link href={href} aria-label={label} className={className}>
      {children}
    </Link>
  ) : (
    <span aria-hidden="true" className={className}>
      {children}
    </span>
  )
}
