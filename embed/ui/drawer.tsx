"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { cn } from "../cn"

type DrawerContextProps = {
  hasSnapPoints: boolean
  modal: DrawerPrimitive.Root.Props["modal"]
  showSwipeHandle: boolean
  swipeDirection: NonNullable<DrawerPrimitive.Root.Props["swipeDirection"]>
}

const DrawerContext = React.createContext<DrawerContextProps | null>(null)

function useDrawer() {
  const context = React.useContext(DrawerContext)

  if (!context) {
    throw new Error("useDrawer must be used within a Drawer.")
  }

  return context
}

function Drawer({
  modal = true,
  showSwipeHandle = false,
  snapPoints,
  swipeDirection = "down",
  ...props
}: DrawerPrimitive.Root.Props & {
  showSwipeHandle?: boolean
}) {
  const hasSnapPoints = snapPoints != null && snapPoints.length > 0
  const contextValue = React.useMemo(
    () => ({ hasSnapPoints, modal, showSwipeHandle, swipeDirection }),
    [hasSnapPoints, modal, showSwipeHandle, swipeDirection],
  )

  return (
    <DrawerContext.Provider value={contextValue}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        modal={modal}
        snapPoints={snapPoints}
        swipeDirection={swipeDirection}
        {...props}
      />
    </DrawerContext.Provider>
  )
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
  className,
  ...props
}: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        "ma:fixed ma:inset-0 ma:z-50 ma:min-h-dvh ma:bg-black/10 ma:opacity-[max(var(--drawer-overlay-min-opacity,0),calc(1-var(--drawer-swipe-progress)))] ma:transition-opacity ma:duration-450 ma:ease-[cubic-bezier(0.32,0.72,0,1)] ma:select-none ma:data-ending-style:pointer-events-none ma:data-ending-style:opacity-0 ma:data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] ma:data-snap-points:[--drawer-overlay-min-opacity:0.5] ma:data-starting-style:opacity-0 ma:data-swiping:duration-0 ma:supports-backdrop-filter:backdrop-blur-xs ma:supports-[-webkit-touch-callout:none]:absolute",
        className,
      )}
      {...props}
    />
  )
}

function DrawerSwipeHandle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-swipe-handle"
      aria-hidden="true"
      className={cn(
        "ma:relative ma:z-10 ma:flex ma:shrink-0 ma:cursor-grab ma:transition-opacity ma:duration-200 ma:group-data-nested-drawer-open/drawer-popup:opacity-0 ma:group-data-nested-drawer-swiping/drawer-popup:opacity-100 ma:group-data-[swipe-axis=x]/drawer-popup:h-full ma:group-data-[swipe-axis=x]/drawer-popup:w-3 ma:group-data-[swipe-axis=x]/drawer-popup:items-center ma:group-data-[swipe-axis=y]/drawer-popup:h-3 ma:group-data-[swipe-axis=y]/drawer-popup:w-full ma:group-data-[swipe-axis=y]/drawer-popup:justify-center ma:group-data-[swipe-direction=down]/drawer-popup:items-end ma:group-data-[swipe-direction=left]/drawer-popup:order-last ma:group-data-[swipe-direction=left]/drawer-popup:justify-start ma:group-data-[swipe-direction=right]/drawer-popup:justify-end ma:group-data-[swipe-direction=up]/drawer-popup:order-last ma:group-data-[swipe-direction=up]/drawer-popup:items-start ma:after:block ma:after:shrink-0 ma:after:rounded-full ma:after:bg-muted ma:group-data-[swipe-axis=x]/drawer-popup:after:h-24 ma:group-data-[swipe-axis=x]/drawer-popup:after:w-1 ma:group-data-[swipe-axis=y]/drawer-popup:after:h-1 ma:group-data-[swipe-axis=y]/drawer-popup:after:w-24 ma:active:cursor-grabbing",
        className,
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  container,
  ...props
}: DrawerPrimitive.Popup.Props & {
  /** Where the drawer mounts; the document by default. */
  container?: DrawerPrimitive.Portal.Props["container"]
}) {
  const { hasSnapPoints, modal, showSwipeHandle, swipeDirection } = useDrawer()
  const swipeAxis =
    swipeDirection === "down" || swipeDirection === "up" ? "y" : "x"

  return (
    <DrawerPortal data-slot="drawer-portal" container={container}>
      {modal === true && (
        <DrawerOverlay data-snap-points={hasSnapPoints ? "" : undefined} />
      )}
      <DrawerPrimitive.Viewport
        data-slot="drawer-viewport"
        data-modal={modal}
        className="ma:pointer-events-none ma:fixed ma:inset-0 ma:z-50 ma:select-none ma:data-[modal=true]:pointer-events-auto"
      >
        <DrawerPrimitive.Popup
          data-slot="drawer-popup"
          data-swipe-axis={swipeAxis}
          data-snap-points={hasSnapPoints ? "" : undefined}
          className={cn(
            // Base.
            "ma:group/drawer-popup ma:pointer-events-auto ma:fixed ma:z-50 ma:m-(--drawer-inset,0px) ma:flex ma:h-(--drawer-content-height) ma:max-h-(--drawer-content-max-height,none) ma:min-h-0 ma:w-(--drawer-content-width,auto) ma:transform-[translate3d(var(--translate-x,0px),var(--translate-y,0px),0)_scale(var(--stack-scale))] ma:flex-col ma:bg-popover ma:text-sm ma:text-popover-foreground ma:transition-[transform,height,opacity,filter] ma:duration-450 ma:ease-[cubic-bezier(0.22,1,0.36,1)] ma:will-change-transform ma:outline-none ma:select-none ma:[interpolate-size:allow-keywords] ma:data-[swipe-direction=down]:rounded-t-xl ma:data-[swipe-direction=down]:border-t ma:data-[swipe-direction=left]:rounded-r-xl ma:data-[swipe-direction=left]:border-r ma:data-[swipe-direction=right]:rounded-l-xl ma:data-[swipe-direction=right]:border-l ma:data-[swipe-direction=up]:rounded-b-xl ma:data-[swipe-direction=up]:border-b",
            // Nested.
            "ma:data-nested-drawer-open:overflow-hidden ma:data-nested-drawer-open:brightness-95",
            // Bleed.
            "ma:after:pointer-events-none ma:after:absolute ma:after:bg-(--drawer-bleed-background,var(--color-popover)) ma:data-[swipe-axis=x]:after:inset-y-0 ma:data-[swipe-axis=x]:after:w-(--bleed) ma:data-[swipe-axis=y]:after:inset-x-0 ma:data-[swipe-axis=y]:after:h-(--bleed) ma:data-[swipe-direction=down]:after:top-full ma:data-[swipe-direction=left]:after:right-full ma:data-[swipe-direction=right]:after:left-full ma:data-[swipe-direction=up]:after:bottom-full",
            // Sizing.
            "ma:[--drawer-content-height:var(--drawer-height,auto)] ma:data-[swipe-axis=x]:[--drawer-content-width:75%] ma:data-[swipe-axis=y]:[--drawer-content-max-height:calc(100dvh-6rem)] ma:data-[swipe-axis=y]:data-snap-points:[--drawer-content-height:100dvh] ma:data-[swipe-axis=x]:sm:[--drawer-content-width:24rem]",
            // Stack.
            "ma:[--bleed:3rem] ma:[--peek:1rem] ma:[--stack-height:var(--drawer-frontmost-height,var(--drawer-height,0px))] ma:[--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))] ma:[--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] ma:[--stack-scale-base:max(0,calc(1-(var(--nested-drawers)*var(--stack-step))))] ma:[--stack-scale:clamp(0,calc(var(--stack-scale-base)+(var(--stack-step)*var(--stack-progress))),1)] ma:[--stack-shrink:calc(1-var(--stack-scale))] ma:[--stack-step:0.05]",
            // Transitions.
            "ma:data-ending-style:transform-(--closed-transform) ma:data-ending-style:opacity-[0.9999] ma:data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] ma:data-nested-drawer-swiping:duration-0 ma:data-ending-style:data-nested-drawer-swiping:duration-[calc(var(--drawer-swipe-strength)*400ms)] ma:data-starting-style:transform-(--closed-transform) ma:data-swiping:duration-0 ma:data-ending-style:data-swiping:duration-[calc(var(--drawer-swipe-strength)*400ms)]",
            // Axis: y.
            "ma:data-[swipe-axis=y]:inset-x-0 ma:data-[swipe-axis=y]:data-nested-drawer-open:h-(--stack-height)",
            // Axis: x.
            "ma:data-[swipe-axis=x]:inset-y-0 ma:data-[swipe-axis=x]:flex-row",
            // Direction: down.
            "ma:data-[swipe-direction=down]:bottom-0 ma:data-[swipe-direction=down]:origin-bottom ma:data-[swipe-direction=down]:[--closed-transform:translate3d(0,calc(100%+var(--drawer-inset,0px)+2px),0)] ma:data-[swipe-direction=down]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--stack-shrink)*var(--stack-height)))]",
            // Direction: up.
            "ma:data-[swipe-direction=up]:top-0 ma:data-[swipe-direction=up]:origin-top ma:data-[swipe-direction=up]:[--closed-transform:translate3d(0,calc(-100%-var(--drawer-inset,0px)-2px),0)] ma:data-[swipe-direction=up]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)+var(--stack-peek-offset)+(var(--stack-shrink)*var(--stack-height)))]",
            // Direction: left.
            "ma:data-[swipe-direction=left]:left-0 ma:data-[swipe-direction=left]:origin-left ma:data-[swipe-direction=left]:[--closed-transform:translate3d(calc(-100%-var(--drawer-inset,0px)-2px),0,0)] ma:data-[swipe-direction=left]:[--translate-x:calc(var(--drawer-swipe-movement-x)+var(--stack-peek-offset)+(var(--stack-shrink)*100%))]",
            // Direction: right.
            "ma:data-[swipe-direction=right]:right-0 ma:data-[swipe-direction=right]:origin-right ma:data-[swipe-direction=right]:[--closed-transform:translate3d(calc(100%+var(--drawer-inset,0px)+2px),0,0)] ma:data-[swipe-direction=right]:[--translate-x:calc(var(--drawer-swipe-movement-x)-var(--stack-peek-offset)-(var(--stack-shrink)*100%))]",
            className,
          )}
          {...props}
        >
          {showSwipeHandle && <DrawerSwipeHandle />}
          <DrawerPrimitive.Content
            data-slot="drawer-content"
            className={cn(
              "ma:flex ma:min-h-0 ma:flex-1 ma:flex-col ma:overflow-hidden ma:overscroll-contain ma:rounded-[inherit] ma:transition-opacity ma:duration-300 ma:ease-[cubic-bezier(0.45,1.005,0,1.005)] ma:select-text ma:group-data-nested-drawer-open/drawer-popup:opacity-0 ma:group-data-nested-drawer-swiping/drawer-popup:opacity-100 ma:group-data-swiping/drawer-popup:select-none",
            )}
          >
            {children}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "ma:flex ma:shrink-0 ma:flex-col ma:gap-0.5 ma:p-4 ma:pb-0 ma:group-data-[swipe-axis=y]/drawer-popup:text-center ma:md:gap-0.5 ma:md:text-left",
        className,
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "ma:mt-auto ma:flex ma:shrink-0 ma:flex-col ma:gap-2 ma:p-4 ma:pt-0",
        className,
      )}
      {...props}
    />
  )
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        "ma:font-heading ma:text-base ma:font-medium ma:text-foreground",
        className,
      )}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn(
        "ma:text-sm ma:text-balance ma:text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerSwipeHandle,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
