"use client"

import * as React from "react"

import Link from "next/link"
import {
  ArrowRightIcon,
  MessageCircleIcon,
  PackageSearchIcon,
  SearchIcon,
} from "lucide-react"
import { cn } from "cn"

import { useOrg } from "@/app/admin/_components/use-org"
import { Button } from "@/components/ui/button"
import { useAdminStore } from "@/lib/store/admin"

type Feature = {
  key: "siteChat" | "searchAssist" | "productHelp"
  title: string
  description: string
  icon: React.ReactNode
  soon?: boolean
}

const FEATURES: Feature[] = [
  {
    key: "siteChat",
    title: "Site chat",
    description:
      "A launcher on every page. Shoppers ask in their own words and get a short answer with products to tap.",
    icon: <MessageCircleIcon />,
  },
  {
    key: "searchAssist",
    title: "Search assist",
    description:
      "Your search box, read by the agent. A vague search still gets products, a line, and a way to narrow it down.",
    icon: <SearchIcon />,
  },
  {
    key: "productHelp",
    title: "Product help",
    description:
      "On a product page: the questions shoppers ask before they buy, answered from the product itself.",
    icon: <PackageSearchIcon />,
    soon: true,
  },
]

/**
 * Step three: which surfaces the agent gets. Decided before any of them is
 * shown, so the next step only previews what was chosen — and nothing here
 * is published; that is the last step's job.
 */
export function FeaturesStep({ next }: { next: string }) {
  const org = useOrg()
  const config = useAdminStore((state) => state.drafts[org])
  const editDraft = useAdminStore((state) => state.editDraft)

  React.useEffect(() => {
    useAdminStore.getState().hydrate()
  }, [])

  const enabled = {
    siteChat: config.surface.entry === "launcher",
    searchAssist: config.surface.searchAssist,
    productHelp: false,
  }

  const toggle = (key: Feature["key"]) =>
    editDraft(org, (current) => ({
      ...current,
      surface: {
        ...current.surface,
        ...(key === "siteChat"
          ? {
              entry: current.surface.entry === "launcher" ? "none" : "launcher",
            }
          : key === "searchAssist"
            ? { searchAssist: !current.surface.searchAssist }
            : {}),
      },
    }))

  const anyOn = enabled.siteChat || enabled.searchAssist

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-10 px-8 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl tracking-tight text-balance">
          Where should the agent work?
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Switch on what you want. You will see each one on your own site in the
          next step, and nothing goes live until the end.
        </p>
      </div>

      <ul className="grid w-full max-w-3xl gap-3 sm:grid-cols-3">
        {FEATURES.map((feature) => {
          const on = enabled[feature.key]
          return (
            <li key={feature.key}>
              <button
                type="button"
                disabled={feature.soon}
                aria-pressed={on}
                onClick={() => toggle(feature.key)}
                className={cn(
                  "flex h-full w-full flex-col gap-3 rounded-xl border p-5 text-left transition-colors",
                  on
                    ? "border-foreground bg-card"
                    : "border-border bg-card/60 text-muted-foreground hover:border-foreground/40",
                  feature.soon && "cursor-not-allowed opacity-60",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg [&_svg]:size-4",
                      on
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {feature.icon}
                  </span>
                  <Switch on={on} soon={feature.soon} />
                </div>
                <span className="text-base font-medium text-foreground">
                  {feature.title}
                </span>
                <span className="text-sm leading-relaxed">
                  {feature.description}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="absolute right-8 bottom-8">
        <Button
          size="lg"
          disabled={!anyOn}
          nativeButton={false}
          render={<Link href={next} />}
        >
          Next
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  )
}

/** The state of a feature, drawn as a switch; the whole card is the control. */
function Switch({ on, soon }: { on: boolean; soon?: boolean }) {
  if (soon) {
    return (
      <span className="rounded-full bg-muted px-2 py-0.5 text-[0.6875rem] font-medium text-muted-foreground">
        Soon
      </span>
    )
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative h-5 w-9 rounded-full transition-colors",
        on ? "bg-primary" : "bg-muted-foreground/30",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-4 rounded-full bg-white shadow transition-[left]",
          on ? "left-[1.125rem]" : "left-0.5",
        )}
      />
    </span>
  )
}
