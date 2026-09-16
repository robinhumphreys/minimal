import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { cn } from "cn"
import { MinusIcon, PlusIcon } from "lucide-react"

// Hairline-separated rows with a +/- affordance. Used for product details on
// the PDP and for the category groups in the nav overlay.
function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn(
        "flex w-full flex-col border-t border-volta-line",
        className,
      )}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-volta-line", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger volta-wide flex flex-1 items-center justify-between gap-4 py-5 text-left font-volta text-volta-label text-volta-chalk transition-colors outline-none hover:text-volta-volt focus-visible:ring-2 focus-visible:ring-volta-volt focus-visible:ring-offset-2 focus-visible:ring-offset-volta-void aria-disabled:pointer-events-none aria-disabled:opacity-40",
          className,
        )}
        {...props}
      >
        {children}
        <PlusIcon className="size-4 shrink-0 group-aria-expanded/accordion-trigger:hidden" />
        <MinusIcon className="hidden size-4 shrink-0 group-aria-expanded/accordion-trigger:block" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-volta-body text-volta-ash"
      {...props}
    >
      <div
        className={cn(
          "h-(--accordion-panel-height) pb-6 data-ending-style:h-0 data-starting-style:h-0",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
