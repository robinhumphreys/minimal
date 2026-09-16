"use client"

import * as React from "react"

import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "cn"

import { useOrg } from "@/app/admin/_components/use-org"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { useAdminStore } from "@/lib/store/admin"

type FeatureKey = "siteChat" | "searchAssist" | "productHelp"

const FEATURES: {
  key: FeatureKey
  title: string
  description: string
  thumb: React.ReactNode
  soon?: boolean
}[] = [
  {
    key: "siteChat",
    title: "Site chat",
    description: "A chat button on every page.",
    thumb: <SiteChatThumb />,
  },
  {
    key: "searchAssist",
    title: "Search assist",
    description: "AI-powered search results.",
    thumb: <SearchAssistThumb />,
  },
  {
    key: "productHelp",
    title: "Product help",
    description: "Answers on product pages. Coming soon.",
    thumb: <ProductHelpThumb />,
    soon: true,
  },
]

/**
 * Step three: which surfaces the agent gets. Decided before any of them is
 * shown, so the next step only previews what was chosen — and nothing here
 * is published; that is the last step's job.
 *
 * Choice cards rather than switches: each is a whole row to read and click,
 * and more than one can be on, so the mark is a checkbox rather than a radio.
 */
export function FeaturesStep({ next }: { next: string }) {
  const org = useOrg()
  const config = useAdminStore((state) => state.drafts[org])
  const editDraft = useAdminStore((state) => state.editDraft)

  React.useEffect(() => {
    useAdminStore.getState().hydrate()
  }, [])

  const enabled: Record<FeatureKey, boolean> = {
    siteChat: config.surface.entry === "launcher",
    searchAssist: config.surface.searchAssist,
    productHelp: false,
  }

  const set = (key: FeatureKey, on: boolean) =>
    editDraft(org, (current) => ({
      ...current,
      surface: {
        ...current.surface,
        ...(key === "siteChat"
          ? { entry: on ? "launcher" : "none" }
          : key === "searchAssist"
            ? { searchAssist: on }
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
      </div>

      <FieldGroup className="w-full max-w-lg gap-3">
        {FEATURES.map((feature) => {
          const id = `feature-${feature.key}`
          return (
            <FieldLabel key={feature.key} htmlFor={id}>
              <Field
                orientation="horizontal"
                data-disabled={feature.soon || undefined}
                className="items-center gap-4 p-4!"
              >
                <Checkbox
                  id={id}
                  checked={enabled[feature.key]}
                  disabled={feature.soon}
                  onCheckedChange={(checked) =>
                    set(feature.key, checked === true)
                  }
                />
                <FieldContent>
                  <FieldTitle>{feature.title}</FieldTitle>
                  <FieldDescription>{feature.description}</FieldDescription>
                </FieldContent>
                {feature.thumb}
              </Field>
            </FieldLabel>
          )
        })}
      </FieldGroup>

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

/*
 * Thumbnails: each surface as a few grey shapes, small enough to read as a
 * glyph of the thing rather than a picture of it. Drawn rather than
 * screenshotted so they are the same weight as the type beside them, and
 * so the merchant's own preview, one step on, is the first real one.
 */

function Thumb({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative block h-21 w-30 shrink-0 overflow-hidden rounded-md border bg-background",
        className,
      )}
    >
      {/* Drawn at the smaller size and scaled up as one, so the shapes keep
          their proportions to each other as the card grows. */}
      <span className="absolute top-0 left-0 block h-14 w-20 origin-top-left scale-150">
        {children}
      </span>
    </span>
  )
}

/** A page with a small window open above a round button, bottom right. */
function SiteChatThumb() {
  return (
    <Thumb className="border-sky-200 bg-sky-50">
      <span className="absolute inset-x-2 top-2 h-1 rounded-full bg-sky-200" />
      <span className="absolute top-5 left-2 h-1 w-6 rounded-full bg-sky-200" />
      <span className="absolute top-7 left-2 h-1 w-9 rounded-full bg-sky-200" />
      <span className="absolute top-4 right-2 flex h-6 w-8 flex-col gap-0.5 rounded-sm border border-sky-200 bg-white p-1 shadow-sm">
        <span className="h-1 w-4 rounded-full bg-sky-200" />
        <span className="ml-auto h-1 w-3 rounded-full bg-sky-500" />
      </span>
      <span className="absolute right-2 bottom-2 size-3 rounded-full bg-sky-600 shadow-sm" />
    </Thumb>
  )
}

/** A search box, two chips, and two product tiles under it. */
function SearchAssistThumb() {
  return (
    <Thumb className="border-violet-200 bg-violet-50">
      <span className="absolute inset-x-2 top-2 flex h-3 items-center gap-1 rounded-sm border border-violet-300 bg-white px-1">
        <span className="size-1 rounded-full border border-violet-500" />
        <span className="h-0.5 w-6 rounded-full bg-violet-300" />
      </span>
      <span className="absolute top-6 left-2 flex gap-1">
        <span className="h-1.5 w-5 rounded-full bg-violet-600" />
        <span className="h-1.5 w-4 rounded-full border border-violet-300 bg-white" />
      </span>
      <span className="absolute bottom-2 left-2 h-4 w-7 rounded-sm bg-violet-200" />
      <span className="absolute right-2 bottom-2 h-4 w-7 rounded-sm bg-violet-200" />
    </Thumb>
  )
}

/** A product image beside its title, with a question answered under it. */
function ProductHelpThumb() {
  return (
    <Thumb className="border-amber-200 bg-amber-50">
      <span className="absolute top-2 left-2 h-6 w-6 rounded-sm bg-amber-200" />
      <span className="absolute top-2 left-10 h-1 w-7 rounded-full bg-amber-400" />
      <span className="absolute top-4 left-10 h-1 w-4 rounded-full bg-amber-200" />
      <span className="absolute inset-x-2 bottom-2 flex h-4 flex-col justify-center gap-0.5 rounded-sm bg-white px-1 shadow-sm">
        <span className="h-0.5 w-8 rounded-full bg-amber-500" />
        <span className="h-0.5 w-11 rounded-full bg-amber-200" />
      </span>
    </Thumb>
  )
}
