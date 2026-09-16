"use client"

import * as React from "react"
import {
  MessageScroller as MessageScrollerPrimitive,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@shadcn/react/message-scroller"
import { cn } from "../cn"

import { Button } from "./button"
import { ArrowDownIcon } from "lucide-react"

function MessageScrollerProvider(
  props: React.ComponentProps<typeof MessageScrollerPrimitive.Provider>,
) {
  return <MessageScrollerPrimitive.Provider {...props} />
}

function MessageScroller({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Root>) {
  return (
    <MessageScrollerPrimitive.Root
      data-slot="message-scroller"
      className={cn(
        "ma:group/message-scroller ma:relative ma:flex ma:size-full ma:min-h-0 ma:flex-col ma:overflow-hidden",
        className,
      )}
      {...props}
    />
  )
}

function MessageScrollerViewport({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Viewport>) {
  return (
    <MessageScrollerPrimitive.Viewport
      data-slot="message-scroller-viewport"
      className={cn(
        "ma:size-full ma:min-h-0 ma:min-w-0 ma:scroll-fade-b ma:scrollbar-thin ma:scrollbar-gutter-stable ma:overflow-y-auto ma:overscroll-contain ma:contain-content ma:data-autoscrolling:scrollbar-thumb-transparent ma:data-autoscrolling:scrollbar-track-transparent ma:data-pending-scroll:invisible",
        className,
      )}
      {...props}
    />
  )
}

function MessageScrollerContent({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Content>) {
  return (
    <MessageScrollerPrimitive.Content
      data-slot="message-scroller-content"
      className={cn("ma:flex ma:h-max ma:min-h-full ma:flex-col ma:gap-6", className)}
      {...props}
    />
  )
}

function MessageScrollerItem({
  className,
  scrollAnchor = false,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Item>) {
  return (
    <MessageScrollerPrimitive.Item
      data-slot="message-scroller-item"
      scrollAnchor={scrollAnchor}
      className={cn(
        "ma:min-w-0 ma:shrink-0 ma:[contain-intrinsic-size:auto_10rem] ma:[content-visibility:auto]",
        className,
      )}
      {...props}
    />
  )
}

function MessageScrollerButton({
  direction = "end",
  className,
  children,
  render,
  variant = "secondary",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Button> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <MessageScrollerPrimitive.Button
      data-slot="message-scroller-button"
      data-direction={direction}
      data-variant={variant}
      data-size={size}
      direction={direction}
      className={cn(
        "ma:absolute ma:inset-s-1/2 ma:-translate-x-1/2 ma:border-border ma:bg-background ma:text-foreground ma:transition-[translate,scale,opacity] ma:duration-200 ma:hover:bg-muted ma:hover:text-foreground ma:data-[active=false]:pointer-events-none ma:data-[active=false]:scale-95 ma:data-[active=false]:opacity-0 ma:data-[active=false]:duration-400 ma:data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] ma:data-[active=true]:translate-y-0 ma:data-[active=true]:scale-100 ma:data-[active=true]:opacity-100 ma:data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)] ma:data-[direction=end]:bottom-4 ma:data-[direction=end]:data-[active=false]:translate-y-full ma:data-[direction=start]:top-4 ma:data-[direction=start]:data-[active=false]:-translate-y-full ma:rtl:translate-x-1/2 ma:data-[direction=start]:[&_svg]:rotate-180",
        className,
      )}
      render={render ?? <Button variant={variant} size={size} />}
      {...props}
    >
      {children ?? (
        <>
          <ArrowDownIcon />
          <span className="ma:sr-only">
            {direction === "end" ? "Scroll to end" : "Scroll to start"}
          </span>
        </>
      )}
    </MessageScrollerPrimitive.Button>
  )
}

export {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
}
