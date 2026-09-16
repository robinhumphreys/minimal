import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { CategoryGrid } from "@/components/noord/category-grid"
import { Skeleton } from "@/components/noord/ui/skeleton"
import { getCategory, getProductsInCategory } from "@/lib/catalog"
import { toSearchEntry } from "@/lib/noord/catalog-view"

export function CategoryPage({ slug }: { slug: string }) {
  const category = getCategory("noord", slug)
  if (!category) notFound()

  const products = getProductsInCategory("noord", slug).map(toSearchEntry)

  return (
    <>
      <div className="noord-gutter flex flex-col gap-3 pt-6 pb-8 md:pt-10">
        <nav aria-label="Breadcrumb">
          <Link
            href="/noord"
            className="noord-underline text-noord-micro text-noord-ink-faint uppercase"
          >
            Home
          </Link>
        </nav>
        <h1 className="text-noord-display">{category.name}</h1>
        <p className="max-w-lg text-noord-lead text-noord-ink-muted">
          {category.description}
        </p>
      </div>

      {/* The grid reads `?fit=…` and friends off the URL, which is what the
          desktop nav panels link into. `useSearchParams` needs a boundary for
          the page shell to stay statically prerendered. */}
      <Suspense fallback={<GridSkeleton />}>
        <CategoryGrid products={products} />
      </Suspense>
    </>
  )
}

function GridSkeleton() {
  return (
    <div className="noord-gutter grid grid-cols-2 gap-x-3 gap-y-10 py-8 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-3">
          <Skeleton className="aspect-[3/4] w-full" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  )
}
