import { cn } from "cn"

import { discountPercent, formatPrice } from "@/lib/volta/format"

/**
 * Price, was-price and saving, as one unit.
 *
 * Volta always shows the discount as a percentage rather than an amount: at
 * these price points "-30%" lands harder than "save €6".
 */
export function Price({
  price,
  compareAt,
  size = "default",
  className,
}: {
  price: number
  compareAt?: number
  size?: "default" | "lg"
  className?: string
}) {
  const saving = discountPercent(price, compareAt)

  return (
    <span className={cn("flex flex-wrap items-baseline gap-x-2", className)}>
      <span
        className={cn(
          "volta-wide font-volta tabular-nums",
          saving > 0 ? "text-volta-volt" : "text-volta-chalk",
          size === "lg" ? "text-2xl" : "text-volta-title",
        )}
      >
        {formatPrice(price)}
      </span>
      {compareAt && (
        <s className="text-volta-micro text-volta-smoke tabular-nums">
          {formatPrice(compareAt)}
        </s>
      )}
      {saving > 0 && (
        <span className="volta-wide text-volta-micro text-volta-heat">
          −{saving}%
        </span>
      )}
    </span>
  )
}
