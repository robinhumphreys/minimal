import { cn } from "cn"

/** The white card every admin screen sits in, scrolling inside itself. */
export function Pane({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-hidden rounded-xl border bg-card shadow-xs",
        className,
      )}
      {...props}
    />
  )
}
