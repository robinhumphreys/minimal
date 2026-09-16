"use client"

import * as React from "react"

import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

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
  soon?: boolean
}[] = [
  {
    key: "siteChat",
    title: "Site chat",
    description:
      "A chat button on every page. Shoppers ask in their own words and get a short answer with products to tap.",
  },
  {
    key: "searchAssist",
    title: "Search assist",
    description:
      "Your search box, read by the agent. A vague search still gets products, a line, and a way to narrow it down.",
  },
  {
    key: "productHelp",
    title: "Product help",
    description:
      "On a product page: the questions shoppers ask before they buy, answered from the product itself. Coming soon.",
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
        <p className="max-w-md text-sm text-muted-foreground">
          Switch on what you want. You will see each one on your own site in the
          next step, and nothing goes live until the end.
        </p>
      </div>

      <FieldGroup className="w-full max-w-sm gap-3">
        {FEATURES.map((feature) => {
          const id = `feature-${feature.key}`
          return (
            <FieldLabel key={feature.key} htmlFor={id}>
              <Field
                orientation="horizontal"
                data-disabled={feature.soon || undefined}
              >
                <FieldContent>
                  <FieldTitle>{feature.title}</FieldTitle>
                  <FieldDescription>{feature.description}</FieldDescription>
                </FieldContent>
                <Checkbox
                  id={id}
                  checked={enabled[feature.key]}
                  disabled={feature.soon}
                  onCheckedChange={(checked) =>
                    set(feature.key, checked === true)
                  }
                />
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
