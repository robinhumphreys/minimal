import Link from "next/link"

import { formatReviewDate } from "@/lib/volta/format"
import type { ReviewModel } from "@/lib/volta/types"

import { Badge } from "@/components/volta/ui/badge"
import { Stars } from "./rating"

/** Each quote carries the product it is about, so a card links through to it. */
export function Testimonials({ reviews }: { reviews: ReviewModel[] }) {
  if (reviews.length === 0) return null

  return (
    <section className="border-y border-volta-line bg-volta-carbon py-14">
      <div className="volta-gutter mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-1.5">
          <span className="volta-wide text-volta-micro text-volta-volt">
            Verified reviews
          </span>
          <h2 className="volta-display text-volta-heading text-volta-chalk">
            What the gym says
          </h2>
        </div>

        <ul className="grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="flex flex-col gap-4 rounded-volta border border-volta-line bg-volta-void p-5"
            >
              <Stars rating={review.rating} size="lg" />

              <blockquote className="flex flex-1 flex-col gap-2">
                <p className="volta-title text-volta-title text-volta-chalk">
                  {review.title}
                </p>
                <p className="text-volta-body text-volta-ash">{review.body}</p>
              </blockquote>

              <footer className="flex flex-col gap-3 border-t border-volta-line pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="volta-wide text-volta-micro text-volta-chalk">
                    {review.author}
                  </span>
                  {review.verified && (
                    <Badge variant="dim">Verified buyer</Badge>
                  )}
                  <span className="text-volta-micro text-volta-smoke">
                    {formatReviewDate(review.date)}
                  </span>
                </div>
                {review.context && (
                  <span className="text-volta-micro text-volta-smoke">
                    {review.context}
                  </span>
                )}
                {review.productName && review.productHref && (
                  <Link
                    href={review.productHref}
                    className="volta-underline volta-wide w-fit text-volta-micro text-volta-volt"
                  >
                    {review.productName}
                  </Link>
                )}
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
