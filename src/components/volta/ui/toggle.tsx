"use client"

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Flavour and size swatches: a bordered block that fills with volt when chosen.
const toggleVariants = cva(
  "group/toggle volta-wide inline-flex items-center justify-center rounded-volta border-2 font-volta text-volta-micro transition-colors outline-none focus-visible:ring-2 focus-visible:ring-volta-volt focus-visible:ring-offset-2 focus-visible:ring-offset-volta-void disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default:
          "border-volta-line bg-transparent text-volta-chalk hover:border-volta-line-strong aria-pressed:border-volta-volt aria-pressed:bg-volta-volt aria-pressed:text-volta-void",
        // Out of stock reads as struck through rather than hidden.
        quiet:
          "border-transparent bg-transparent text-volta-ash hover:text-volta-chalk aria-pressed:text-volta-volt aria-pressed:underline aria-pressed:underline-offset-4",
      },
      size: {
        default: "h-11 min-w-11 px-3",
        sm: "h-9 min-w-9 px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
