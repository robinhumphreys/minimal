"use client"

import { DotGrid } from "@paper-design/shaders-react"

/**
 * The dot field the onboarding flow uses wherever it needs a surface that
 * reads as somewhere rather than as nothing.
 *
 * Hex rather than the theme's CSS variables because the shader parses colours
 * into WebGL floats and cannot read `var()` — the defaults are `--muted` and
 * a step down from it, written out. A preview standing in for a merchant's
 * own screen passes their surface instead.
 */
const BACK = "#f7f7f7"
const FILL = "#dedede"

export function DotField({
  className,
  back = BACK,
  fill = FILL,
}: {
  className?: string
  /** Hex. */
  back?: string
  /** Hex. */
  fill?: string
}) {
  return (
    <DotGrid
      width="100%"
      height="100%"
      colorBack={back}
      colorFill={fill}
      colorStroke={back}
      size={1}
      gapX={32}
      gapY={32}
      strokeWidth={0}
      sizeRange={0}
      opacityRange={0}
      shape="circle"
      className={className}
    />
  )
}

/** Mixes `amount` (0–1) of `into` into `hex`. Both six-digit hex. */
export function mixHex(hex: string, into: string, amount: number): string {
  const channel = (source: string, offset: number) =>
    parseInt(source.slice(offset, offset + 2), 16)
  const a = hex.replace("#", "")
  const b = into.replace("#", "")
  if (a.length !== 6 || b.length !== 6) return hex
  return (
    "#" +
    [0, 2, 4]
      .map((offset) =>
        Math.round(
          channel(a, offset) +
            (channel(b, offset) - channel(a, offset)) * amount,
        )
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  )
}
