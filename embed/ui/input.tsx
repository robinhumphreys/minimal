import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "../cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "ma:h-8 ma:w-full ma:min-w-0 ma:rounded-lg ma:border ma:border-input ma:bg-transparent ma:px-2.5 ma:py-1 ma:text-base ma:transition-colors ma:outline-none ma:file:inline-flex ma:file:h-6 ma:file:border-0 ma:file:bg-transparent ma:file:text-sm ma:file:font-medium ma:file:text-foreground ma:placeholder:text-muted-foreground ma:focus-visible:border-ring ma:focus-visible:ring-3 ma:focus-visible:ring-ring/50 ma:disabled:pointer-events-none ma:disabled:cursor-not-allowed ma:disabled:bg-input/50 ma:disabled:opacity-50 ma:aria-invalid:border-destructive ma:aria-invalid:ring-3 ma:aria-invalid:ring-destructive/20 ma:md:text-sm ma:dark:bg-input/30 ma:dark:disabled:bg-input/80 ma:dark:aria-invalid:border-destructive/50 ma:dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
