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

/**
 * The chat window itself, as it is on the site: a dark header with an avatar
 * and two lines, an incoming bubble, an outgoing one, and the composer; the
 * round button under its corner.
 */
function SiteChatThumb() {
  return (
    <Thumb className="bg-muted/50">
      <span className="absolute top-2 right-4 bottom-4 left-4 flex flex-col overflow-hidden rounded-[3px] border border-black/10 bg-white shadow-md">
        <span className="flex h-3 items-center gap-1 bg-foreground px-1">
          <span className="size-1.5 rounded-full bg-white/40" />
          <span className="flex flex-col gap-px">
            <span className="h-[3px] w-4 rounded-full bg-white/80" />
            <span className="h-[2px] w-6 rounded-full bg-white/30" />
          </span>
        </span>
        <span className="flex flex-1 flex-col gap-1 p-1">
          <span className="h-2 w-7 rounded-[2px] bg-muted" />
          <span className="ml-auto h-2 w-5 rounded-[2px] bg-foreground" />
          <span className="h-2 w-8 rounded-[2px] bg-muted" />
        </span>
        <span className="mx-1 mb-1 flex h-2.5 items-center justify-end rounded-[2px] bg-muted px-0.5">
          <span className="size-1.5 rounded-full bg-foreground" />
        </span>
      </span>
      <span className="absolute right-1.5 bottom-1.5 size-3.5 rounded-full bg-foreground shadow-md ring-2 ring-white" />
    </Thumb>
  )
}

/**
 * A search with an answer under it: the query in the box, one line from the
 * agent, and two product cards with an image, a name and a price.
 */
function SearchAssistThumb() {
  return (
    <Thumb className="bg-white">
      <span className="absolute inset-x-2 top-2 flex h-3.5 items-center gap-1 rounded-[3px] border border-black/15 px-1">
        <span className="size-1 rounded-full border border-foreground/70" />
        <span className="h-[3px] w-8 rounded-full bg-foreground/70" />
        <span className="ml-0.5 h-2 w-px bg-foreground/60" />
      </span>
      <span className="absolute top-7 left-2 h-2 w-11 rounded-[2px] bg-muted" />
      <span className="absolute bottom-1.5 left-2 flex h-6 w-7 flex-col overflow-hidden rounded-[2px] border border-black/10">
        <span className="h-3 w-full bg-linear-to-br from-neutral-200 to-neutral-300" />
        <span className="flex flex-col gap-px p-0.5">
          <span className="h-[2px] w-4 rounded-full bg-foreground/60" />
          <span className="h-[2px] w-2 rounded-full bg-foreground/30" />
        </span>
      </span>
      <span className="absolute right-2 bottom-1.5 flex h-6 w-7 flex-col overflow-hidden rounded-[2px] border border-black/10">
        <span className="h-3 w-full bg-linear-to-br from-neutral-300 to-neutral-400" />
        <span className="flex flex-col gap-px p-0.5">
          <span className="h-[2px] w-5 rounded-full bg-foreground/60" />
          <span className="h-[2px] w-2 rounded-full bg-foreground/30" />
        </span>
      </span>
    </Thumb>
  )
}

/**
 * A product page with a question answered on it: the image, the title and
 * price beside it, and under them a question mark and an answer.
 */
function ProductHelpThumb() {
  return (
    <Thumb className="bg-white">
      <span className="absolute top-2 left-2 h-7 w-6 rounded-[2px] bg-linear-to-b from-neutral-200 to-neutral-300" />
      <span className="absolute top-2 left-9.5 flex flex-col gap-1">
        <span className="h-[3px] w-8 rounded-full bg-foreground/70" />
        <span className="h-[3px] w-5 rounded-full bg-foreground/30" />
        <span className="mt-0.5 h-[3px] w-3 rounded-full bg-foreground/70" />
      </span>
      <span className="absolute inset-x-2 bottom-1.5 flex h-4 items-center gap-1 rounded-[2px] border border-black/10 bg-muted/60 px-1">
        <span className="flex size-2 shrink-0 items-center justify-center rounded-full bg-foreground text-[5px] leading-none text-white">
          ?
        </span>
        <span className="flex flex-col gap-px">
          <span className="h-[2px] w-8 rounded-full bg-foreground/60" />
          <span className="h-[2px] w-11 rounded-full bg-foreground/25" />
        </span>
      </span>
    </Thumb>
  )
}
