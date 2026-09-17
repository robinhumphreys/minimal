"use client"

import * as React from "react"

import type { BrandId } from "@/lib/catalog/types"

import { agentConfigSchema, type AgentConfig } from "./schema"
import { readPublishedOrDefault } from "./storage"

/**
 * Drafts the admin is previewing, by brand: posted in the same message the
 * embed listens for, so storefront and agent agree on what's switched on.
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
 * Draft config when this page is the admin's preview, otherwise the
 * published one; nothing on the server or before onboarding's agent step.
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
 * Search only exists on either storefront for the agent to answer, so
 * switching Search assist off removes search entirely.
 */
export function useSearchAssist(id: BrandId): boolean {
  return useSurface(id, (config) => config.surface.searchAssist, false)
}

/**
 * Whether the agent offers a guided choice: the storefront's band around it
 * only makes sense with the embed's button, so the two ship together.
 */
export function useProductHelp(id: BrandId): boolean {
  return useSurface(id, (config) => config.surface.productHelp.enabled, false)
}
