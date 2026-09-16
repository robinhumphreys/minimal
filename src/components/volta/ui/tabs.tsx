"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import { cn } from "@/lib/utils"

/**
 * Tabs.
 *
 * Volta's product detail sits in tabs rather than the accordion Noord uses, so
 * the two storefronts do not read as the same template in two palettes. It also
 * suits the content: specification, dosing and delivery are three answers to
 * three separate questions, not a list to work down, and tabs show that the
 * other two exist without making the shopper open them.
 *
 * The active tab is marked by a volt rule sitting on the list's hairline, the
 * same underline the desktop nav uses for the open category.
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
 * Scrolls sideways rather than wrapping: three labels do not fit a narrow
 * phone, and a tab row that reflows to two lines stops looking like a control.
 * `-mb-px` drops the list's own hairline onto the border below it so the active
 * rule and the divider are the same line.
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
