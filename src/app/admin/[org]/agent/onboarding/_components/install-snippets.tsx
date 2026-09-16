"use client"

import * as React from "react"

import { CheckIcon, ClipboardIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldTitle,
} from "@/components/ui/field"
import type { AgentConfig } from "@/lib/config/schema"
import { snippetsFor } from "@/lib/install"

/**
 * What to paste, one card per surface that is on: the same card the surfaces
 * were chosen with two steps earlier, now carrying the code that installs
 * each one. Copy sits in the card's own header, never over the code.
 */
export function InstallSnippets({ config }: { config: AgentConfig }) {
  return (
    <FieldGroup className="gap-3">
      {snippetsFor(config).map((snippet) => (
        <Field
          key={snippet.title}
          className="gap-3 rounded-lg border bg-card p-4"
        >
          <div className="flex items-start gap-3">
            <FieldContent>
              <FieldTitle>{snippet.title}</FieldTitle>
              <FieldDescription>{snippet.where}</FieldDescription>
            </FieldContent>
            <CopyButton text={snippet.code} label="Copy" variant="outline" />
          </div>
          <pre className="overflow-x-auto rounded-md bg-muted px-3 py-2.5 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground/80">
            {snippet.code}
          </pre>
        </Field>
      ))}
    </FieldGroup>
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
      {copied ? "Copied" : label}
    </Button>
  )
}
