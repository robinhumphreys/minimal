import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

import type { ProductCardModel } from "@/lib/volta/types"

import { Price } from "./price"
import { RatingRow } from "./rating"

/**
 * The product tile, used on the homepage rails, category grid and nav promos.
 *
 * Always drawn for a white surface — see `Shelf`, which is what it sits on
 * everywhere except the nav drawer, where it gets its own white panel. The
 * card therefore takes no `surface` prop: a dark variant would only exist to
 * be used by mistake.
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
  return (
    <Link
      href={product.href}
      className={cn(
        "group/card flex flex-col gap-3 outline-none focus-visible:ring-2 focus-visible:ring-volta-volt-deep focus-visible:ring-offset-2 focus-visible:ring-offset-volta-chalk",
        className,
      )}
    >
      <div className="relative aspect-4/5 overflow-hidden rounded-volta bg-volta-chalk">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes}
          preload={preload}
          className="object-contain transition-transform duration-500 group-hover/card:scale-105"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <RatingRow
          rating={product.rating}
          reviewCount={product.reviewCount}
          surface="light"
        />

        <h3 className="volta-title text-volta-title text-volta-void transition-colors group-hover/card:text-volta-volt-deep">
          {product.name}
        </h3>

        {(product.flavour || product.size) && (
          <p className="text-volta-micro tracking-volta-wide text-volta-slate uppercase">
            {[product.flavour, product.size].filter(Boolean).join(" · ")}
          </p>
        )}

        <Price price={product.price} surface="light" />
      </div>
    </Link>
  )
}
