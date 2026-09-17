import { StarIcon } from "lucide-react"
import { cn } from "../cn"

import type { ProductPick } from "@/lib/agent/types"
import type { Cards } from "@/lib/config/schema"

/**
 * Scroll padding matches inline padding since a snap point is measured from
 * the scrollport, not the content box, or cards would snap flush to the edge.
 */
export function ProductCards({
  products,
  cards,
}: {
  products: ProductPick[]
  cards: Cards
}) {
  if (products.length === 0) return null

  if (products.length === 1) {
    return <ProductCard product={products[0]} cards={cards} layout="row" />
  }

  return (
    <div className="ma:-mx-(--card-spacing) ma:flex ma:snap-x ma:snap-mandatory ma:scroll-px-(--card-spacing) ma:[scrollbar-width:none] ma:gap-2 ma:overflow-x-auto ma:px-(--card-spacing) ma:pb-1">
      {products.map((product) => (
        <ProductCard
          key={product.slug}
          product={product}
          cards={cards}
          layout="column"
          className="ma:w-44 ma:shrink-0 ma:snap-start"
        />
      ))}
    </div>
  )
}

export function ProductCard({
  product,
  cards,
  layout,
  className,
}: {
  product: ProductPick
  cards: Cards
  layout: "row" | "column"
  className?: string
}) {
  const ratio = cards.ratio === "square" ? "ma:aspect-square" : "ma:aspect-4/5"
  const rating =
    cards.rating &&
    product.rating !== undefined &&
    product.reviewCount !== undefined

  return (
    <a
      href={product.url}
      data-slot="product-card"
      className={cn(
        "ma:flex ma:overflow-hidden ma:rounded-lg ma:border ma:border-border ma:bg-card ma:text-card-foreground ma:no-underline ma:outline-none ma:hover:bg-muted ma:focus-visible:ring-3 ma:focus-visible:ring-ring/50",
        layout === "row" ? "ma:flex-row" : "ma:flex-col",
        className,
      )}
    >
      {/* Standalone bundle on someone else's page; no next/image to lean on. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.image}
        alt=""
        loading="lazy"
        className={cn(
          "ma:bg-muted ma:object-cover",
          ratio,
          layout === "row" ? "ma:w-24 ma:shrink-0" : "ma:w-full",
        )}
      />
      <div className="ma:flex ma:min-w-0 ma:flex-1 ma:flex-col ma:gap-1 ma:p-2.5">
        <p className="ma:line-clamp-2 ma:text-sm ma:leading-snug ma:font-medium">
          {product.name}
        </p>
        {cards.price ? (
          <p className="ma:flex ma:items-baseline ma:gap-1.5 ma:text-sm ma:tabular-nums">
            <span>{product.price}</span>
            {product.compareAt ? (
              <span className="ma:text-xs ma:text-muted-foreground ma:line-through">
                {product.compareAt}
              </span>
            ) : null}
          </p>
        ) : null}
        {rating ? (
          <p className="ma:flex ma:items-center ma:gap-1 ma:text-xs ma:text-muted-foreground">
            <StarIcon className="ma:size-3 ma:fill-current" />
            {product.rating?.toFixed(1)}
            <span>({product.reviewCount?.toLocaleString("en-IE")})</span>
          </p>
        ) : null}
        {product.why ? (
          <p className="ma:line-clamp-3 ma:text-xs ma:leading-snug ma:text-muted-foreground">
            {product.why}
          </p>
        ) : null}
      </div>
    </a>
  )
}
