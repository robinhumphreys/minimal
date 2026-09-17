import { cn } from "@/lib/utils"

/**
 * Packshots are cut out on white already, so a dark plate would leave a pale
 * rectangle around each tile. Adjacent rails share one shelf, not one each.
 */
export function Shelf({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "flex flex-col gap-12 bg-volta-chalk py-12 md:gap-14 md:py-16",
        className,
      )}
    >
      {children}
    </section>
  )
}
