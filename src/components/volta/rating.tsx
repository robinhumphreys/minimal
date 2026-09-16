import { cn } from "cn"
import { StarIcon } from "lucide-react"

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
  className,
}: {
  rating: number
  size?: keyof typeof SIZE_CLASS
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
      <span className="flex gap-px text-volta-line-strong">
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} className={icon} fill="currentColor" />
        ))}
      </span>
      <span
        className="absolute inset-0 flex gap-px overflow-hidden text-volta-volt"
        style={{ width: `${percent}%` }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} className={cn(icon, "shrink-0")} fill="currentColor" />
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
  className,
}: {
  rating?: number
  reviewCount?: number
  size?: keyof typeof SIZE_CLASS
  /** Print "4.8" next to the stars. Off on tiles, on where there is room. */
  showValue?: boolean
  className?: string
}) {
  // A star row with no count behind it is decoration, not evidence.
  if (rating === undefined || reviewCount === undefined) return null

  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      <Stars rating={rating} size={size} />
      {showValue && (
        <span className="text-volta-micro text-volta-chalk tabular-nums">
          {formatRating(rating)}
        </span>
      )}
      <span className="text-volta-micro text-volta-ash tabular-nums">
        ({formatCount(reviewCount)})
      </span>
    </span>
  )
}
