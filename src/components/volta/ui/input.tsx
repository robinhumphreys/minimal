import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

// A rule under the text rather than a box around it, so the search field reads
// as part of the page instead of a widget dropped onto it.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-volta border-0 border-b-2 border-volta-line bg-transparent px-0 py-2 font-volta text-volta-lead text-volta-chalk transition-colors outline-none placeholder:text-volta-smoke focus-visible:border-volta-volt disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
