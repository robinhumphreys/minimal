import { LoaderCircleIcon } from "lucide-react"
import { cn } from "../cn"

import type { ThinkingStyle } from "@/lib/config/schema"

/** Shared by the chat window and the search panel so the agent waits the same way everywhere. */
export function Working({
  style,
  label,
  className,
}: {
  style: ThinkingStyle
  /** Shown by the `text` style; read out (aria-label) by every style. */
  label: string
  className?: string
}) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("ma:flex ma:h-5 ma:items-center ma:gap-2", className)}
    >
      {style === "ring" ? (
        <LoaderCircleIcon className="ma:size-4 ma:animate-spin" />
      ) : style === "text" ? null : (
        <span className="ma:flex ma:items-center ma:gap-1">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className="ma:size-1.5 ma:animate-bounce ma:rounded-full ma:bg-current/60"
              style={{ animationDelay: `${dot * 120}ms` }}
            />
          ))}
        </span>
      )}
      {style === "text" ? <span>{label}…</span> : null}
    </span>
  )
}
