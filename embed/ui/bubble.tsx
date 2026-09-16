import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../cn"

function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("ma:flex ma:min-w-0 ma:flex-col ma:gap-2", className)}
      {...props}
    />
  )
}

const bubbleVariants = cva(
  "ma:group/bubble ma:relative ma:flex ma:w-fit ma:max-w-[80%] ma:min-w-0 ma:flex-col ma:gap-1 ma:group-data-[align=end]/message:self-end ma:data-[align=end]:self-end ma:data-[variant=ghost]:max-w-full",
  {
    variants: {
      variant: {
        default:
          "ma:*:data-[slot=bubble-content]:bg-primary ma:*:data-[slot=bubble-content]:text-primary-foreground ma:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/80",
        secondary:
          "ma:*:data-[slot=bubble-content]:bg-secondary ma:*:data-[slot=bubble-content]:text-secondary-foreground ma:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
        muted:
          "ma:*:data-[slot=bubble-content]:bg-muted ma:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)]",
        tinted:
          "ma:*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)] ma:*:data-[slot=bubble-content]:text-foreground ma:dark:*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.3_calc(c*0.4)_h)] ma:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.88_calc(c*0.5)_h)] ma:dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.35_calc(c*0.5)_h)]",
        outline:
          "ma:*:data-[slot=bubble-content]:border-border ma:*:data-[slot=bubble-content]:bg-background ma:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted ma:[&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground ma:dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-input/30",
        ghost:
          "ma:border-none ma:*:data-[slot=bubble-content]:rounded-none ma:*:data-[slot=bubble-content]:bg-transparent ma:*:data-[slot=bubble-content]:p-0 ma:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted ma:[&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground ma:dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted/50",
        destructive:
          "ma:*:data-[slot=bubble-content]:bg-destructive/10 ma:*:data-[slot=bubble-content]:text-destructive ma:dark:*:data-[slot=bubble-content]:bg-destructive/20 ma:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/20 ma:dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end"
  }) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(bubbleVariants({ variant }), className)}
      {...props}
    />
  )
}

function BubbleContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "ma:w-fit ma:max-w-full ma:min-w-0 ma:overflow-hidden ma:rounded-xl ma:border ma:border-transparent ma:px-3 ma:py-2 ma:text-sm ma:leading-relaxed ma:wrap-break-word ma:group-data-[align=end]/bubble:self-end ma:[button]:text-left ma:[button,a]:transition-colors ma:[button,a]:outline-none ma:[button,a]:focus-visible:border-ring ma:[button,a]:focus-visible:ring-3 ma:[button,a]:focus-visible:ring-ring/50",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "bubble-content",
    },
  })
}

const bubbleReactionsVariants = cva(
  "ma:absolute ma:z-10 ma:flex ma:w-fit ma:shrink-0 ma:items-center ma:justify-center ma:gap-1 ma:rounded-full ma:bg-muted ma:px-1.5 ma:py-0.5 ma:text-sm ma:ring-3 ma:ring-card ma:has-[button]:p-0",
  {
    variants: {
      side: {
        top: "ma:top-0 ma:-translate-y-3/4",
        bottom: "ma:bottom-0 ma:translate-y-3/4",
      },
      align: {
        start: "ma:left-3",
        end: "ma:right-3",
      },
    },
    defaultVariants: {
      side: "bottom",
      align: "end",
    },
  },
)

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end"
  side?: "top" | "bottom"
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(bubbleReactionsVariants({ side, align }), className)}
      {...props}
    />
  )
}

export { BubbleGroup, Bubble, BubbleContent, BubbleReactions }
