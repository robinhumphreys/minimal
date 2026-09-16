import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

// A rule under the text rather than a box around it.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-noord border-0 border-b border-noord-line bg-transparent px-0 py-2 font-noord text-noord-lead text-noord-ink transition-colors outline-none placeholder:text-noord-ink-faint focus-visible:border-noord-ink disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
