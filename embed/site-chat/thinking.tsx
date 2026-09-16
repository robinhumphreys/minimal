import { LoaderCircleIcon } from "lucide-react"
import { cn } from "cn"

import type { ThinkingStyle } from "@/lib/config/schema"

/**
 * What working looks like, in the merchant's chosen style. Shared by the chat
 * window and the search panel so the agent waits the same way everywhere.
 */
export function Working({
  style,
  label,
  className,
}: {
  style: ThinkingStyle
  /** Shown by the `text` style, and read out by every style. */
  label: string
  className?: string
}) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("flex h-5 items-center gap-2", className)}
    >
      {style === "ring" ? (
        <LoaderCircleIcon className="size-4 animate-spin" />
      ) : style === "text" ? null : (
        <span className="flex items-center gap-1">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className="size-1.5 animate-bounce rounded-full bg-current/60"
              style={{ animationDelay: `${dot * 120}ms` }}
            />
          ))}
        </span>
      )}
      {style === "text" ? <span>{label}…</span> : null}
    </span>
  )
}
