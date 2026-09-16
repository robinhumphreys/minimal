import Image from "next/image"
import Link from "next/link"

import { formatPrice, type BrandId, type Product } from "@/lib/catalog"

export function ProductCard({ id, product }: { id: BrandId; product: Product }) {
  return (
    <Link href={`/${id}/p/${product.slug}`} className="flex flex-col gap-2">
      <Image
        src={product.images[0]}
        alt={product.name}
        width={400}
        height={400}
        className="w-full"
      />
      <span className="text-sm">{product.name}</span>
      <span className="text-sm">
        {product.compareAt ? (
          <>
            <s className="text-muted-foreground">
              {formatPrice(product.compareAt)}
            </s>{" "}
            {formatPrice(product.price)}
          </>
        ) : (
          formatPrice(product.price)
        )}
      </span>
    </Link>
  )
}
