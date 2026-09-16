import Image from "next/image"
import Link from "next/link"
import { cn } from "cn"

import { Badge } from "@/components/noord/ui/badge"
import { formatPrice } from "@/lib/noord/format"
import type { ProductCardModel } from "@/lib/noord/types"

/** Grid tile default; `sizes` should describe the grid it is dropped into. */
export function ProductCard({
  product,
  sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw",
  priority = false,
  bleed = false,
  className,
}: {
  product: ProductCardModel
  sizes?: string
  priority?: boolean
  /** Image runs edge to edge; only the text keeps the page gutter. */
  bleed?: boolean
  className?: string
}) {
  const onSale = product.compareAt !== undefined

  return (
    <Link
      href={product.href}
      className={cn("group flex flex-col gap-3", className)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-noord-wash">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
        {onSale && (
          <Badge variant="sale" className="absolute top-2 left-2">
            Sale
          </Badge>
        )}
      </div>

      <div
        className={cn(
          "flex flex-col gap-1",
          bleed && "noord-gutter sm:px-0",
        )}
      >
        <span className="text-noord-micro text-noord-ink-faint uppercase">
          {product.colour ?? product.categoryName}
        </span>
        <span className="text-noord-body text-noord-ink group-hover:underline">
          {product.name}
        </span>
        <span className="flex items-baseline gap-2 text-noord-body tabular-nums">
          <span className={cn(onSale && "text-noord-sale")}>
            {formatPrice(product.price)}
          </span>
          {product.compareAt !== undefined && (
            <s className="text-noord-ink-faint">
              {formatPrice(product.compareAt)}
            </s>
          )}
        </span>
      </div>
    </Link>
  )
}
