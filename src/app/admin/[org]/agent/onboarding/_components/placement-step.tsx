"use client"

import * as React from "react"

import Link from "next/link"
import {
  ArrowRightIcon,
  CheckIcon,
  LoaderCircleIcon,
  MinusIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { useOrg } from "@/app/admin/_components/use-org"
import { Button } from "@/components/ui/button"
import type { BrandId } from "@/lib/catalog/types"
import { useAdminStore } from "@/lib/store/admin"

const SITES: Record<BrandId, { domain: string; path: string }> = {
  noord: { domain: "noordsuits.com", path: "/noord" },
  volta: { domain: "voltanutrition.com", path: "/volta" },
}

/** What the site says back when asked whether the agent is on it. */
type Pong = {
  type: "minimal:pong"
  id: string
  launcher: boolean
  searchAssist: boolean
  published: boolean
}

type Check = {
  label: string
  detail?: string
  state: "waiting" | "pass" | "skip"
}

/** How long each tick waits for the one before it: the site answers at once,
 *  and a list that lands all at once reads as decoration. */
const TICK_MS = 550

/**
 * Step six: the site, asked. The storefront is loaded in a hidden frame and
 * pinged; the embed answers from its own DOM, so a tick here means a shopper
 * would see it too. In this demo the site is ours and the snippet is already
 * in it, which is why this succeeds without the merchant pasting anything.
 */
export function PlacementStep({ next }: { next: string }) {
  const org = useOrg()
  const site = SITES[org]
  const config = useAdminStore((state) => state.drafts[org])
  const [pong, setPong] = React.useState<Pong | null>(null)
  const [shown, setShown] = React.useState(0)
  const frame = React.useRef<HTMLIFrameElement>(null)

  React.useEffect(() => {
    useAdminStore.getState().hydrate()
  }, [])

  // Ask until answered: the frame may still be loading when the first ping
  // goes out, and a ping into a page without the embed is simply ignored.
  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data as Partial<Pong> | null
      if (data?.type === "minimal:pong" && data.id === org) {
        setPong(data as Pong)
      }
    }
    window.addEventListener("message", onMessage)
    const timer = window.setInterval(() => {
      if (pong) return
      frame.current?.contentWindow?.postMessage(
        { type: "minimal:ping" },
        window.location.origin,
      )
    }, 700)
    return () => {
      window.removeEventListener("message", onMessage)
      window.clearInterval(timer)
    }
  }, [org, pong])

  const checks: Check[] = pong
    ? [
        {
          label: "Script found on your site",
          detail: site.domain,
          state: "pass",
        },
        {
          label: "Live configuration in place",
          state: pong.published ? "pass" : "waiting",
        },
        config.surface.entry === "launcher"
          ? {
              label: "Site chat launcher on the page",
              state: pong.launcher ? "pass" : "waiting",
            }
          : { label: "Site chat", detail: "switched off", state: "skip" },
        config.surface.searchAssist
          ? {
              label: "Search assist armed",
              detail: "shows when a shopper searches",
              state: pong.searchAssist ? "pass" : "waiting",
            }
          : { label: "Search assist", detail: "switched off", state: "skip" },
      ]
    : [
        {
          label: "Script found on your site",
          detail: site.domain,
          state: "waiting",
        },
        { label: "Live configuration in place", state: "waiting" },
        { label: "Site chat launcher on the page", state: "waiting" },
        { label: "Search assist armed", state: "waiting" },
      ]

  // Reveal one tick at a time once the answer is in.
  React.useEffect(() => {
    if (!pong || shown >= checks.length) return
    const timer = window.setTimeout(() => setShown((n) => n + 1), TICK_MS)
    return () => window.clearTimeout(timer)
  }, [pong, shown, checks.length])

  const done = pong !== null && shown >= checks.length
  const allGood = done && checks.every((check) => check.state !== "waiting")

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-8 px-8 py-16">
      <iframe
        ref={frame}
        src={`${site.path}`}
        title={site.domain}
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none absolute size-px opacity-0"
      />

      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl tracking-tight text-balance">
          {done
            ? allGood
              ? "It's on your site"
              : "Nearly there"
            : "Checking your site"}
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          {done
            ? allGood
              ? "Everything you switched on is in place and live."
              : "Something is not in place yet. Paste the snippet and check again."
            : `Looking at ${site.domain} for the agent.`}
        </p>
      </div>

      <ul aria-live="polite" className="flex flex-col gap-3 text-sm">
        {checks.map((check, index) => (
          <li key={check.label} className="flex items-center gap-2.5">
            <Marker
              state={pong && index < shown ? check.state : "waiting"}
              active={!pong || index === shown}
            />
            <span
              className={
                check.state === "skip" ? "text-muted-foreground" : undefined
              }
            >
              {check.label}
            </span>
            {check.detail ? (
              <span className="text-muted-foreground">{check.detail}</span>
            ) : null}
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {done ? (
          <motion.div
            key="next"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute right-8 bottom-8"
          >
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href={next} />}
            >
              Go to your agent
              <ArrowRightIcon />
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function Marker({ state, active }: { state: Check["state"]; active: boolean }) {
  if (state === "pass") {
    return (
      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
        <CheckIcon className="size-2.5" strokeWidth={3.5} />
      </span>
    )
  }
  if (state === "skip") {
    return (
      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <MinusIcon className="size-2.5" strokeWidth={3} />
      </span>
    )
  }
  if (active) {
    return (
      <LoaderCircleIcon className="size-4 shrink-0 animate-spin text-muted-foreground" />
    )
  }
  return <span className="size-4 shrink-0 rounded-full bg-muted" />
}
