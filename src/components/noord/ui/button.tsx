import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// Nothing here reads a shadcn semantic token, so restyling Volta can never
// move these.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-noord border font-noord text-noord-micro whitespace-nowrap uppercase transition-colors outline-none select-none focus-visible:ring-1 focus-visible:ring-noord-ink focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        solid:
          "border-noord-ink bg-noord-ink text-noord-paper hover:border-noord-ink-muted hover:bg-noord-ink-muted",
        outline:
          "border-noord-ink bg-transparent text-noord-ink hover:bg-noord-ink hover:text-noord-paper",
        quiet:
          "border-noord-line bg-noord-paper text-noord-ink hover:border-noord-ink",
        ghost:
          "border-transparent bg-transparent text-noord-ink hover:bg-noord-wash",
        link: "border-transparent bg-transparent p-0 text-noord-ink underline underline-offset-4 hover:text-noord-ink-muted",
      },
      size: {
        sm: "h-9 px-4",
        default: "h-12 px-6",
        block: "h-13 w-full px-6",
        icon: "size-10 px-0",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "default",
    },
  },
)

function Button({
  className,
  variant,
  size,
  render,
  nativeButton,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      render={render}
      // Base UI assumes a native <button> and warns otherwise. Most `render`
      // uses here are `next/link`; callers can still opt back in explicitly.
      nativeButton={nativeButton ?? render === undefined}
      {...props}
    />
  )
}

export { Button, buttonVariants }
