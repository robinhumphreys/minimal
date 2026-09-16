import { SparkleIcon } from "@phosphor-icons/react/ssr"
import { cn } from "../cn"

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
      className="minimal-agent-root ma:inline-block ma:font-sans"
      style={themeStyle(config.theme)}
    >
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "ma:inline-flex ma:h-10 ma:cursor-pointer ma:items-center ma:gap-2 ma:rounded-(--radius) ma:bg-primary ma:px-4 ma:text-sm ma:font-medium ma:text-primary-foreground ma:outline-none ma:hover:opacity-90 ma:focus-visible:ring-3 ma:focus-visible:ring-ring/50",
          className,
        )}
      >
        <SparkleIcon className="ma:size-4" weight="fill" />
        {label?.trim() || config.surface.productHelp.label}
      </button>
    </span>
  )
}
