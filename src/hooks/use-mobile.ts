import * as React from "react"

const MOBILE_BREAKPOINT = 768
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onStoreChange)
  return () => mql.removeEventListener("change", onStoreChange)
}

/**
 * The media query is an external store, so it is read with
 * `useSyncExternalStore` rather than mirrored into state from an effect — the
 * effect version renders once at the wrong width before correcting itself.
 * The server snapshot is `false`: there is no viewport to measure, and desktop
 * is what the shell renders into on first paint.
 */
export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}
