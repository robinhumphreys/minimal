import Image from "next/image"
import Link from "next/link"
import { cn } from "cn"

import { discountPercent } from "@/lib/volta/format"
import type { ProductCardModel } from "@/lib/volta/types"

import { Badge } from "@/components/volta/ui/badge"
import { Price } from "./price"
import { RatingRow } from "./rating"

/**
 * The product tile, used on the homepage rails, category grid and nav promos.
 *
 * The image plate is white, not dark. Every catalog shot is a white-background
 * packshot, so a dark plate leaves a white rectangle floating inside it — the
 * white plate makes the packshot's own background disappear and turns the tile
 * into a deliberate light block against the page.
 */
export function ProductCard({
  product,
  preload = false,
  className,
  sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw",
}: {
  product: ProductCardModel
  /** Set on the first row of the first grid; everything else lazy-loads. */
  preload?: boolean
  className?: string
  sizes?: string
}) {
  const saving = discountPercent(product.price, product.compareAt)

  return (
    <Link
      href={product.href}
      className={cn(
        "group/card flex flex-col gap-3 outline-none focus-visible:ring-2 focus-visible:ring-volta-volt focus-visible:ring-offset-2 focus-visible:ring-offset-volta-void",
        className,
      )}
    >
      <div className="relative aspect-4/5 overflow-hidden rounded-volta bg-white">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes}
          preload={preload}
          className="object-contain transition-transform duration-500 group-hover/card:scale-105"
        />
        {saving > 0 && (
          <Badge variant="sale" className="absolute top-2 left-2">
            −{saving}%
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <RatingRow rating={product.rating} reviewCount={product.reviewCount} />

        <h3 className="volta-wide text-volta-title text-volta-chalk transition-colors group-hover/card:text-volta-volt">
          {product.name}
        </h3>

        {(product.flavour || product.size) && (
          <p className="text-volta-micro tracking-volta-wide text-volta-ash uppercase">
            {[product.flavour, product.size].filter(Boolean).join(" · ")}
          </p>
        )}

        <Price price={product.price} compareAt={product.compareAt} />
      </div>
    </Link>
  )
}
