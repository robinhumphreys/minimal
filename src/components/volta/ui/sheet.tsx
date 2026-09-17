"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"
import { XIcon } from "@phosphor-icons/react/ssr"

import {
  useMediaQuery,
  useVisualViewport,
  visualViewportStyle,
} from "@/lib/visual-viewport"

import { Button } from "@/components/volta/ui/button"

/**
 * `.volta` is repeated on the popup because Base UI portals it to
 * `document.body`, outside the shell wrapper that sets the brand styles.
 */
function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-volta-void/70 backdrop-blur-sm transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0",
        className,
      )}
      {...props}
    />
  )
}

const SIDE_CLASS = {
  full: "sm:inset-0 sm:w-full",
  right:
    "sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:w-[28rem] sm:border-l sm:border-volta-line sm:data-ending-style:translate-x-full sm:data-starting-style:translate-x-full",
  left: "sm:inset-y-0 sm:left-0 sm:right-auto sm:h-full sm:w-[24rem] sm:border-r sm:border-volta-line sm:data-ending-style:-translate-x-full sm:data-starting-style:-translate-x-full",
} as const

function SheetContent({
  className,
  children,
  side = "full",
  showCloseButton = true,
  style,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: keyof typeof SIDE_CLASS
  showCloseButton?: boolean
}) {
  // On a phone the sheet is the screen, so it follows the visual viewport:
  // the keyboard shortens it instead of covering its foot, which is where
  // search keeps its composer.
  const phone = useMediaQuery("(width < 40rem)")
  const screen = useVisualViewport(phone)

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "volta fixed inset-0 z-50 flex flex-col overflow-hidden bg-volta-void text-volta-chalk transition-all duration-300 ease-out outline-none data-ending-style:opacity-0 data-starting-style:opacity-0",
          SIDE_CLASS[side],
          className,
        )}
        style={{ ...visualViewportStyle(screen), ...style }}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 sm:top-3 sm:right-3"
              />
            }
          >
            <XIcon className="size-5" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "volta-gutter flex h-volta-header shrink-0 items-center border-b border-volta-line",
        className,
      )}
      {...props}
    />
  )
}

function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-body"
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain",
        className,
      )}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "volta-gutter mt-auto shrink-0 border-t border-volta-line bg-volta-carbon py-4",
        className,
      )}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("volta-wide font-volta text-volta-label", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-volta-body text-volta-ash", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
