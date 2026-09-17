"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

import type { BrandId } from "@/lib/catalog/types"

export function searchPath(brand: BrandId) {
  return `/${brand}/search`
}

/**
 * Gives the search overlay a URL without navigating: a real route change
 * would swap out the page the overlay sits over, so history is written directly.
 */
export function useSearchUrl({
  brand,
  open,
  show,
  close,
  onLanding,
}: {
  brand: BrandId
  open: boolean
  show: () => void
  close: () => void
  /** Called with the `q` from the URL when the shopper lands on the route. */
  onLanding: (query: string) => void
}) {
  const path = searchPath(brand)
  const router = useRouter()
  const onRoute = usePathname() === path

  const wasOpen = React.useRef(open)
  /** Whether the current `/search` entry is one this hook pushed. */
  const pushed = React.useRef(false)

  React.useEffect(() => {
    const opened = open && !wasOpen.current
    const closed = !open && wasOpen.current
    wasOpen.current = open

    if (opened) {
      if (!onRoute) {
        window.history.pushState(null, "", path)
        pushed.current = true
      }
      return
    }
    if (closed) {
      if (onRoute) {
        if (pushed.current) window.history.back()
        else router.replace(`/${brand}`)
      }
      pushed.current = false
      return
    }
    if (open && !onRoute) {
      pushed.current = false
      close()
    }
    if (!open && onRoute) {
      pushed.current = false
      onLanding(new URLSearchParams(window.location.search).get("q") ?? "")
      show()
    }
    // Only the open/route pair should re-run this; other deps are stable or read fresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onRoute])

  /** Writes the submitted query into the current `/search` entry. */
  const setQuery = React.useCallback(
    (query: string) => {
      const url = query ? `${path}?q=${encodeURIComponent(query)}` : path
      window.history.replaceState(null, "", url)
    },
    [path],
  )

  return { setQuery }
}
