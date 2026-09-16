"use client"

import { create } from "zustand"

import { BRAND_IDS, type BrandId } from "@/lib/catalog/types"
import { defaultConfig } from "@/lib/config/defaults"
import type { AgentConfig } from "@/lib/config/schema"
import { readPublishedOrDefault, writePublished } from "@/lib/config/storage"

type Drafts = Record<BrandId, AgentConfig>

type AdminState = {
  active: BrandId
  drafts: Drafts
  /** Bumped on every draft edit so the preview can re-post. */
  revision: number
  hydrated: boolean
  setActive: (id: BrandId) => void
  /** Replaces the draft for `id` with the result of `recipe`. */
  editDraft: (id: BrandId, recipe: (draft: AgentConfig) => AgentConfig) => void
  publish: (id: BrandId) => void
  /** Seeds every draft from localStorage. Safe to call more than once. */
  hydrate: () => void
}

function initialDrafts(): Drafts {
  return {
    noord: defaultConfig("noord"),
    volta: defaultConfig("volta"),
  }
}

// Drafts are memory-only: no `persist` middleware, so a hard refresh discards
// unpublished edits and falls back to whatever was published.
export const useAdminStore = create<AdminState>()((set) => ({
  active: "noord",
  drafts: initialDrafts(),
  revision: 0,
  hydrated: false,

  setActive: (id) => set({ active: id }),

  editDraft: (id, recipe) =>
    set((state) => ({
      drafts: { ...state.drafts, [id]: recipe(state.drafts[id]) },
      revision: state.revision + 1,
    })),

  publish: (id) =>
    set((state) => {
      writePublished(id, state.drafts[id])
      return state
    }),

  hydrate: () =>
    set((state) => {
      if (state.hydrated) return state
      const drafts = initialDrafts()
      for (const id of BRAND_IDS) {
        drafts[id] = readPublishedOrDefault(id)
      }
      return { drafts, hydrated: true, revision: state.revision + 1 }
    }),
}))
