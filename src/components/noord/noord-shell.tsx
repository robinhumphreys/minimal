"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { provideCart } from "@/lib/agent/cart"
import { useSearchAssist } from "@/lib/config/use-surface"
import { bagCount, bagSubtotal, useBag } from "@/lib/noord/bag"
import { formatPrice } from "@/lib/noord/format"
import { useOverlays } from "@/lib/noord/overlays"
import { searchPath } from "@/lib/search-url"
import type { NavModel, SearchEntry } from "@/lib/noord/types"

import { BagOverlay } from "./bag-overlay"
import { Footer } from "./footer"
import { Header } from "./header"
import { Invitation } from "./invitation"
import { NavOverlay } from "./nav-overlay"
import { SearchOverlay } from "./search-overlay"

/**
 * Catalog-derived props are threaded in here because `@/lib/catalog` imports
 * `node:fs`, unreachable from a client component.
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
  const searchAssist = useSearchAssist("noord")

  // The bag persists via localStorage with `skipHydration`, so it's read
  // here, not at import time, to avoid a server/client hydration mismatch.
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
            variant: line.size ? `Size ${line.size}` : undefined,
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

  // An overlay left open across a route change would cover the page just
  // requested. Search is the exception; it writes its own route while open.
  React.useEffect(() => {
    if (pathname !== searchPath("noord")) close()
  }, [pathname, close])

  return (
    <div className="noord flex min-h-dvh flex-col">
      <Header nav={nav} />

      <main className="flex-1">{children}</main>

      <Invitation seed={pathname} />
      <Footer />

      <NavOverlay nav={nav} />
      {searchAssist && <SearchOverlay index={searchIndex} />}
      <BagOverlay />
    </div>
  )
}
