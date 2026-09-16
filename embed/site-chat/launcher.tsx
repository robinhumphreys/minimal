import * as React from "react"
import {
  ChatCircleIcon,
  QuestionIcon,
  SparkleIcon,
} from "@phosphor-icons/react/ssr"
import { XIcon } from "lucide-react"
import { cn } from "cn"

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
  sm: { bare: "size-11", labelled: "h-10 px-4", icon: "size-5" },
  md: { bare: "size-14", labelled: "h-12 px-5", icon: "size-6" },
  lg: { bare: "size-16", labelled: "h-14 px-6", icon: "size-7" },
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
        "flex cursor-pointer items-center gap-2 bg-primary text-sm font-medium text-primary-foreground shadow-lg outline-none hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-100",
        surface.shape === "square" ? "rounded-(--radius)" : "rounded-full",
        label ? size.labelled : cn(size.bare, "justify-center"),
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
