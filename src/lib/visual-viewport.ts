"use client"

import * as React from "react"

export type VisualViewportBox = { top: number; height: number }

/**
 * Where the screen really is, as a box against the layout viewport.
 *
 * On a phone the on-screen keyboard does not shrink the layout viewport that
 * `position: fixed` and `100dvh` are measured against. Safari shrinks the
 * visual viewport instead and pans it to keep the focused field in sight, so
 * a full-screen surface pinned with `inset-0` ends up half under the
 * keyboard with its foot, the composer, out of reach. Sized to this box, the
 * surface shrinks with the keyboard and its foot stays on it. Chrome and
 * Firefox honour `interactive-widget=resizes-content` and the two viewports
 * agree; WebKit has it, Safari has not shipped it.
 *
 * Null on the server, when disabled, and where there is no visual viewport,
 * so the caller falls back to plain `inset-0`.
 */
export function useVisualViewport(enabled: boolean): VisualViewportBox | null {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const viewport = window.visualViewport
      if (!enabled || !viewport) return () => {}

      // iOS reports the keyboard going late, and sometimes not until
      // something else moves: look again once it has had time to go.
      const timers: number[] = []
      const later = () => {
        timers.forEach(window.clearTimeout)
        timers.length = 0
        timers.push(
          window.setTimeout(onChange, 250),
          window.setTimeout(onChange, 1000),
        )
      }

      viewport.addEventListener("resize", onChange)
      viewport.addEventListener("scroll", onChange)
      document.addEventListener("focusout", later)
      return () => {
        timers.forEach(window.clearTimeout)
        viewport.removeEventListener("resize", onChange)
        viewport.removeEventListener("scroll", onChange)
        document.removeEventListener("focusout", later)
      }
    },
    [enabled],
  )

  // A string, so an unchanged box is the same snapshot.
  const snapshot = React.useSyncExternalStore(
    subscribe,
    () => {
      const viewport = window.visualViewport
      if (!enabled || !viewport) return null
      return `${Math.round(viewport.offsetTop)}:${Math.round(viewport.height)}`
    },
    () => null,
  )

  return React.useMemo(() => {
    if (snapshot === null) return null
    const [top, height] = snapshot.split(":").map(Number)
    return { top, height }
  }, [snapshot])
}

/**
 * The box as inline style for a `fixed inset-0` surface: `top` and `height`
 * take over, and `bottom` is left to be ignored.
 */
export function visualViewportStyle(
  box: VisualViewportBox | null,
): React.CSSProperties | undefined {
  if (!box) return undefined
  return { top: box.top, height: box.height, bottom: "auto" }
}

/**
 * Holds the page still under a surface that covers it. The classic iOS
 * lock: `overflow: hidden` alone is not honoured there, so the body is
 * fixed at its current scroll position and put back on release.
 */
export function usePageScrollLock(active: boolean) {
  React.useLayoutEffect(() => {
    if (!active) return
    const { body, documentElement: html } = document
    const scrollY = window.scrollY
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: html.style.overflow,
      overscrollBehavior: html.style.overscrollBehavior,
    }
    body.style.position = "fixed"
    body.style.top = `-${scrollY}px`
    body.style.left = "0"
    body.style.right = "0"
    body.style.width = "100%"
    html.style.overflow = "hidden"
    html.style.overscrollBehavior = "none"
    return () => {
      body.style.position = previous.position
      body.style.top = previous.top
      body.style.left = previous.left
      body.style.right = previous.right
      body.style.width = previous.width
      html.style.overflow = previous.overflow
      html.style.overscrollBehavior = previous.overscrollBehavior
      window.scrollTo(0, scrollY)
    }
  }, [active])
}

/** Whether a media query matches; false on the server and when disabled. */
export function useMediaQuery(query: string, enabled = true) {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      if (!enabled) return () => {}
      const list = window.matchMedia(query)
      list.addEventListener("change", onChange)
      return () => list.removeEventListener("change", onChange)
    },
    [query, enabled],
  )
  return React.useSyncExternalStore(
    subscribe,
    () => enabled && window.matchMedia(query).matches,
    () => false,
  )
}
