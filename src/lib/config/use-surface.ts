"use client"

import * as React from "react"

import type { BrandId } from "@/lib/catalog/types"

import { agentConfigSchema, type AgentConfig } from "./schema"
import { readPublishedOrDefault } from "./storage"

/**
 * Drafts the admin is previewing in this frame, by brand. The onboarding
 * posts them in the same message the embed listens for, so the storefront
 * and the agent agree about what is switched on.
 */
const previews = new Map<BrandId, AgentConfig>()
const listeners = new Set<() => void>()

let wired = false
function wire() {
  if (wired || typeof window === "undefined") return
  wired = true

  // Another tab published a change.
  window.addEventListener("storage", (event) => {
    if (event.key?.startsWith("published:")) emit()
  })

  // The admin is previewing an unpublished draft in an iframe.
  window.addEventListener("message", (event: MessageEvent) => {
    const data = event.data as { type?: string; config?: unknown } | null
    if (!data || data.type !== "minimal:preview") return
    const parsed = agentConfigSchema.safeParse(data.config)
    if (!parsed.success) return
    previews.set(parsed.data.id, parsed.data)
    emit()
  })
}

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  wire()
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * The config this storefront should behave as: the admin's draft when this
 * page is its preview, otherwise what is published. On the server, and on
 * the onboarding's "before the agent" view, nothing is on.
 */
function useSurface<T>(
  id: BrandId,
  pick: (config: AgentConfig) => T,
  off: T,
): T {
  return React.useSyncExternalStore(
    subscribe,
    () => {
      const params = new URLSearchParams(window.location.search)
      if (params.get("minimal-agent") === "off") return off
      return pick(previews.get(id) ?? readPublishedOrDefault(id))
    },
    () => off,
  )
}

/**
 * Whether the agent reads this storefront's search.
 *
 * Search on either storefront exists for the agent to answer it, so when the
 * merchant has Search assist off there is no search at all.
 */
export function useSearchAssist(id: BrandId): boolean {
  return useSurface(id, (config) => config.surface.searchAssist, false)
}

/**
 * Whether the agent offers a guided choice on this storefront.
 *
 * The band a category page wraps around the guide is the storefront's, but
 * it only makes sense with the embed's button in it, so it goes with it.
 */
export function useProductHelp(id: BrandId): boolean {
  return useSurface(id, (config) => config.surface.productHelp.enabled, false)
}
