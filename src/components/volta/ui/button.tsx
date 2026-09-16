import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Volta buttons are hard-edged blocks with wide uppercase labels. Nothing here
// reads a shadcn semantic token, so restyling Noord can never move these.
const buttonVariants = cva(
  "group/button volta-wide inline-flex shrink-0 items-center justify-center gap-2 rounded-volta border-2 font-volta text-volta-label whitespace-nowrap transition-colors duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-volta-volt focus-visible:ring-offset-2 focus-visible:ring-offset-volta-void disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // The brand's call to action. Volt is loud enough that there is only
        // ever one of these on screen.
        volt: "border-volta-volt bg-volta-volt text-volta-void hover:border-volta-volt-dim hover:bg-volta-volt-dim",
        solid:
          "border-volta-chalk bg-volta-chalk text-volta-void hover:border-volta-volt hover:bg-volta-volt",
        outline:
          "border-volta-line-strong bg-transparent text-volta-chalk hover:border-volta-volt hover:text-volta-volt",
        ghost:
          "border-transparent bg-transparent text-volta-chalk hover:bg-volta-steel",
        link: "border-transparent bg-transparent p-0 text-volta-volt underline underline-offset-4 hover:text-volta-volt-dim",
      },
      size: {
        sm: "h-9 px-4",
        default: "h-12 px-6",
        // Full-bleed call to action — the add-to-bag and checkout buttons.
        block: "h-14 w-full px-6 text-volta-label",
        icon: "size-10 border-0 px-0",
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
      // Base UI assumes a native <button> and warns when `render` supplies
      // anything else. Most of Volta's `render` uses are `next/link`, which is
      // an <a>; callers passing a real <button> can still say so explicitly.
      nativeButton={nativeButton ?? render === undefined}
      {...props}
    />
  )
}

export { Button, buttonVariants }
