"use client"

import * as React from "react"

import { useRouter } from "next/navigation"
import { CheckIcon, ClipboardIcon, SparklesIcon } from "lucide-react"

import { useOrg } from "@/app/admin/_components/use-org"
import { Button } from "@/components/ui/button"
import { agentInstructionsFor, snippetsFor } from "@/lib/install"
import { useAdminStore } from "@/lib/store/admin"

/**
 * Step five: the merchant takes the agent to their site. One block per
 * surface they switched on, or the whole install written for a coding agent.
 *
 * Finish is the one moment the draft goes live: everything before this was
 * a rehearsal on the studio's ground, and a snippet that loads an unpublished
 * agent would load nothing.
 */
export function InstallStep({ next }: { next: string }) {
  const org = useOrg()
  const router = useRouter()
  const config = useAdminStore((state) => state.drafts[org])
  const publish = useAdminStore((state) => state.publish)
  const completeOnboarding = useAdminStore((state) => state.completeOnboarding)

  React.useEffect(() => {
    useAdminStore.getState().hydrate()
  }, [])

  const snippets = snippetsFor(config)

  return (
    <div className="relative flex h-full flex-col items-center overflow-y-auto px-8 py-16">
      <div className="flex w-full max-w-2xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl tracking-tight text-balance">
            Put it on your site
          </h1>
          <p className="text-sm text-muted-foreground">
            Paste these where they say, or hand the whole job to your coding
            agent. Then finish, and we will check it is in place.
          </p>
        </div>

        <ol className="flex flex-col gap-5">
          {snippets.map((snippet, index) => (
            <li key={snippet.title} className="flex flex-col gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-muted-foreground tabular-nums">
                  {index + 1}
                </span>
                <span className="text-sm font-medium">{snippet.title}</span>
                <span className="text-xs text-muted-foreground">
                  {snippet.where}
                </span>
              </div>
              <Code text={snippet.code} />
            </li>
          ))}
        </ol>

        <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-4">
          <SparklesIcon className="size-4 shrink-0 text-muted-foreground" />
          <p className="flex-1 text-sm text-muted-foreground">
            Using Claude Code, Cursor or the like? Copy the install as a set of
            instructions it can carry out.
          </p>
          <CopyButton
            text={agentInstructionsFor(config)}
            label="Copy agent instructions"
            variant="outline"
          />
        </div>
      </div>

      <div className="absolute right-8 bottom-8">
        <Button
          size="lg"
          onClick={() => {
            publish(org)
            completeOnboarding(org)
            router.push(next)
          }}
        >
          Finish
          <CheckIcon />
        </Button>
      </div>
    </div>
  )
}

function Code({ text }: { text: string }) {
  return (
    <div className="relative rounded-lg border bg-muted/40">
      <pre className="overflow-x-auto p-3 pr-24 font-mono text-xs leading-relaxed whitespace-pre-wrap">
        {text}
      </pre>
      <CopyButton
        text={text}
        label="Copy"
        variant="ghost"
        className="absolute top-1.5 right-1.5"
      />
    </div>
  )
}

/** Copies, and says so for a moment. */
function CopyButton({
  text,
  label,
  variant,
  className,
}: {
  text: string
  label: string
  variant: "outline" | "ghost"
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(timer)
  }, [copied])

  return (
    <Button
      size="sm"
      variant={variant}
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
        } catch {
          // No clipboard here; the text is on screen to select.
        }
      }}
    >
      {copied ? <CheckIcon /> : <ClipboardIcon />}
      {copied ? "Copied" : label}
    </Button>
  )
}
