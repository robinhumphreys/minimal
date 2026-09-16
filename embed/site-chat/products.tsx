import { StarIcon } from "lucide-react"
import { cn } from "cn"

import type { ProductPick } from "@/lib/agent/types"

/**
 * What a recommendation looks like: cards, not prose.
 *
 * One pick lies down as a row so it reads as the answer; two or more stand up
 * as a rail the shopper can swipe, bled to the window's edges so the rail
 * reads as continuing past them.
 */
export function ProductCards({ products }: { products: ProductPick[] }) {
  if (products.length === 0) return null

  if (products.length === 1) {
    return <ProductCard product={products[0]} layout="row" />
  }

  return (
    <div className="-mx-(--card-spacing) flex snap-x snap-mandatory [scrollbar-width:none] gap-2 overflow-x-auto px-(--card-spacing) pb-1">
      {products.map((product) => (
        <ProductCard
          key={product.slug}
          product={product}
          layout="column"
          className="w-44 shrink-0 snap-start"
        />
      ))}
    </div>
  )
}

export function ProductCard({
  product,
  layout,
  className,
}: {
  product: ProductPick
  layout: "row" | "column"
  className?: string
}) {
  return (
    <a
      href={product.url}
      data-slot="product-card"
      className={cn(
        "flex overflow-hidden rounded-lg border border-border bg-card text-card-foreground no-underline outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
        layout === "row" ? "flex-row" : "flex-col",
        className,
      )}
    >
      {/* The embed is a standalone bundle on someone else's page; there is no
          `next/image` to lean on out there. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.image}
        alt=""
        loading="lazy"
        className={cn(
          "bg-muted object-cover",
          layout === "row" ? "aspect-4/5 w-24 shrink-0" : "aspect-4/5 w-full",
        )}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1 p-2.5">
        <p className="line-clamp-2 text-sm leading-snug font-medium">
          {product.name}
        </p>
        <p className="flex items-baseline gap-1.5 text-sm tabular-nums">
          <span>{product.price}</span>
          {product.compareAt ? (
            <span className="text-xs text-muted-foreground line-through">
              {product.compareAt}
            </span>
          ) : null}
        </p>
        {product.rating !== undefined && product.reviewCount !== undefined ? (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <StarIcon className="size-3 fill-current" />
            {product.rating.toFixed(1)}
            <span>({product.reviewCount.toLocaleString("en-IE")})</span>
          </p>
        ) : null}
        <p className="line-clamp-3 text-xs leading-snug text-muted-foreground">
          {product.why}
        </p>
      </div>
    </a>
  )
}
