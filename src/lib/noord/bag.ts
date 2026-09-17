"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

/**
 * Snapshot rather than a slug lookup: `@/lib/catalog` imports `node:fs`, so
 * the client can't join against it at render time.
 */
export type BagLine = {
  /** `Product.slug` in the Noord catalog. Identity, with `size`. */
  slug: string
  /** The chosen size label, e.g. "48" or "M". */
  size: string
  quantity: number
  name: string
  /** Cents, EUR. */
  price: number
  /** Cents, EUR. Shown struck through when present. */
  compareAt?: number
  image: string
  href: string
}

type BagState = {
  lines: BagLine[]
  /**
   * False until `persist` reads localStorage, gating the header count and
   * bag overlay so server and first client render agree.
   */
  hydrated: boolean
  add: (line: BagLine) => void
  setQuantity: (slug: string, size: string, quantity: number) => void
  remove: (slug: string, size: string) => void
  clear: () => void
  markHydrated: () => void
}

function sameLine(line: BagLine, slug: string, size: string) {
  return line.slug === slug && line.size === size
}

export const useBag = create<BagState>()(
  persist(
    (set) => ({
      lines: [],
      hydrated: false,

      add: (line) =>
        set((state) => {
          const known = state.lines.some((l) =>
            sameLine(l, line.slug, line.size),
          )
          if (!known) return { lines: [...state.lines, line] }
          return {
            lines: state.lines.map((l) =>
              sameLine(l, line.slug, line.size)
                ? { ...l, quantity: l.quantity + line.quantity }
                : l,
            ),
          }
        }),

      setQuantity: (slug, size, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => !sameLine(l, slug, size))
              : state.lines.map((l) =>
                  sameLine(l, slug, size) ? { ...l, quantity } : l,
                ),
        })),

      remove: (slug, size) =>
        set((state) => ({
          lines: state.lines.filter((l) => !sameLine(l, slug, size)),
        })),

      clear: () => set({ lines: [] }),

      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "noord:bag",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
      // Read on the client only, once <NoordShell> mounts.
      skipHydration: true,
      onRehydrateStorage: () => (state) => state?.markHydrated(),
    },
  ),
)

export function bagCount(lines: BagLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0)
}

export function bagSubtotal(lines: BagLine[]): number {
  return lines.reduce((total, line) => total + line.price * line.quantity, 0)
}
