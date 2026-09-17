import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../cn"

const buttonVariants = cva(
  "ma:group/button ma:inline-flex ma:shrink-0 ma:items-center ma:justify-center ma:rounded-full ma:border ma:border-transparent ma:bg-clip-padding ma:text-sm ma:font-medium ma:whitespace-nowrap ma:transition-all ma:outline-none ma:select-none ma:focus-visible:border-ring ma:focus-visible:ring-3 ma:focus-visible:ring-ring/50 ma:active:not-aria-[haspopup]:translate-y-px ma:disabled:pointer-events-none ma:disabled:opacity-50 ma:aria-invalid:border-destructive ma:aria-invalid:ring-3 ma:aria-invalid:ring-destructive/20 ma:dark:aria-invalid:border-destructive/50 ma:dark:aria-invalid:ring-destructive/40 ma:[&_svg]:pointer-events-none ma:[&_svg]:shrink-0 ma:[&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "ma:bg-primary ma:text-primary-foreground ma:hover:bg-primary/80",
        outline:
          "ma:border-border ma:bg-background ma:hover:bg-muted ma:hover:text-foreground ma:aria-expanded:bg-muted ma:aria-expanded:text-foreground ma:dark:border-input ma:dark:bg-input/30 ma:dark:hover:bg-input/50",
        secondary:
          "ma:bg-secondary ma:text-secondary-foreground ma:hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] ma:aria-expanded:bg-secondary ma:aria-expanded:text-secondary-foreground",
        ghost:
          "ma:hover:bg-muted ma:hover:text-foreground ma:aria-expanded:bg-muted ma:aria-expanded:text-foreground ma:dark:hover:bg-muted/50",
        destructive:
          "ma:bg-destructive/10 ma:text-destructive ma:hover:bg-destructive/20 ma:focus-visible:border-destructive/40 ma:focus-visible:ring-destructive/20 ma:dark:bg-destructive/20 ma:dark:hover:bg-destructive/30 ma:dark:focus-visible:ring-destructive/40",
        link: "ma:text-primary ma:underline-offset-4 ma:hover:underline",
      },
      size: {
        default:
          "ma:h-8 ma:gap-1.5 ma:px-4 ma:has-data-[icon=inline-end]:pr-3 ma:has-data-[icon=inline-start]:pl-3",
        xs: "ma:h-6 ma:gap-1 ma:rounded-full ma:px-2 ma:text-xs ma:in-data-[slot=button-group]:rounded-lg ma:has-data-[icon=inline-end]:pr-1.5 ma:has-data-[icon=inline-start]:pl-1.5 ma:[&_svg:not([class*='size-'])]:size-3",
        sm: "ma:h-7 ma:gap-1 ma:rounded-full ma:px-2.5 ma:text-[0.8rem] ma:in-data-[slot=button-group]:rounded-lg ma:has-data-[icon=inline-end]:pr-1.5 ma:has-data-[icon=inline-start]:pl-1.5 ma:[&_svg:not([class*='size-'])]:size-3.5",
        lg: "ma:h-9 ma:gap-1.5 ma:px-6 ma:has-data-[icon=inline-end]:pr-5 ma:has-data-[icon=inline-start]:pl-5",
        icon: "ma:size-8",
        "icon-xs":
          "ma:size-6 ma:rounded-full ma:in-data-[slot=button-group]:rounded-lg ma:[&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "ma:size-7 ma:rounded-full ma:in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "ma:size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
