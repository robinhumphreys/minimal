"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

import type { BrandId } from "@/lib/catalog/types"

export function searchPath(brand: BrandId) {
  return `/${brand}/search`
}

/**
 * Gives the search overlay a URL, `/<brand>/search?q=…`, without moving the
 * page underneath it.
 *
 * The overlay is a sheet over whatever the shopper was looking at, so a real
 * navigation would swap that page out. Instead the URL is written with the
 * native history API, which Next folds into `usePathname` without fetching
 * the route. Opening pushes an entry, so the browser's back button closes
 * the sheet; submitting rewrites that entry with the query, so a reload or a
 * shared link lands on the same answer. The `/search` route itself exists for
 * those landings and renders the home page as the backdrop.
 *
 * Two kinds of change meet here. A change to `open` came from the interface
 * (a button, Escape) and is mirrored to the URL. A change to the pathname
 * with `open` untouched came from the browser (back, a link in the results, a
 * direct landing) and is mirrored to the overlay.
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
    // `show`, `close` and `onLanding` are stable or read fresh; only the
    // open/route pair should re-run this.
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
