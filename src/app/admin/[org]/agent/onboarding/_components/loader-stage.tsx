"use client"

import * as React from "react"

import { DotGrid } from "@paper-design/shaders-react"
import { CheckIcon, CompassIcon, LoaderCircleIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { BrandMark } from "@/components/brand/brand-mark"
import { NextButton } from "@/app/admin/_components/next-button"
import type { BrandId } from "@/lib/catalog/types"

/** Hex, not CSS variables: the shader parses colours into WebGL floats and cannot read `var()`. */
const GRID = {
  colorBack: "#ffffff",
  colorFill: "#ededed",
} as const

const GAP = 32

/** The pattern's origin falls midway between dots on both axes, so the canvas needs half a cell of correction. */
const DOT_PHASE = GAP / 2

/** There is no accounts API, so each brand's domain is named here alongside the route it renders. */
export const SITES: Record<BrandId, { domain: string; path: string }> = {
  noord: { domain: "noordsuits.com", path: "/noord" },
  volta: { domain: "voltanutrition.com", path: "/volta" },
}

/** Rendered at desktop width and scaled down so the mini browser shows the site's desktop layout, not its mobile one. */
const VIEWPORT = { width: 1440, height: 900 }
const FRAME_WIDTH = GAP * 16
const FRAME_HEIGHT = GAP * 10
const SCALE = FRAME_WIDTH / VIEWPORT.width

export function LoaderStage({
  brand,
  frameSrc,
  frameRef,
  fetched,
  finished,
  title,
  next,
  nextLabel = "Next",
  children,
}: {
  brand: BrandId
  frameSrc: string
  frameRef?: React.Ref<HTMLIFrameElement>
  /** When true, the placeholder over the browser lifts. */
  fetched: boolean
  /** When true, the sweep stops and Next appears. */
  finished: boolean
  title: string
  next: string
  nextLabel?: string
  children: React.ReactNode
}) {
  const site = SITES[brand]
  const { root, viewport, offset } = useGridAlignment()
  const { stage, scale } = useFrameScale()

  return (
    <div
      ref={root}
      className="relative flex h-full flex-col items-center justify-center gap-6 overflow-hidden rounded-xl px-4 py-10 md:gap-10 md:px-8 md:py-16"
    >
      {/* Bled a whole cell past every edge so the field still covers the corners once nudged into alignment. */}
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

      {/* Scaling the frame keeps the storefront undistorted; re-flowing it would not. */}
      <div ref={stage} className="relative flex w-full justify-center">
        <div
          style={{
            width: FRAME_WIDTH * scale,
            height: (FRAME_HEIGHT + GAP) * scale,
          }}
        >
          <div
            className="w-max origin-top-left"
            style={{ transform: `scale(${scale})` }}
          >
            <BrowserFrame
              brand={brand}
              domain={site.domain}
              src={frameSrc}
              frameRef={frameRef}
              fetched={fetched}
              finished={finished}
              viewportRef={viewport}
            />
          </div>
        </div>
      </div>

      <div className="relative flex flex-col items-center gap-6">
        <p className="font-heading text-xl font-semibold tracking-tight">
          {title}
        </p>

        {children}
      </div>

      <AnimatePresence>
        {finished ? (
          <motion.div
            key="next"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute right-4 bottom-4 md:right-8 md:bottom-8"
          >
            <NextButton href={next}>{nextLabel}</NextButton>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

/** Scales to the largest even number of whole cells that fit, so side edges keep landing on dots. */
function useFrameScale() {
  const stage = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(1)

  React.useLayoutEffect(() => {
    const element = stage.current
    if (!element) return
    const fit = () => {
      const cells = Math.floor(element.clientWidth / (GAP * 2)) * 2
      const width = Math.max(GAP * 2, Math.min(FRAME_WIDTH, cells * GAP))
      setScale(width / FRAME_WIDTH)
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { stage, scale }
}

/** The shader anchors its pattern at its own canvas centre, so the canvas is offset by the phase remainder to land dots on the viewport's corners. */
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

    // A late font load re-flows the column without resizing either box, so realign once fonts are ready too.
    const observer = new ResizeObserver(align)
    if (root.current) observer.observe(root.current)
    if (viewport.current) observer.observe(viewport.current)
    document.fonts?.ready.then(align)

    return () => observer.disconnect()
  }, [])

  return { root, viewport, offset }
}

export function Checklist({
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

/** The iframe stays mounted throughout so it has already loaded by the time the placeholder lifts. */
function BrowserFrame({
  brand,
  domain,
  src,
  frameRef,
  fetched,
  finished,
  viewportRef,
}: {
  brand: BrandId
  domain: string
  src: string
  frameRef?: React.Ref<HTMLIFrameElement>
  fetched: boolean
  finished: boolean
  viewportRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    // Alignment is measured off the viewport itself, so this border cannot knock the grid out of phase.
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
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5 text-[0.6875rem] text-muted-foreground">
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
          ref={frameRef}
          src={src}
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
              // Opaque: a translucent cover would show the already-loaded iframe before this step says it's fetched.
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

/** Fades out mid-pass rather than cutting, then unmounts, so it stops animating on every frame once inactive. */
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
        // `y` keyframes are spaced in proportion to `times` to keep speed constant across all three legs.
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
