"use client"

import * as React from "react"

import { useRouter } from "next/navigation"
import { CheckIcon, RotateCcwIcon, SparklesIcon } from "lucide-react"

import { NextButton } from "@/app/admin/_components/next-button"
import { useOrg } from "@/app/admin/_components/use-org"
import {
  agentInstructionsFor,
  snippetsFor,
  type SnippetKey,
} from "@/lib/install"
import { useAdminStore } from "@/lib/store/admin"

import {
  CopyButton,
  InstallSnippets,
  type SnippetState,
} from "./install-snippets"
import { SITES } from "./loader-stage"

/** What the site says back when asked whether the agent is on it. */
type Pong = {
  type: "minimal:pong"
  id: string
  launcher: boolean
  searchAssist: boolean
  productHelp?: boolean
  published: boolean
}

/** The rows tick one after another, once the site has answered. */
const TICK_MS = 500

/**
 * How long to wait for the site to answer before calling the check failed.
 * A site without the embed never answers, so without this the rows would
 * spin for ever and the button would stay disabled.
 */
const TIMEOUT_MS = 8000

/**
 * The last step: the merchant takes the agent to their site, and this same
 * screen checks that it arrived. One row per surface that is on, with the
 * code to paste; Check now publishes the draft and asks the site, and each
 * row's circle becomes a tick as the site confirms it. Check again until
 * every row is in place; then Finish.
 *
 * The site is loaded in a hidden frame and pinged; the embed answers from
 * its own DOM, so a tick means a shopper would see it too. In this demo the
 * site is ours and the snippets are already in it.
 */
export function InstallStep({ next }: { next: string }) {
  const org = useOrg()
  const router = useRouter()
  const site = SITES[org]
  const config = useAdminStore((state) => state.drafts[org])
  const publish = useAdminStore((state) => state.publish)

  React.useEffect(() => {
    useAdminStore.getState().hydrate()
  }, [])

  // `attempt` is 0 until Check now; each check loads the site afresh.
  const [attempt, setAttempt] = React.useState(0)
  const [pong, setPong] = React.useState<Pong | null>(null)
  const [timedOut, setTimedOut] = React.useState(false)
  const [ticked, setTicked] = React.useState(0)
  const frame = React.useRef<HTMLIFrameElement>(null)

  const check = () => {
    publish(org)
    setPong(null)
    setTimedOut(false)
    setTicked(0)
    setAttempt((n) => n + 1)
  }

  // Ask until answered or out of time: the frame may still be loading when
  // the first ping goes out, and a ping into a page without the embed is
  // simply ignored.
  React.useEffect(() => {
    if (attempt === 0 || pong || timedOut) return
    const onMessage = (event: MessageEvent) => {
      const data = event.data as Partial<Pong> | null
      if (data?.type === "minimal:pong" && data.id === org) {
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
    const deadline = window.setTimeout(() => setTimedOut(true), TIMEOUT_MS)
    return () => {
      window.removeEventListener("message", onMessage)
      window.clearInterval(timer)
      window.clearTimeout(deadline)
    }
  }, [org, attempt, pong, timedOut])

  const snippets = snippetsFor(config)
  const found: Record<SnippetKey, boolean> = {
    script: pong !== null,
    search: pong?.searchAssist ?? false,
    guide: pong?.productHelp ?? false,
  }

  // Tick the rows one at a time once the answer is in.
  React.useEffect(() => {
    if (!pong || ticked >= snippets.length) return
    const timer = window.setTimeout(() => setTicked((n) => n + 1), TICK_MS)
    return () => window.clearTimeout(timer)
  }, [pong, ticked, snippets.length])

  const checking =
    attempt > 0 && !timedOut && (pong === null || ticked < snippets.length)
  const status = Object.fromEntries(
    snippets.map((snippet, index) => [
      snippet.key,
      attempt === 0
        ? "idle"
        : timedOut
          ? "fail"
          : pong === null || index >= ticked
            ? "checking"
            : found[snippet.key]
              ? "pass"
              : "fail",
    ]),
  ) as Partial<Record<SnippetKey, SnippetState>>
  const allFound =
    attempt > 0 && !checking && snippets.every((s) => found[s.key])
  const missing = attempt > 0 && !checking && !allFound

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-10 overflow-y-auto px-8 py-16">
      {attempt > 0 ? (
        <iframe
          key={attempt}
          ref={frame}
          src={`${site.path}?check=${attempt}`}
          title={site.domain}
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute size-px opacity-0"
        />
      ) : null}

      <h1 className="font-heading text-3xl tracking-tight text-balance">
        {allFound ? "Your agent is live" : "Embed the agent on your site"}
      </h1>

      <div className="flex w-full max-w-lg flex-col gap-4">
        <InstallSnippets config={config} status={status} />
        {missing ? (
          <p role="status" className="text-sm text-muted-foreground">
            {timedOut
              ? `${site.domain} did not answer. Make sure the body tag is on the page, then check again.`
              : `Some of the code is not on ${site.domain} yet. Paste what is missing, then check again.`}
          </p>
        ) : null}
      </div>

      <div className="absolute right-8 bottom-8 flex items-center gap-2">
        <CopyButton
          text={agentInstructionsFor(config)}
          label="Copy agent instructions"
          variant="outline"
          size="lg"
          icon={<SparklesIcon />}
        />
        {allFound ? (
          <NextButton onClick={() => router.push(next)} icon={<CheckIcon />}>
            Finish
          </NextButton>
        ) : (
          <NextButton
            onClick={check}
            disabled={checking}
            icon={attempt > 0 ? <RotateCcwIcon /> : undefined}
          >
            {checking ? "Checking…" : attempt > 0 ? "Check again" : "Check now"}
          </NextButton>
        )}
      </div>
    </div>
  )
}
