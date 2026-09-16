"use client"

import * as React from "react"

import { useOrg } from "@/app/admin/_components/use-org"

import { Checklist, LoaderStage, SITES } from "./loader-stage"

/**
 * The work being reported, in the order it happens. Nothing is really running
 * — the configs for both brands ship as defaults — but the merchant is being
 * asked to wait, and a wait with named stages is a wait they can read.
 */
function tasksFor(
  domain: string,
): { label: string; detail?: string; ms: number }[] {
  return [
    // Long enough to register as a step having happened, short enough that
    // the merchant sees their own site almost immediately.
    { label: "Fetch website", detail: domain, ms: 500 },
    { label: "Extracting color and typography", ms: 5500 },
    { label: "Building custom widgets", ms: 5000 },
  ]
}

/**
 * Step two: the merchant watches their own site being read. Nothing is really
 * running — the configs for both brands ship as defaults — but the merchant
 * is being asked to wait, and a wait with named stages is a wait they can
 * read. The site is shown without the agent: the surfaces are set up in the
 * steps that follow, and showing them here would be the answer before the
 * question.
 */
export function MatchingStep({ next }: { next: string }) {
  const brand = useOrg()
  const site = SITES[brand]
  const tasks = tasksFor(site.domain)
  // How many rows have finished. The row at this index is the one in progress;
  // when it passes the last index every row is done and the timer stops.
  const [done, setDone] = React.useState(0)
  const finished = done >= tasks.length

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
