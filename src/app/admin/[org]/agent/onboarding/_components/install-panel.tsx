"use client"

import { SparklesIcon } from "lucide-react"

import type { AgentConfig } from "@/lib/config/schema"
import { agentInstructionsFor } from "@/lib/install"

import { CopyButton, InstallSnippets } from "./install-snippets"

/** The install, as a tab of the management screen: what is on the site now. */
export function InstallPanel({ config }: { config: AgentConfig }) {
  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto rounded-xl border p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="max-w-md text-sm text-muted-foreground">
          What is pasted into the site. Publishing changes what these load; the
          snippets themselves only change when a surface is switched on or off.
        </p>
        <CopyButton
          text={agentInstructionsFor(config)}
          label="Copy agent instructions"
          icon={<SparklesIcon />}
        />
      </div>
      <div className="max-w-lg">
        <InstallSnippets config={config} />
      </div>
    </div>
  )
}
