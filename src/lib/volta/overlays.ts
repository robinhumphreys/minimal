"use client"

import { create } from "zustand"

/**
 * Which full-screen overlay is showing. Only one can be open at a time, so this
 * is a single slot rather than three booleans — opening the bag from the nav
 * closes the nav for free.
 */
export type Overlay = "nav" | "search" | "bag"

type OverlayState = {
  open: Overlay | null
  show: (overlay: Overlay) => void
  close: () => void
  /** For binding straight to a Sheet's `onOpenChange`. */
  toggle: (overlay: Overlay, next: boolean) => void
}

export const useOverlays = create<OverlayState>()((set) => ({
  open: null,
  show: (overlay) => set({ open: overlay }),
  close: () => set({ open: null }),
  toggle: (overlay, next) =>
    set((state) => ({
      open: next ? overlay : state.open === overlay ? null : state.open,
    })),
}))
