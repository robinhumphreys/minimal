"use client"

import * as React from "react"

import { CheckIcon, ClipboardIcon, LoaderCircleIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import type { AgentConfig } from "@/lib/config/schema"
import { snippetsFor, type SnippetKey } from "@/lib/install"

/** What the site said about each snippet, once asked. */
export type SnippetState = "idle" | "checking" | "pass" | "fail"

/**
 * What to paste, one row per surface that is on, and — once the site has
 * been asked — whether each is in place. The row is the checklist: the same
 * thing the merchant pasted from, ticked, rather than a second screen that
 * says it again.
 */
export function InstallSnippets({
  config,
  status,
}: {
  config: AgentConfig
  /** Per snippet; absent where nothing is being checked. */
  status?: Partial<Record<SnippetKey, SnippetState>>
}) {
  return (
    <ol className="flex flex-col gap-3">
      {snippetsFor(config).map((snippet) => {
        const state = status?.[snippet.key]
        return (
          <li
            key={snippet.key}
            className="flex flex-col gap-3 rounded-lg border bg-card p-4"
          >
            <div className="flex items-start gap-3">
              {state ? <Status state={state} /> : null}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium">{snippet.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">{snippet.where}</p>
              </div>
              <CopyButton text={snippet.code} label="Copy" variant="outline" />
            </div>
            <pre
              className={cn(
                "overflow-x-auto rounded-md bg-muted px-3 py-2.5 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground/80",
                state ? "ml-8" : undefined,
              )}
            >
              {snippet.code}
            </pre>
          </li>
        )
      })}
    </ol>
  )
}

/** Empty, spinning, ticked, or not yet found. */
function Status({ state }: { state: SnippetState }) {
  if (state === "pass") {
    return (
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
        <CheckIcon className="size-3" strokeWidth={3} />
      </span>
    )
  }
  if (state === "checking") {
    return (
      <LoaderCircleIcon className="mt-0.5 size-5 shrink-0 animate-spin text-muted-foreground" />
    )
  }
  return (
    <span
      className={cn(
        "mt-0.5 size-5 shrink-0 rounded-full border-2",
        state === "fail" ? "border-amber-500" : "border-border",
      )}
    />
  )
}

/** Copies, and says so for a moment. */
export function CopyButton({
  text,
  label,
  variant = "outline",
  size = "sm",
  icon,
  className,
}: {
  text: string
  label: string
  variant?: "outline" | "ghost" | "secondary"
  size?: "sm" | "lg"
  icon?: React.ReactNode
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
      size={size}
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
      {copied ? <CheckIcon /> : (icon ?? <ClipboardIcon />)}
      {/* Both labels occupy the same cell, so the button is as wide as the
          longer one whichever is showing, and nothing beside it moves. */}
      <span className="grid">
        <span className={cn("col-start-1 row-start-1", copied && "invisible")}>
          {label}
        </span>
        <span
          className={cn("col-start-1 row-start-1", !copied && "invisible")}
          aria-hidden={!copied}
        >
          Copied
        </span>
      </span>
    </Button>
  )
}
