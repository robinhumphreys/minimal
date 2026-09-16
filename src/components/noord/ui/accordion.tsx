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
        "flex w-full flex-col border-t border-noord-line",
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
      className={cn("border-b border-noord-line", className)}
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
          "group/accordion-trigger flex flex-1 items-center justify-between gap-4 py-5 text-left font-noord text-noord-label text-noord-ink uppercase transition-colors outline-none hover:text-noord-ink-muted focus-visible:ring-1 focus-visible:ring-noord-ink focus-visible:ring-offset-2 aria-disabled:pointer-events-none aria-disabled:opacity-40",
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
      className="overflow-hidden text-noord-body text-noord-ink-muted"
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
