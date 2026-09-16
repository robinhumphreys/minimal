import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// Overlays on product imagery: "New", "Sale", "Final pieces".
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 rounded-noord px-2 py-1 font-noord text-noord-micro uppercase",
  {
    variants: {
      variant: {
        default: "bg-noord-ink text-noord-paper",
        paper: "bg-noord-paper text-noord-ink",
        outline: "border border-noord-line-strong text-noord-ink",
        sale: "bg-noord-sale text-noord-paper",
        quiet: "bg-transparent px-0 text-noord-ink-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      { className: cn(badgeVariants({ variant }), className) },
      props,
    ),
    render,
    state: { slot: "badge", variant },
  })
}

export { Badge, badgeVariants }
