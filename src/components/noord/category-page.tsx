import { Suspense } from "react"
import { notFound } from "next/navigation"

import { CategoryGrid } from "@/components/noord/category-grid"
import { ProductHelpBand } from "@/components/product-help-band"
import { Skeleton } from "@/components/noord/ui/skeleton"
import { getCategory, getProductsInCategory } from "@/lib/catalog"
import { toSearchEntry } from "@/lib/noord/catalog-view"

export function CategoryPage({ slug }: { slug: string }) {
  const category = getCategory("noord", slug)
  if (!category) notFound()

  const products = getProductsInCategory("noord", slug).map(toSearchEntry)

  return (
    <>
      {/* Product help, where a shopper stands before a wall of one kind of
          thing. The band is the storefront's; the button in it is the
          embed's, drawn into the mount when the agent is on the page. */}
      <ProductHelpBand brand="noord">
        <section className="noord-gutter border-b border-noord-line bg-noord-wash">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 py-8 text-center">
            <p className="text-noord-title">
              Not sure which of our {category.name.toLowerCase()} is yours?
            </p>
            <minimal-agent-guide data-topic={category.name} />
          </div>
        </section>
      </ProductHelpBand>

      {/* The grid reads `?fit=…` and friends off the URL. `useSearchParams`
          needs a boundary for the page shell to stay statically prerendered. */}
      <Suspense fallback={<GridSkeleton />}>
        <CategoryGrid
          products={products}
          title={category.name}
          description={category.description}
        />
      </Suspense>
    </>
  )
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-y-8 pt-10 sm:grid-cols-2 sm:gap-x-3 sm:px-4 md:grid-cols-3 md:px-8 xl:grid-cols-4 xl:px-12">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-3">
          <Skeleton className="aspect-[3/4] w-full" />
          <Skeleton className="mx-4 h-3 w-16 sm:mx-0" />
          <Skeleton className="mx-4 h-3 w-3/4 sm:mx-0" />
        </div>
      ))}
    </div>
  )
}
