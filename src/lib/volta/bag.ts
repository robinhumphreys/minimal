"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

// A bag line snapshots what it needs to render, since the client cannot join
// a slug against the catalog (`@/lib/catalog` imports `node:fs`).
export type BagLine = {
  /** `Product.slug` in the Volta catalog. Identity, with `flavour`. */
  slug: string
  /** The chosen flavour, e.g. "Vanilla". Products with one flavour still set it. */
  flavour: string
  quantity: number
  name: string
  /** Cents, EUR. */
  price: number
  image: string
  href: string
  /** From `attributes.size`, e.g. "1000 g". Shown as a second meta line. */
  size?: string
}

type BagState = {
  lines: BagLine[]
  /**
   * False until `persist` reads localStorage, so the server-rendered empty
   * bag matches the first client render before filling in.
   */
  hydrated: boolean
  add: (line: BagLine) => void
  setQuantity: (slug: string, flavour: string, quantity: number) => void
  remove: (slug: string, flavour: string) => void
  clear: () => void
  markHydrated: () => void
}

function sameLine(line: BagLine, slug: string, flavour: string) {
  return line.slug === slug && line.flavour === flavour
}

export const useBag = create<BagState>()(
  persist(
    (set) => ({
      lines: [],
      hydrated: false,

      add: (line) =>
        set((state) => {
          const known = state.lines.some((l) =>
            sameLine(l, line.slug, line.flavour),
          )
          if (!known) return { lines: [...state.lines, line] }
          return {
            lines: state.lines.map((l) =>
              sameLine(l, line.slug, line.flavour)
                ? { ...l, quantity: l.quantity + line.quantity }
                : l,
            ),
          }
        }),

      setQuantity: (slug, flavour, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => !sameLine(l, slug, flavour))
              : state.lines.map((l) =>
                  sameLine(l, slug, flavour) ? { ...l, quantity } : l,
                ),
        })),

      remove: (slug, flavour) =>
        set((state) => ({
          lines: state.lines.filter((l) => !sameLine(l, slug, flavour)),
        })),

      clear: () => set({ lines: [] }),

      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "volta:bag",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
      // Read on the client only, once <VoltaShell> mounts.
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
