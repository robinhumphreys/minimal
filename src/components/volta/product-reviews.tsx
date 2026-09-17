import { formatCount, formatRating, formatReviewDate } from "@/lib/volta/format"
import type { RatingBreakdown, ReviewModel } from "@/lib/volta/types"

import { Badge } from "@/components/volta/ui/badge"
import { Button } from "@/components/volta/ui/button"
import { Stars } from "./rating"

/** `id="reviews"` is the anchor the star row above the buy block links to. */
export function ProductReviews({
  rating,
  reviewCount,
  breakdown,
  reviews,
}: {
  rating?: number
  reviewCount?: number
  breakdown: RatingBreakdown[]
  reviews: ReviewModel[]
}) {
  if (rating === undefined || reviewCount === undefined) return null

  return (
    <section
      id="reviews"
      className="scroll-mt-volta-chrome border-t border-volta-line pt-10"
    >
      <h2 className="volta-display pb-6 text-volta-heading text-volta-chalk">
        Reviews
      </h2>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
        <div className="flex shrink-0 flex-col gap-6 lg:w-72">
          <div className="flex items-center gap-4">
            <span className="volta-display text-5xl leading-none text-volta-volt tabular-nums">
              {formatRating(rating)}
            </span>
            <div className="flex flex-col gap-1">
              <Stars rating={rating} size="lg" />
              <span className="text-volta-micro text-volta-ash tabular-nums">
                {formatCount(reviewCount)} reviews
              </span>
            </div>
          </div>

          <ul className="flex flex-col gap-1.5">
            {breakdown.map((row) => (
              <li key={row.stars} className="flex items-center gap-3">
                <span className="w-6 shrink-0 text-volta-micro text-volta-ash tabular-nums">
                  {row.stars}★
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-volta-pill bg-volta-steel">
                  <span
                    className="block h-full rounded-volta-pill bg-volta-volt"
                    style={{ width: `${row.percent}%` }}
                  />
                </span>
                <span className="w-10 shrink-0 text-right text-volta-micro text-volta-smoke tabular-nums">
                  {formatCount(row.count)}
                </span>
              </li>
            ))}
          </ul>

          <Button variant="outline" size="default" className="w-full">
            Write a review
          </Button>
        </div>

        <div className="min-w-0 flex-1">
          {reviews.length === 0 ? (
            <p className="text-volta-body text-volta-ash">
              {formatCount(reviewCount)} people have rated this. Nobody has
              written about it yet — be the first.
            </p>
          ) : (
            <ul className="flex flex-col">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="flex flex-col gap-3 border-b border-volta-line py-6 first:pt-0 last:border-b-0"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <Stars rating={review.rating} />
                    <h3 className="volta-wide text-volta-title text-volta-chalk">
                      {review.title}
                    </h3>
                  </div>

                  <p className="text-volta-body text-volta-ash">
                    {review.body}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="volta-wide text-volta-micro text-volta-chalk">
                      {review.author}
                    </span>
                    {review.verified && (
                      <Badge variant="dim">Verified buyer</Badge>
                    )}
                    {review.context && (
                      <span className="text-volta-micro text-volta-smoke">
                        {review.context}
                      </span>
                    )}
                    <span className="ml-auto text-volta-micro text-volta-smoke">
                      {formatReviewDate(review.date)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
