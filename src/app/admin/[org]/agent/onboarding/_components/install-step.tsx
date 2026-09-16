"use client"

import * as React from "react"

import { useRouter } from "next/navigation"
import { SparklesIcon } from "lucide-react"

import { NextButton } from "@/app/admin/_components/next-button"
import { useOrg } from "@/app/admin/_components/use-org"
import { agentInstructionsFor } from "@/lib/install"
import { useAdminStore } from "@/lib/store/admin"

import { CopyButton, InstallSnippets } from "./install-snippets"

/**
 * Step five: the merchant takes the agent to their site. One card per surface
 * they switched on, or the whole install written for a coding agent.
 *
 * Check now is the one moment the draft goes live: everything before this
 * was a rehearsal on the studio's ground, and a snippet that loads an
 * unpublished agent would load nothing. The check itself is the next step.
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

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-10 overflow-y-auto px-8 py-16">
      <h1 className="font-heading text-3xl tracking-tight text-balance">
        Embed the agent on your site
      </h1>

      <div className="w-full max-w-lg">
        <InstallSnippets config={config} />
      </div>

      <div className="absolute right-8 bottom-8 flex items-center gap-2">
        <CopyButton
          text={agentInstructionsFor(config)}
          label="Copy agent instructions"
          variant="outline"
          size="lg"
          icon={<SparklesIcon />}
        />
        <NextButton
          onClick={() => {
            publish(org)
            completeOnboarding(org)
            router.push(next)
          }}
        >
          Check now
        </NextButton>
      </div>
    </div>
  )
}
