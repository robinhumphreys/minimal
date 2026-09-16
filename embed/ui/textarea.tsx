import * as React from "react"
import { cn } from "../cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "ma:flex ma:field-sizing-content ma:min-h-16 ma:w-full ma:rounded-lg ma:border ma:border-input ma:bg-transparent ma:px-2.5 ma:py-2 ma:text-base ma:transition-colors ma:outline-none ma:placeholder:text-muted-foreground ma:focus-visible:border-ring ma:focus-visible:ring-3 ma:focus-visible:ring-ring/50 ma:disabled:cursor-not-allowed ma:disabled:bg-input/50 ma:disabled:opacity-50 ma:aria-invalid:border-destructive ma:aria-invalid:ring-3 ma:aria-invalid:ring-destructive/20 ma:md:text-sm ma:dark:bg-input/30 ma:dark:disabled:bg-input/80 ma:dark:aria-invalid:border-destructive/50 ma:dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
