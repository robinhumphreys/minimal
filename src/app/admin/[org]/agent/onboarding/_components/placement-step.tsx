"use client"

import * as React from "react"

import { useOrg } from "@/app/admin/_components/use-org"
import { useAdminStore } from "@/lib/store/admin"

import { Checklist, LoaderStage, SITES } from "./loader-stage"

/** What the site says back when asked whether the agent is on it. */
type Pong = {
  type: "minimal:pong"
  id: string
  launcher: boolean
  searchAssist: boolean
  published: boolean
}

/**
 * Each row waits this long for the one before it. The site answers at once,
 * and a list that lands all at once reads as decoration, not as checking.
 */
const TICK_MS = 900

/**
 * Step six: the site, asked. The same stage as step two, but this time the
 * window shows the site with the agent on it, and the checklist is real:
 * the embed in that window is pinged and answers from its own DOM, so a tick
 * here means a shopper would see it too. In this demo the site is ours and
 * the snippet is already in it, which is why this succeeds without the
 * merchant pasting anything.
 */
export function PlacementStep({ next }: { next: string }) {
  const brand = useOrg()
  const site = SITES[brand]
  const config = useAdminStore((state) => state.drafts[brand])
  const frame = React.useRef<HTMLIFrameElement>(null)
  const [pong, setPong] = React.useState<Pong | null>(null)
  const [done, setDone] = React.useState(0)

  React.useEffect(() => {
    useAdminStore.getState().hydrate()
  }, [])

  // Ask until answered: the window may still be loading when the first ping
  // goes out, and a ping into a page without the embed is simply ignored.
  React.useEffect(() => {
    if (pong) return
    const onMessage = (event: MessageEvent) => {
      const data = event.data as Partial<Pong> | null
      if (data?.type === "minimal:pong" && data.id === brand) {
        setPong(data as Pong)
      }
    }
    window.addEventListener("message", onMessage)
    const timer = window.setInterval(() => {
      frame.current?.contentWindow?.postMessage(
        { type: "minimal:ping" },
        window.location.origin,
      )
    }, 700)
    return () => {
      window.removeEventListener("message", onMessage)
      window.clearInterval(timer)
    }
  }, [brand, pong])

  // One row per thing the merchant switched on, named as it was on the
  // card they switched it on with, and a last row for the whole. A surface
  // that is off has nothing to check and is not listed.
  const tasks = [
    { label: "Script installed correctly", detail: site.domain, ok: true },
    ...(config.surface.entry === "launcher"
      ? [{ label: "Site chat enabled", ok: pong?.launcher ?? false }]
      : []),
    ...(config.surface.searchAssist
      ? [{ label: "Search assist enabled", ok: pong?.searchAssist ?? false }]
      : []),
    { label: "Set up complete", ok: pong?.published ?? false },
  ]

  // Rows tick one at a time once the site has answered, and stop at the
  // first that is not in place.
  React.useEffect(() => {
    if (!pong || done >= tasks.length || !tasks[done].ok) return
    const timer = window.setTimeout(
      () => setDone((count) => count + 1),
      TICK_MS,
    )
    return () => window.clearTimeout(timer)
    // `tasks` is rebuilt each render, so depend on what actually moves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pong, done])

  const finished = done >= tasks.length

  return (
    <LoaderStage
      brand={brand}
      frameSrc={site.path}
      frameRef={frame}
      fetched={pong !== null}
      finished={finished}
      title={finished ? "Your agent is live" : "Checking your site"}
      next={next}
      nextLabel="Go to your agent"
    >
      <Checklist tasks={tasks} done={done} />
    </LoaderStage>
  )
}
