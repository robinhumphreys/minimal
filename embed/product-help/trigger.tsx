import { SparkleIcon } from "@phosphor-icons/react/ssr"
import { cn } from "cn"

import type { AgentConfig } from "@/lib/config/schema"

import { themeStyle } from "../theme"

/**
 * The button that opens the guide, drawn into wherever the merchant put a
 * `minimal-agent-guide`. In the merchant's accent and corners, so it reads
 * as one of the page's own buttons rather than a badge on it.
 */
export function GuideTrigger({
  config,
  label,
  onOpen,
  className,
}: {
  config: AgentConfig
  /** Text the merchant wrote inside the mount, if any. */
  label?: string
  onOpen: () => void
  className?: string
}) {
  return (
    <span
      className="minimal-agent-root inline-block font-sans"
      style={themeStyle(config.theme)}
    >
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "inline-flex h-10 cursor-pointer items-center gap-2 rounded-(--radius) bg-primary px-4 text-sm font-medium text-primary-foreground outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50",
          className,
        )}
      >
        <SparkleIcon className="size-4" weight="fill" />
        {label?.trim() || config.surface.productHelp.label}
      </button>
    </span>
  )
}
