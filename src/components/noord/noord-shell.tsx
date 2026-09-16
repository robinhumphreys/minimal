"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { useBag } from "@/lib/noord/bag"
import { useOverlays } from "@/lib/noord/overlays"
import type { NavModel, SearchEntry } from "@/lib/noord/types"

import { BagOverlay } from "./bag-overlay"
import { Footer } from "./footer"
import { Header } from "./header"
import { NavOverlay } from "./nav-overlay"
import { SearchOverlay } from "./search-overlay"

/**
 * Chrome shared by every Noord route: header, the three overlays, footer.
 *
 * Catalog-derived props are threaded in from the server layout because
 * `@/lib/catalog` imports `node:fs` and cannot be reached from a client
 * component.
 */
export function NoordShell({
  nav,
  searchIndex,
  children,
}: {
  nav: NavModel
  searchIndex: SearchEntry[]
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const close = useOverlays((state) => state.close)

  // The bag persists to localStorage with `skipHydration`, so the read happens
  // here rather than at import time — otherwise the server render and the first
  // client render disagree about what is in the bag.
  React.useEffect(() => {
    void useBag.persist.rehydrate()
  }, [])

  // An overlay left open across a route change would cover the page the shopper
  // just asked for.
  React.useEffect(() => {
    close()
  }, [pathname, close])

  return (
    <div className="noord flex min-h-dvh flex-col">
      <Header nav={nav} />

      {/* Bottom padding clears the agent bar the embed fixes to the viewport. */}
      <main className="flex-1 pb-noord-agent-bar">{children}</main>

      <Footer />

      <NavOverlay nav={nav} />
      <SearchOverlay index={searchIndex} />
      <BagOverlay />
    </div>
  )
}
