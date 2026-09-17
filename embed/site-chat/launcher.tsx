import * as React from "react"
import {
  ChatCircleIcon,
  QuestionIcon,
  SparkleIcon,
} from "@phosphor-icons/react/ssr"
import { XIcon } from "lucide-react"
import { cn } from "../cn"

import type { Surface } from "@/lib/config/schema"

/**
 * Phosphor rather than Lucide because it ships both weights of the same glyph,
 * which is what makes solid and outline a setting rather than two icon sets.
 */
const ICONS: Record<
  Surface["icon"],
  React.ComponentType<{ className?: string; weight?: "fill" | "regular" }>
> = {
  chat: ChatCircleIcon,
  sparkles: SparkleIcon,
  help: QuestionIcon,
}

/** Bare and labelled heights per size; the glyph scales with them. */
const SIZES: Record<
  Surface["size"],
  { bare: string; labelled: string; icon: string }
> = {
  sm: { bare: "ma:size-11", labelled: "ma:h-10 ma:px-4", icon: "ma:size-5" },
  md: { bare: "ma:size-14", labelled: "ma:h-12 ma:px-5", icon: "ma:size-6" },
  lg: { bare: "ma:size-16", labelled: "ma:h-14 ma:px-6", icon: "ma:size-7" },
}

/**
 * The floating button, in the merchant's accent.
 *
 * Shape is its own choice rather than following the window's roundness: a
 * launcher is a mark on the page, and a brand that boxes its buttons may
 * still want a round one, or the reverse.
 */
export function Launcher({
  surface,
  open,
  onClick,
  className,
}: {
  surface: Surface
  open: boolean
  onClick: () => void
  className?: string
}) {
  const Icon = ICONS[surface.icon]
  const size = SIZES[surface.size]
  // A pill is a labelled launcher by definition; it says "Chat" if the
  // merchant gave it nothing better.
  const label =
    surface.shape === "pill" ? surface.label || "Chat" : surface.label

  return (
    <button
      type="button"
      data-slot="launcher"
      onClick={onClick}
      aria-expanded={open}
      aria-label={open ? "Close chat" : label || "Open chat"}
      className={cn(
        "ma:flex ma:cursor-pointer ma:items-center ma:gap-2 ma:bg-primary ma:text-sm ma:font-medium ma:text-primary-foreground ma:shadow-lg ma:outline-none ma:hover:scale-105 ma:focus-visible:ring-3 ma:focus-visible:ring-ring/50 ma:focus-visible:ring-offset-2 ma:focus-visible:ring-offset-background ma:active:scale-100",
        surface.shape === "square"
          ? "ma:rounded-(--radius)"
          : "ma:rounded-full",
        label ? size.labelled : cn(size.bare, "ma:justify-center"),
        className,
      )}
    >
      {open ? (
        <XIcon className={size.icon} />
      ) : (
        <Icon
          className={size.icon}
          weight={surface.iconStyle === "solid" ? "fill" : "regular"}
        />
      )}
      {label ? <span>{label}</span> : null}
    </button>
  )
}
