import Link from "next/link"
import { ArrowRightIcon } from "@phosphor-icons/react/ssr"
import { cn } from "@/lib/utils"

import type { ProductCardModel } from "@/lib/volta/types"

import { ProductCard } from "./product-card"

/**
 * A horizontally scrolling row of tiles.
 *
 * Scroll rather than a grid: on a phone a rail signals "there is more this way"
 * in a way a two-up grid cannot, and it keeps five rails on the homepage from
 * turning into five screens of scrolling. Snap points stop it drifting between
 * tiles.
 *
 * Drawn for a white surface throughout — a rail only ever appears inside a
 * `Shelf`.
 */
export function ProductRail({
  title,
  eyebrow,
  href,
  hrefLabel = "See all",
  products,
  preload = false,
  className,
}: {
  title: string
  eyebrow?: string
  href?: string
  hrefLabel?: string
  products: ProductCardModel[]
  /** Set on the first rail of the page; everything below it lazy-loads. */
  preload?: boolean
  className?: string
}) {
  if (products.length === 0) return null

  return (
    <div
      className={cn("mx-auto flex w-full max-w-7xl flex-col gap-5", className)}
    >
      <div className="volta-gutter flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          {eyebrow && (
            <span className="volta-wide text-volta-micro text-volta-volt-deep">
              {eyebrow}
            </span>
          )}
          <h2 className="volta-display text-volta-heading text-volta-void">
            {title}
          </h2>
        </div>
        {href && (
          <Link
            href={href}
            className="volta-wide group/all flex shrink-0 items-center gap-1.5 pb-1 text-volta-micro text-volta-slate transition-colors hover:text-volta-void"
          >
            {hrefLabel}
            <ArrowRightIcon className="size-3.5 transition-transform group-hover/all:translate-x-0.5" />
          </Link>
        )}
      </div>

      {/*
        The negative gutter lets tiles bleed to the screen edge while the
        scroll padding keeps the first and last one clear of it.
      */}
      <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-volta-gutter px-volta-gutter pb-2 md:px-8 md:scroll-pl-8 xl:px-12 xl:scroll-pl-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product, index) => (
          <li
            key={product.slug}
            className="w-[calc(50%-0.5rem)] shrink-0 snap-start sm:w-56 lg:w-64"
          >
            <ProductCard
              product={product}
              preload={preload && index < 2}
              sizes="(min-width: 1024px) 16rem, (min-width: 640px) 14rem, 45vw"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
