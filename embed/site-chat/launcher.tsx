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

/** The floating button, in the merchant's accent. */
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

  return (
    <button
      type="button"
      data-slot="launcher"
      onClick={onClick}
      aria-expanded={open}
      aria-label={open ? "Close chat" : surface.label || "Open chat"}
      className={cn(
        "flex cursor-pointer items-center gap-2 bg-primary text-sm font-medium text-primary-foreground shadow-lg outline-none hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-100",
        surface.label
          ? "h-12 rounded-full px-5"
          : "size-14 justify-center rounded-full",
        className,
      )}
    >
      {open ? (
        <XIcon className="size-5" />
      ) : (
        <Icon
          className="size-6"
          weight={surface.iconStyle === "solid" ? "fill" : "regular"}
        />
      )}
      {surface.label ? <span>{surface.label}</span> : null}
    </button>
  )
}
