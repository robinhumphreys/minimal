import { cn } from "@/lib/utils"
import { StarIcon } from "@phosphor-icons/react/ssr"

import { formatCount, formatRating } from "@/lib/volta/format"

const SIZE_CLASS = {
  sm: "size-3",
  default: "size-3.5",
  lg: "size-4",
} as const

/**
 * A five-star row.
 *
 * Fractions are drawn by clipping a filled row over an empty one rather than
 * by rounding to half stars — a 4.8 and a 4.6 should not look identical.
 */
export function Stars({
  rating,
  size = "default",
  surface = "dark",
  className,
}: {
  rating: number
  size?: keyof typeof SIZE_CLASS
  /** Which background the row sits on — the unfilled stars invert with it. */
  surface?: "dark" | "light"
  className?: string
}) {
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100))
  const icon = SIZE_CLASS[size]

  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      role="img"
      aria-label={`${formatRating(rating)} out of 5 stars`}
    >
      <span
        className={cn(
          "flex gap-px",
          surface === "light" ? "text-volta-mist" : "text-volta-line-strong",
        )}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} className={icon} weight="fill" />
        ))}
      </span>
      {/*
        The volt is invisible on white, so a light shelf gets the deep green.
      */}
      <span
        className={cn(
          "absolute inset-0 flex gap-px overflow-hidden",
          surface === "light" ? "text-volta-volt-deep" : "text-volta-volt",
        )}
        style={{ width: `${percent}%` }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} className={cn(icon, "shrink-0")} weight="fill" />
        ))}
      </span>
    </span>
  )
}

/** Stars plus the numbers, as it appears on tiles and above the PDP buy block. */
export function RatingRow({
  rating,
  reviewCount,
  size = "default",
  showValue = false,
  surface = "dark",
  className,
}: {
  rating?: number
  reviewCount?: number
  size?: keyof typeof SIZE_CLASS
  /** Print "4.8" next to the stars. Off on tiles, on where there is room. */
  showValue?: boolean
  surface?: "dark" | "light"
  className?: string
}) {
  // A star row with no count behind it is decoration, not evidence.
  if (rating === undefined || reviewCount === undefined) return null

  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      <Stars rating={rating} size={size} surface={surface} />
      {showValue && (
        <span
          className={cn(
            "text-volta-micro tabular-nums",
            surface === "light" ? "text-volta-void" : "text-volta-chalk",
          )}
        >
          {formatRating(rating)}
        </span>
      )}
      <span
        className={cn(
          "text-volta-micro tabular-nums",
          surface === "light" ? "text-volta-slate" : "text-volta-ash",
        )}
      >
        ({formatCount(reviewCount)})
      </span>
    </span>
  )
}
