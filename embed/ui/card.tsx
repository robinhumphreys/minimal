import * as React from "react"
import { cn } from "../cn"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "ma:group/card ma:flex ma:flex-col ma:gap-(--card-spacing) ma:overflow-hidden ma:rounded-xl ma:bg-card ma:py-(--card-spacing) ma:text-sm ma:text-card-foreground ma:ring-1 ma:ring-foreground/10 ma:[--card-spacing:--spacing(4)] ma:has-data-[slot=card-footer]:pb-0 ma:has-[>img:first-child]:pt-0 ma:data-[size=sm]:[--card-spacing:--spacing(3)] ma:data-[size=sm]:has-data-[slot=card-footer]:pb-0 ma:*:[img:first-child]:rounded-t-xl ma:*:[img:last-child]:rounded-b-xl",
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "ma:group/card-header ma:@container/card-header ma:grid ma:auto-rows-min ma:items-start ma:gap-1 ma:rounded-t-xl ma:px-(--card-spacing) ma:has-data-[slot=card-action]:grid-cols-[1fr_auto] ma:has-data-[slot=card-description]:grid-rows-[auto_auto] ma:[.border-b]:pb-(--card-spacing)",
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "ma:font-heading ma:text-base ma:leading-snug ma:font-medium ma:group-data-[size=sm]/card:text-sm",
        className,
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("ma:text-sm ma:text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "ma:col-start-2 ma:row-span-2 ma:row-start-1 ma:self-start ma:justify-self-end",
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("ma:px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "ma:flex ma:items-center ma:rounded-b-xl ma:border-t ma:bg-muted/50 ma:p-(--card-spacing)",
        className,
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
