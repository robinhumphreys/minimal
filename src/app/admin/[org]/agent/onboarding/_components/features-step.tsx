"use client"

import * as React from "react"

import { useOrg } from "@/app/admin/_components/use-org"
import { NextButton } from "@/app/admin/_components/next-button"
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
    description: "A guided choice, from a button on the page.",
    thumb: <ProductHelpThumb />,
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
    const store = useAdminStore.getState()
    store.hydrate()
    // A choice starts from nothing, even for an agent already live: this is
    // the flow being run, not the site. Once the merchant has been here the
    // draft carries what they chose, so coming back does not clear it.
    if (!store.surfacesOffered[org]) {
      store.editDraft(org, (current) => ({
        ...current,
        surface: {
          ...current.surface,
          entry: "none",
          searchAssist: false,
          productHelp: { ...current.surface.productHelp, enabled: false },
        },
      }))
      store.markSurfacesOffered(org)
    }
  }, [org])

  const enabled: Record<FeatureKey, boolean> = {
    siteChat: config.surface.entry === "launcher",
    searchAssist: config.surface.searchAssist,
    productHelp: config.surface.productHelp.enabled,
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
            : {
                productHelp: { ...current.surface.productHelp, enabled: on },
              }),
      },
    }))

  const anyOn = enabled.siteChat || enabled.searchAssist || enabled.productHelp

  return (
    // Scrolls rather than centres when the cards are taller than the screen:
    // `m-auto` on the column centres it when there is room and lets it start
    // at the top when there is not, which `justify-center` would clip.
    <div className="relative flex h-full flex-col overflow-y-auto px-4 py-10 sm:px-8 md:py-16">
      <div className="m-auto flex w-full max-w-lg flex-col items-center gap-8 md:gap-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-heading text-3xl tracking-tight text-balance">
            Where should the agent work?
          </h1>
        </div>

        <FieldGroup className="w-full gap-3">
          {FEATURES.map((feature) => {
            const id = `feature-${feature.key}`
            return (
              <FieldLabel
                key={feature.key}
                htmlFor={id}
                // Chosen cards take the brand's own colour, not the admin's
                // neutral primary.
                className="has-data-checked:border-brand/40 has-data-checked:bg-brand/5 has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:has-data-checked:hover:bg-brand/10"
              >
                <Field
                  orientation="horizontal"
                  data-disabled={feature.soon || undefined}
                  className="items-center gap-4 p-4!"
                >
                  <Checkbox
                    id={id}
                    className="data-checked:border-brand data-checked:bg-brand"
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

        {/* Under the cards on a phone, in the corner where there is one. */}
        <div className="self-end md:absolute md:right-8 md:bottom-8">
          <NextButton href={next} disabled={!anyOn}>
            Next
          </NextButton>
        </div>
      </div>
    </div>
  )
}

/*
 * Thumbnails: each surface as a line drawing in Minimal's blue — a stroke for
 * the page's own furniture, a fill for the thing the agent adds to it.
 * Drawn as SVG rather than assembled from boxes, so the corners, weights
 * and spacing are the same kind of thing as an icon's.
 */

function Thumb({ children }: { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 84"
      // Grey until the card is chosen; then the brand's blue. Dropped on a
      // phone, where the row has room for the words or the picture, not both.
      className="h-21 w-30 shrink-0 text-muted-foreground/70 group-has-data-checked/field-label:text-brand max-sm:hidden"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

/** A chat window with a reply in it, and the button that opened it. */
function SiteChatThumb() {
  return (
    <Thumb>
      <rect x="15" y="9" width="76" height="52" rx="6" opacity="0.4" />
      <path d="M23 20h30" strokeWidth="3" opacity="0.4" />
      <rect
        x="23"
        y="28"
        width="32"
        height="9"
        rx="4.5"
        fill="currentColor"
        stroke="none"
        opacity="0.15"
      />
      <rect
        x="51"
        y="41"
        width="32"
        height="9"
        rx="4.5"
        fill="currentColor"
        stroke="none"
      />
      <circle cx="99" cy="69" r="9" fill="currentColor" stroke="none" />
    </Thumb>
  )
}

/** A search typed in, and two results that answer it. */
function SearchAssistThumb() {
  return (
    <Thumb>
      <rect x="15" y="9" width="90" height="16" rx="8" opacity="0.4" />
      <circle cx="25" cy="17" r="3" opacity="0.4" />
      <path d="M27.5 19.5l2 2" opacity="0.4" />
      <path d="M36 17h34" strokeWidth="3" opacity="0.3" />
      <rect
        x="75"
        y="12"
        width="2"
        height="10"
        rx="1"
        fill="currentColor"
        stroke="none"
      />
      <rect x="15" y="35" width="41" height="40" rx="4" opacity="0.4" />
      <rect
        x="19"
        y="39"
        width="33"
        height="21"
        rx="2"
        fill="currentColor"
        stroke="none"
        opacity="0.15"
      />
      <path d="M21 68h18" strokeWidth="3" />
      <rect x="64" y="35" width="41" height="40" rx="4" opacity="0.4" />
      <rect
        x="68"
        y="39"
        width="33"
        height="21"
        rx="2"
        fill="currentColor"
        stroke="none"
        opacity="0.15"
      />
      <path d="M70 68h22" strokeWidth="3" />
    </Thumb>
  )
}

/** A product, and a question about it answered on the spot. */
function ProductHelpThumb() {
  return (
    <Thumb>
      <rect
        x="15"
        y="9"
        width="40"
        height="66"
        rx="4"
        fill="currentColor"
        stroke="none"
        opacity="0.15"
      />
      <path d="M63 17h42" strokeWidth="3" opacity="0.4" />
      <path d="M63 27h18" strokeWidth="3" />
      <rect x="63" y="45" width="42" height="24" rx="8" opacity="0.4" />
      <circle cx="74" cy="57" r="5.5" fill="currentColor" stroke="none" />
      <path
        d="M72.4 55.6a1.7 1.7 0 1 1 2.4 1.5c-.6.3-.8.6-.8 1.2M74 60.3v.2"
        stroke="white"
        strokeWidth="1.3"
      />
      <path d="M84 57h14" strokeWidth="3" opacity="0.3" />
    </Thumb>
  )
}
