import { cn } from "@/lib/utils"

import { formatPrice } from "@/lib/volta/format"

/**
 * A price.
 *
 * `surface` is which background it sits on, not a colour: the same price is
 * chalk on the dark product page and near-black on a white shelf.
 */
export function Price({
  price,
  size = "default",
  surface = "dark",
  className,
}: {
  price: number
  size?: "default" | "lg"
  surface?: "dark" | "light"
  className?: string
}) {
  return (
    <span
      className={cn(
        "volta-title tabular-nums",
        surface === "light" ? "text-volta-void" : "text-volta-chalk",
        size === "lg" ? "text-2xl" : "text-volta-title",
        className,
      )}
    >
      {formatPrice(price)}
    </span>
  )
}
