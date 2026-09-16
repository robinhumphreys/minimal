"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { cn } from "cn"

import { Button } from "@/components/noord/ui/button"
import { XIcon } from "lucide-react"

/**
 * The one overlay primitive Noord uses: nav, search and bag are all this.
 *
 * On mobile it always covers the viewport — a storefront overlay that leaves a
 * sliver of the page behind it reads as a mistake on a phone. From `sm` up it
 * becomes a panel on the given `side`, or stays full-bleed for `side="full"`.
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
        "fixed inset-0 z-50 bg-noord-ink/20 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0",
        className,
      )}
      {...props}
    />
  )
}

const SIDE_CLASS = {
  full: "sm:inset-0 sm:w-full",
  right:
    "sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:w-[26rem] sm:border-l sm:border-noord-line sm:data-ending-style:translate-x-full sm:data-starting-style:translate-x-full",
  left: "sm:inset-y-0 sm:left-0 sm:right-auto sm:h-full sm:w-[22rem] sm:border-r sm:border-noord-line sm:data-ending-style:-translate-x-full sm:data-starting-style:-translate-x-full",
} as const

function SheetContent({
  className,
  children,
  side = "full",
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: keyof typeof SIDE_CLASS
  showCloseButton?: boolean
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "noord noord-sheet fixed inset-0 z-50 flex flex-col overflow-hidden bg-noord-paper text-noord-ink transition-all duration-300 ease-out outline-none data-ending-style:opacity-0 data-starting-style:opacity-0",
          SIDE_CLASS[side],
          className,
        )}
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
                // Sits on the header row, not at an arbitrary offset from the
                // popup: centred on the header's height, and pulled right by
                // the 0.75rem of padding around its glyph so the glyph — not
                // the hit area — lines up with the sheet gutter.
                className="absolute top-[calc((var(--spacing-noord-header)-2.5rem)/2)] right-[calc(var(--noord-sheet-gutter)-0.75rem)]"
              />
            }
          >
            <XIcon />
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
        "noord-sheet-gutter flex h-noord-header shrink-0 items-center border-b border-noord-line",
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
      className={cn("noord-sheet-gutter mt-auto shrink-0 py-4", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-noord text-noord-label uppercase", className)}
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
      className={cn("text-noord-body text-noord-ink-muted", className)}
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
