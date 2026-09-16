import { cn } from "@/lib/utils"

/**
 * A white full-bleed band holding one or more product rails or a product grid.
 *
 * Product always sits on white at Volta. The packshots are cut out on white
 * already, so a dark plate leaves a pale rectangle floating inside each tile;
 * putting the whole shelf on white makes the packshot's own background
 * disappear and turns the run of product into a lit slab cut out of the black
 * page. It is also the only light surface in the brand, which is what makes
 * "here is the product" legible without a label saying so.
 *
 * Adjacent rails share one shelf rather than getting one each — two white
 * bands separated by a thin dark gap reads as a mistake.
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
