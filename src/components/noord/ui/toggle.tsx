"use client"

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center rounded-noord border font-noord text-noord-micro uppercase transition-colors outline-none focus-visible:ring-1 focus-visible:ring-noord-ink focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default:
          "border-noord-line bg-noord-paper text-noord-ink hover:border-noord-ink-faint aria-pressed:border-noord-ink aria-pressed:bg-noord-ink aria-pressed:text-noord-paper",
        // Out of stock reads as struck through rather than hidden.
        quiet:
          "border-transparent bg-transparent text-noord-ink-muted hover:text-noord-ink aria-pressed:text-noord-ink aria-pressed:underline aria-pressed:underline-offset-4",
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
