"use client"

import { DotGrid } from "@paper-design/shaders-react"

/**
 * The dot field the onboarding flow uses wherever it needs a surface that
 * reads as somewhere rather than as nothing.
 *
 * Hex rather than the theme's CSS variables because the shader parses colours
 * into WebGL floats and cannot read `var()` — these are `--muted` and a step
 * down from it, written out.
 */
const BACK = "#f7f7f7"
const FILL = "#dedede"

export function DotField({ className }: { className?: string }) {
  return (
    <DotGrid
      width="100%"
      height="100%"
      colorBack={BACK}
      colorFill={FILL}
      colorStroke={BACK}
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
