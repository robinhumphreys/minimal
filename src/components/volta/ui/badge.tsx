import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// Overlays on product imagery and rows of meta: "Best seller", "-30%", "New".
const badgeVariants = cva(
  "volta-wide inline-flex w-fit shrink-0 items-center gap-1 rounded-volta px-2 py-1 font-volta text-volta-micro",
  {
    variants: {
      variant: {
        volt: "bg-volta-volt text-volta-void",
        chalk: "bg-volta-chalk text-volta-void",
        sale: "bg-volta-heat text-volta-chalk",
        outline: "border border-volta-line-strong text-volta-chalk",
        dim: "bg-volta-steel text-volta-ash",
        quiet: "bg-transparent px-0 text-volta-ash",
      },
    },
    defaultVariants: {
      variant: "volt",
    },
  },
)

function Badge({
  className,
  variant = "volt",
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
