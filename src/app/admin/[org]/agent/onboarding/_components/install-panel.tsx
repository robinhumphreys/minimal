"use client"

import * as React from "react"

import { CheckIcon, ClipboardIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { AgentConfig } from "@/lib/config/schema"
import { agentInstructionsFor, snippetsFor } from "@/lib/install"

/** The install, as a tab of the management screen: what is on the site now. */
export function InstallPanel({ config }: { config: AgentConfig }) {
  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto rounded-lg border p-6">
      <p className="text-sm text-muted-foreground">
        What is pasted into the site. Publishing changes what these load; the
        snippets themselves only change when a surface is switched on or off.
      </p>
      {snippetsFor(config).map((snippet) => (
        <div key={snippet.title} className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium">{snippet.title}</span>
            <span className="text-xs text-muted-foreground">
              {snippet.where}
            </span>
          </div>
          <Code text={snippet.code} />
        </div>
      ))}
      <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/40 p-3">
        <span className="text-sm text-muted-foreground">
          The whole install, for a coding agent.
        </span>
        <Copy
          text={agentInstructionsFor(config)}
          label="Copy agent instructions"
        />
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
      <Copy text={text} label="Copy" className="absolute top-1.5 right-1.5" />
    </div>
  )
}

function Copy({
  text,
  label,
  className,
}: {
  text: string
  label: string
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
      variant="ghost"
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
