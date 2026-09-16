"use client"

import * as React from "react"

import { useRouter } from "next/navigation"
import { CheckIcon, SparklesIcon } from "lucide-react"

import { useOrg } from "@/app/admin/_components/use-org"
import { Button } from "@/components/ui/button"
import { agentInstructionsFor } from "@/lib/install"
import { useAdminStore } from "@/lib/store/admin"

import { CopyButton, InstallSnippets } from "./install-snippets"

/**
 * Step five: the merchant takes the agent to their site. One card per surface
 * they switched on, or the whole install written for a coding agent.
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

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-10 overflow-y-auto px-8 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-heading text-3xl tracking-tight text-balance">
          Put it on your site
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Paste each of these where it says, or hand the whole job to your
          coding agent. Finish when it is in, and we will check.
        </p>
      </div>

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
