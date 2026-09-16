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
  /**
   * Whether the merchant has been offered the surfaces yet this session. The
   * defaults ship with every surface on, which is right for a storefront and
   * wrong for a choice: the first visit to that step starts from nothing.
   */
  surfacesOffered: Record<BrandId, boolean>
  markSurfacesOffered: (id: BrandId) => void
  /**
   * Whether step two has run to the end for this organisation. The pager
   * cannot go past a step that has not finished, and this is the one step
   * whose finishing is a matter of time rather than of a choice.
   */
  matched: Record<BrandId, boolean>
  markMatched: (id: BrandId) => void
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
  surfacesOffered: { noord: false, volta: false },
  matched: { noord: false, volta: false },
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

  markMatched: (id) =>
    set((state) =>
      state.matched[id] ? state : { matched: { ...state.matched, [id]: true } },
    ),

  markSurfacesOffered: (id) =>
    set((state) => ({
      surfacesOffered: { ...state.surfacesOffered, [id]: true },
    })),

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
