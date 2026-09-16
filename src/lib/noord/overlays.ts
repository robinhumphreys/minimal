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
  /**
   * What was showing when the current overlay opened, so search can offer a
   * back control that returns to the menu when that is where it came from,
   * and closes outright when it was opened from the header.
   */
  from: Overlay | null
  show: (overlay: Overlay) => void
  close: () => void
  /** Returns to the overlay this one was opened from, or closes. */
  back: () => void
  /** For binding straight to a Sheet's `onOpenChange`. */
  toggle: (overlay: Overlay, next: boolean) => void
}

export const useOverlays = create<OverlayState>()((set) => ({
  open: null,
  from: null,
  show: (overlay) => set((state) => ({ open: overlay, from: state.open })),
  close: () => set({ open: null, from: null }),
  back: () => set((state) => ({ open: state.from, from: null })),
  toggle: (overlay, next) =>
    set((state) =>
      next
        ? { open: overlay, from: state.open }
        : state.open === overlay
          ? { open: null, from: null }
          : state,
    ),
}))
