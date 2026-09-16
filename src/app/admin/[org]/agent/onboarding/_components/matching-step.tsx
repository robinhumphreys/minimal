"use client"

import * as React from "react"

import Link from "next/link"

import { DotGrid } from "@paper-design/shaders-react"
import {
  ArrowRightIcon,
  CheckIcon,
  CompassIcon,
  LoaderCircleIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { BrandMark } from "@/components/brand/brand-mark"
import { Button } from "@/components/ui/button"
import type { BrandId } from "@/lib/catalog/types"
import { useOrg } from "@/app/admin/_components/use-org"

/**
 * The dot field behind the browser. Hex rather than the theme's CSS variables
 * because the shader parses colours into WebGL floats and cannot read `var()`.
 */
const GRID = {
  colorBack: "#ffffff",
  colorFill: "#ededed",
} as const

/** Distance between dots. Every measurement on this screen is a multiple. */
const GAP = 32

/**
 * Where the shader puts its dots relative to the centre of its own canvas.
 * Measured rather than documented: the pattern's origin falls midway between
 * dots on both axes, so the canvas needs half a cell of correction before a
 * dot will sit where its centre is.
 */
const DOT_PHASE = GAP / 2

/**
 * The merchant's own address, as it would read in a browser. There is no
 * accounts API, so each brand's is named here alongside the storefront route
 * the mini browser actually renders.
 */
const SITES: Record<BrandId, { domain: string; path: string }> = {
  noord: { domain: "noordsuits.com", path: "/noord" },
  volta: { domain: "voltanutrition.com", path: "/volta" },
}

/**
 * The storefront is rendered at desktop width and scaled down, rather than
 * loaded into a narrow frame, so the mini browser shows the site's desktop
 * layout — the one the merchant recognises — instead of its mobile one.
 *
 * The frame is sized in whole grid cells — 16 across, 10 down under a title
 * bar of exactly one — so its edges land on the dot field rather than cutting
 * through it.
 */
const VIEWPORT = { width: 1440, height: 900 }
const FRAME_WIDTH = GAP * 16
const FRAME_HEIGHT = GAP * 10
const SCALE = FRAME_WIDTH / VIEWPORT.width

/**
 * The work being reported, in the order it happens. Nothing is really running
 * — the configs for both brands ship as defaults — but the merchant is being
 * asked to wait, and a wait with named stages is a wait they can read.
 */
function tasksFor(
  domain: string,
): { label: string; detail?: string; ms: number }[] {
  return [
    // Long enough to register as a step having happened, short enough that
    // the merchant sees their own site almost immediately.
    { label: "Fetch website", detail: domain, ms: 500 },
    { label: "Extracting color and typography", ms: 5500 },
    { label: "Building custom widgets", ms: 5000 },
  ]
}

/**
 * The waiting screen. Nothing here is interactive: the merchant's only job is
 * to watch their own site being read, so the screen's whole content is the
 * evidence that we are looking at the right one.
 */
export function MatchingStep({ next }: { next: string }) {
  // Which merchant is being set up is the organisation in the address, the
  // same as every other admin screen.
  const brand = useOrg()
  const site = SITES[brand]
  const tasks = tasksFor(site.domain)
  // How many rows have finished. The row at this index is the one in progress;
  // when it passes the last index every row is done and the timer stops.
  const [done, setDone] = React.useState(0)
  const { root, viewport, offset } = useGridAlignment()
  const finished = done >= tasks.length

  React.useEffect(() => {
    const current = tasks[done]
    if (!current) return
    const timer = setTimeout(() => setDone((count) => count + 1), current.ms)
    return () => clearTimeout(timer)
    // `tasks` is rebuilt each render, so depend on the one value that moves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  return (
    <div
      ref={root}
      className="relative flex h-full flex-col items-center justify-center gap-10 overflow-hidden rounded-xl px-8 py-16"
    >
      {/* Bled a whole cell past every edge so the field still covers the
          corners once it has been nudged into alignment. */}
      <div
        aria-hidden="true"
        className="absolute -inset-8"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        <DotGrid
          width="100%"
          height="100%"
          colorBack={GRID.colorBack}
          colorFill={GRID.colorFill}
          colorStroke="#ffffff"
          size={2}
          gapX={GAP}
          gapY={GAP}
          strokeWidth={0}
          sizeRange={0}
          opacityRange={0}
          shape="circle"
        />
      </div>

      {/* Shrinks as one piece below `md`: scaling the frame keeps the
          storefront inside it undistorted, which re-flowing would not. Three
          quarters of a 32px cell is 24px, so the frame stays a whole number of
          pixels and its edges stay crisp. */}
      <div className="relative max-md:scale-75">
        <BrowserFrame
          brand={brand}
          domain={site.domain}
          path={site.path}
          fetched={done > 0}
          finished={finished}
          viewportRef={viewport}
        />
      </div>

      <div className="relative flex flex-col items-center gap-6">
        <p className="text-lg tracking-tight">
          {finished ? "Ready to go!" : "Setting up your storefront"}
        </p>

        <Checklist tasks={tasks} done={done} />
      </div>

      {/* Held back until every row has ticked. Nothing on this screen is worth
          reading once the work is done, so the only thing that appears is the
          way out of it. */}
      <AnimatePresence>
        {finished ? (
          <motion.div
            key="next"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute right-8 bottom-8"
          >
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href={next} />}
            >
              Next
              <ArrowRightIcon />
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

/**
 * Locks the dot field's phase to the browser's viewport.
 *
 * The shader anchors its pattern at the centre of its own canvas, so a dot's
 * position is only predictable relative to that centre — and which of the two
 * half-phases it lands on is not something the canvas can be asked. So pick
 * the reference point that makes the answer not matter: the viewport is a
 * whole, even number of cells on both axes, so every one of its corners sits
 * the same distance in cells from its centre. Give the canvas centre that
 * centre's phase, corrected by `DOT_PHASE`, and the corners land on dots.
 *
 * Only the remainder is applied. Moving the canvas by whole cells would change
 * nothing about the pattern and everything about whether it still reaches the
 * edges.
 */
function useGridAlignment() {
  const root = React.useRef<HTMLDivElement>(null)
  const viewport = React.useRef<HTMLDivElement>(null)
  const [offset, setOffset] = React.useState({ x: 0, y: 0 })

  React.useLayoutEffect(() => {
    const align = () => {
      const rootBox = root.current?.getBoundingClientRect()
      const viewportBox = viewport.current?.getBoundingClientRect()
      if (!rootBox || !viewportBox) return

      const phase = (distance: number) =>
        ((((distance % GAP) + GAP) % GAP) + DOT_PHASE) % GAP

      setOffset({
        x: phase(
          viewportBox.left +
            viewportBox.width / 2 -
            (rootBox.left + rootBox.width / 2),
        ),
        y: phase(
          viewportBox.top +
            viewportBox.height / 2 -
            (rootBox.top + rootBox.height / 2),
        ),
      })
    }

    align()

    // The frame is centred in the root, so anything that changes the root's
    // box moves it: the rail collapsing, the window resizing. A late font
    // resizes neither box but does re-flow the column underneath, which shifts
    // the frame without either observer firing — hence the second pass.
    const observer = new ResizeObserver(align)
    if (root.current) observer.observe(root.current)
    if (viewport.current) observer.observe(viewport.current)
    document.fonts?.ready.then(align)

    return () => observer.disconnect()
  }, [])

  return { root, viewport, offset }
}

/**
 * The stages, ticked off as they pass. Left-aligned inside the centred column
 * — a ragged left edge would cost the rows the vertical line the markers give
 * them, which is what makes the list scannable at a glance.
 */
function Checklist({
  tasks,
  done,
}: {
  tasks: { label: string; detail?: string }[]
  done: number
}) {
  return (
    <ul aria-live="polite" className="flex flex-col gap-2.5 text-sm">
      {tasks.map((task, index) => {
        const complete = index < done
        const active = index === done

        return (
          <li key={task.label} className="flex items-center gap-2.5">
            <Marker complete={complete} active={active} />
            <span className={complete || active ? undefined : "opacity-50"}>
              {task.label}
            </span>
            {task.detail ? (
              <span className="text-muted-foreground">{task.detail}</span>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

/** A row's status: filled tick, spinner, or an empty well waiting its turn. */
function Marker({ complete, active }: { complete: boolean; active: boolean }) {
  if (complete) {
    return (
      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
        <CheckIcon className="size-2.5" strokeWidth={3.5} />
      </span>
    )
  }

  if (active) {
    return (
      <LoaderCircleIcon className="size-4 shrink-0 animate-spin text-muted-foreground" />
    )
  }

  return <span className="size-4 shrink-0 rounded-full bg-muted" />
}

/**
 * A browser window around a live, scaled-down render of the storefront.
 *
 * The storefront is only uncovered once the checklist says it has been
 * fetched. The iframe is mounted the whole time regardless, so it has loaded
 * by the time the placeholder lifts and the reveal is immediate.
 */
function BrowserFrame({
  brand,
  domain,
  path,
  fetched,
  finished,
  viewportRef,
}: {
  brand: BrandId
  domain: string
  path: string
  fetched: boolean
  finished: boolean
  viewportRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    // The stroke goes round the whole window, not just the title bar. It sits
    // a hairline outside the viewport's box; alignment is measured off the
    // viewport itself, so the border cannot knock the grid out of phase.
    <div className="overflow-hidden rounded-xl border bg-card shadow-2xl shadow-black/10">
      <div
        className="relative flex items-center border-b bg-muted/50 px-3"
        style={{ height: GAP }}
      >
        <div className="flex gap-1.5">
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
        </div>
        {/* Centred on the bar rather than on the space the lights leave, so
            the address sits under the middle of the window. */}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5 text-[0.6875rem] text-muted-foreground">
          {/* The merchant's own favicon, where a browser would put it. It is
              the same mark the account switcher shows, so the window reads as
              their site and not a generic frame. */}
          <BrandMark brand={brand} className="size-3.5 rounded-[3px]" />
          {domain}
        </span>
      </div>

      <div
        ref={viewportRef}
        className="relative overflow-hidden"
        style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}
      >
        <iframe
          // The site as it is before the agent: the surfaces are set up in
          // the steps that follow, and showing them here would be showing
          // the answer before the question.
          src={`${path}?minimal-agent=off`}
          title={domain}
          tabIndex={-1}
          scrolling="no"
          className="pointer-events-none origin-top-left border-0"
          style={{
            width: VIEWPORT.width,
            height: VIEWPORT.height,
            transform: `scale(${SCALE})`,
          }}
        />
        <AnimatePresence>
          {fetched ? null : (
            <motion.div
              key="placeholder"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              // Opaque: the iframe behind it has already loaded, and a
              // translucent cover would show the very thing this step says it
              // has not fetched yet.
              className="absolute inset-0 flex items-center justify-center bg-muted"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
              >
                <CompassIcon
                  className="size-8 text-muted-foreground/60"
                  strokeWidth={1.5}
                />
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {fetched ? <ScanSweep active={!finished} /> : null}
      </div>
    </div>
  )
}

/**
 * The band of light that travels down the frame.
 *
 * It fades in as it enters and out as it leaves, then waits a beat before the
 * next pass. Looping the travel alone is what made it look mechanical: the
 * band arrived at the bottom edge still at full strength and reappeared at the
 * top in the same frame.
 *
 * White because the storefronts' own imagery is what it has to show up
 * against, and that is uniformly dark.
 *
 * Once the checklist is done the sweep has nothing left to stand for, so it
 * fades out mid-pass rather than being cut, and unmounts once it has — an
 * invisible element looping on every frame is still looping on every frame.
 */
function ScanSweep({ active }: { active: boolean }) {
  const [mounted, setMounted] = React.useState(true)

  if (!mounted) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onAnimationComplete={() => {
        if (!active) setMounted(false)
      }}
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-transparent via-white/15 to-white/40"
        // Travel and fade share one timeline, so `y` carries a keyframe at each
        // of the fade's turning points. The values are spaced in proportion to
        // `times` to keep the speed constant across all three legs.
        animate={{
          y: ["-60%", "-21.6%", "180%", "260%"],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 3,
          times: [0, 0.12, 0.75, 1],
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
      />
    </motion.div>
  )
}
