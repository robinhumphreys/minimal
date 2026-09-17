"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import { cn } from "@/lib/utils"

/**
 * Specification, dosing and delivery are three separate answers, not a list
 * to work down, so tabs show they exist without making the shopper open them.
 */
function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

/**
 * Scrolls sideways rather than wrapping to two lines. `-mb-px` drops the
 * list's hairline onto the border below so the active rule and divider align.
 */
function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "-mb-px flex overflow-x-auto border-b border-volta-line",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      {...props}
    />
  )
}

function TabsTab({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-tab"
      className={cn(
        "volta-tab volta-wide shrink-0 px-4 py-3.5 first:pl-0",
        "text-volta-label whitespace-nowrap text-volta-ash",
        "transition-colors outline-none hover:text-volta-chalk",
        "data-[active]:text-volta-chalk",
        "focus-visible:ring-2 focus-visible:ring-volta-volt focus-visible:ring-offset-2 focus-visible:ring-offset-volta-void",
        className,
      )}
      {...props}
    />
  )
}

function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-panel"
      className={cn(
        "pt-5 text-volta-body text-volta-ash outline-none",
        className,
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTab, TabsPanel }
