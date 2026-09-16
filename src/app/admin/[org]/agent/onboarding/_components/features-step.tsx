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
        "relative block h-21 w-30 shrink-0 overflow-hidden",
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

/*
 * Three shapes each, two greys and one accent. The accent is the one thing
 * in each picture that the agent adds to the page.
 */
const ACCENT = "bg-brand"

/** A window with one bubble each way, and the round button under it. */
function SiteChatThumb() {
  return (
    <Thumb>
      <span className="absolute top-2 right-4 bottom-4 left-3 flex flex-col gap-1 rounded-[3px] border border-black/10 bg-white p-1.5">
        <span className="h-2 w-7 rounded-[2px] bg-neutral-200" />
        <span className={cn("ml-auto h-2 w-5 rounded-[2px]", ACCENT)} />
        <span className="h-2 w-9 rounded-[2px] bg-neutral-200" />
      </span>
      <span
        className={cn(
          "absolute right-1.5 bottom-1.5 size-3.5 rounded-full ring-2 ring-white",
          ACCENT,
        )}
      />
    </Thumb>
  )
}

/** A search box with something typed, and two products under it. */
function SearchAssistThumb() {
  return (
    <Thumb>
      <span className="absolute inset-x-2 top-2 flex h-3.5 items-center gap-1 rounded-[3px] border border-black/15 bg-white px-1">
        <span className="h-[3px] w-8 rounded-full bg-neutral-400" />
        <span className={cn("ml-0.5 h-2 w-[2px]", ACCENT)} />
      </span>
      <span className="absolute bottom-2 left-2 flex h-6 w-7 flex-col gap-0.5">
        <span className="flex-1 rounded-[2px] bg-neutral-200" />
        <span className="h-[3px] w-4 rounded-full bg-neutral-400" />
      </span>
      <span className="absolute right-2 bottom-2 flex h-6 w-7 flex-col gap-0.5">
        <span className="flex-1 rounded-[2px] bg-neutral-200" />
        <span className="h-[3px] w-5 rounded-full bg-neutral-400" />
      </span>
    </Thumb>
  )
}

/** A product, and one question answered beside it. */
function ProductHelpThumb() {
  return (
    <Thumb>
      <span className="absolute top-2 bottom-2 left-2 w-7 rounded-[2px] bg-neutral-200" />
      <span className="absolute top-2.5 left-10.5 h-[3px] w-7 rounded-full bg-neutral-400" />
      <span className="absolute top-5 left-10.5 h-[3px] w-4 rounded-full bg-neutral-300" />
      <span className="absolute bottom-2 left-10.5 flex items-center gap-1">
        <span
          className={cn(
            "flex size-2.5 shrink-0 items-center justify-center rounded-full text-[6px] leading-none font-semibold text-white",
            ACCENT,
          )}
        >
          ?
        </span>
        <span className="h-[3px] w-5 rounded-full bg-neutral-400" />
      </span>
    </Thumb>
  )
}
