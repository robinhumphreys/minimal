"use client"

import * as React from "react"

import { useOrg } from "@/app/admin/_components/use-org"
import { useAdminStore } from "@/lib/store/admin"

import { Checklist, LoaderStage, SITES } from "./loader-stage"

// Nothing is really running here, the configs ship as defaults, but a wait with named stages is a wait they can read.
function tasksFor(
  domain: string,
): { label: string; detail?: string; ms: number }[] {
  return [
    { label: "Fetch website", detail: domain, ms: 500 },
    { label: "Extracting color, typography, voice", ms: 5500 },
    { label: "Building custom widgets", ms: 5000 },
  ]
}

/** The site is shown without the agent: the surfaces are set up in later steps, showing them now would be the answer before the question. */
export function MatchingStep({ next }: { next: string }) {
  const brand = useOrg()
  const site = SITES[brand]
  const tasks = tasksFor(site.domain)
  const [done, setDone] = React.useState(0)
  const finished = done >= tasks.length
  const markMatched = useAdminStore((state) => state.markMatched)

  // Until this fires once, step three stays locked in the pager.
  React.useEffect(() => {
    if (finished) markMatched(brand)
  }, [finished, brand, markMatched])

  React.useEffect(() => {
    const current = tasks[done]
    if (!current) return
    const timer = setTimeout(() => setDone((count) => count + 1), current.ms)
    return () => clearTimeout(timer)
    // `tasks` is rebuilt each render, so depend on the one value that moves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  return (
    <LoaderStage
      brand={brand}
      frameSrc={`${site.path}?minimal-agent=off`}
      fetched={done > 0}
      finished={finished}
      title={finished ? "Ready to go!" : "Setting up your storefront"}
      next={next}
    >
      <Checklist tasks={tasks} done={done} />
    </LoaderStage>
  )
}
