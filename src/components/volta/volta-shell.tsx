"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { provideCart } from "@/lib/agent/cart"
import { useSearchAssist } from "@/lib/config/use-surface"
import { bagCount, bagSubtotal, useBag } from "@/lib/volta/bag"
import { formatPrice } from "@/lib/volta/format"
import { useOverlays } from "@/lib/volta/overlays"
import type { NavModel, SearchEntry } from "@/lib/volta/types"

import { BagOverlay } from "./bag-overlay"
import { Footer } from "./footer"
import { Header } from "./header"
import { NavOverlay } from "./nav-overlay"
import { PromoStripe } from "./promo-stripe"
import { SearchOverlay } from "./search-overlay"

/**
 * Chrome shared by every Volta route: violator stripe, header, the three
 * overlays, footer.
 *
 * Catalog-derived props are threaded in from the server layout because
 * `@/lib/catalog` imports `node:fs` and cannot be reached from a client
 * component.
 */
export function VoltaShell({
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
  const searchAssist = useSearchAssist("volta")

  // The bag persists to localStorage with `skipHydration`, so the read happens
  // here rather than at import time — otherwise the server render and the first
  // client render disagree about what is in the bag.
  React.useEffect(() => {
    void useBag.persist.rehydrate()
  }, [])

  // The agent can ask what is in the cart. Read live at call time, so it
  // sees the cart as it is then, not as it was when the page loaded.
  React.useEffect(
    () =>
      provideCart(() => {
        const lines = useBag.getState().lines
        return {
          lines: lines.map((line) => ({
            slug: line.slug,
            name: line.name,
            variant: [line.flavour, line.size].filter(Boolean).join(" · "),
            quantity: line.quantity,
            price: formatPrice(line.price),
            lineTotal: formatPrice(line.price * line.quantity),
            url: line.href,
          })),
          count: bagCount(lines),
          subtotal: formatPrice(bagSubtotal(lines)),
        }
      }),
    [],
  )

  // An overlay left open across a route change would cover the page the shopper
  // just asked for.
  React.useEffect(() => {
    close()
  }, [pathname, close])

  return (
    <div className="volta flex min-h-dvh flex-col">
      <PromoStripe />
      <Header nav={nav} />

      {/* Bottom padding clears the agent bar the embed fixes to the viewport. */}
      <main className="flex-1">{children}</main>

      <Footer />

      <NavOverlay nav={nav} />
      {searchAssist && (
        <SearchOverlay index={searchIndex} categories={nav.categories} />
      )}
      <BagOverlay />
    </div>
  )
}
