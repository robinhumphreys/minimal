import Link from "next/link"

import { ProductCard } from "@/components/noord/product-card"
import type { ProductCardModel } from "@/lib/noord/types"

/**
 * A horizontally scrolling row on a phone, a plain grid once four tiles fit.
 * Scrolling beats wrapping on mobile: it keeps the tiles large enough to judge
 * a garment by.
 */
export function ProductRail({
  title,
  href,
  hrefLabel = "View all",
  products,
}: {
  title: string
  href?: string
  hrefLabel?: string
  products: ProductCardModel[]
}) {
  if (products.length === 0) return null

  return (
    <section className="py-12 md:py-16">
      <div className="noord-gutter mb-6 flex items-baseline justify-between gap-4">
        <h2 className="text-noord-section">{title}</h2>
        {href && (
          <Link
            href={href}
            className="noord-underline shrink-0 text-noord-micro text-noord-ink uppercase"
          >
            {hrefLabel}
          </Link>
        )}
      </div>

      {/*
        The scroll padding tracks the gutter: a snap point is measured from
        the scrollport, not the padding, so without it every tile after the
        first would snap flush to the screen edge.
      */}
      <div className="noord-gutter -mx-px flex snap-x snap-mandatory scroll-pl-noord-gutter gap-3 overflow-x-auto pb-2 md:scroll-pl-8 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible xl:scroll-pl-12">
        {products.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
            className="w-[62vw] shrink-0 snap-start sm:w-[38vw] lg:w-auto"
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 38vw, 62vw"
          />
        ))}
      </div>
    </section>
  )
}
