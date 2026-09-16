import Image from "next/image"
import Link from "next/link"

import type { Collection } from "@/lib/noord/types"

/**
 * Sub-collections across the head of a category page: a scrolling row of
 * shots, each linking the category page back to itself filtered to one facet
 * value. Scrolls rather than wraps, so the row never pushes the category name
 * below the fold.
 */
export function CollectionRail({ collections }: { collections: Collection[] }) {
  if (collections.length === 0) return null

  return (
    <div className="noord-gutter flex gap-3 overflow-x-auto pt-4 pb-2 md:gap-6">
      {collections.map((collection) => (
        <Link
          key={collection.href}
          href={collection.href}
          className="group flex w-[9.5rem] shrink-0 flex-col gap-2.5 md:w-[13rem]"
        >
          <div className="relative aspect-square overflow-hidden bg-noord-wash">
            <Image
              src={collection.image}
              alt=""
              fill
              sizes="(min-width: 768px) 13rem, 9.5rem"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <span className="text-noord-body text-noord-ink group-hover:underline">
            {collection.label}
          </span>
        </Link>
      ))}
    </div>
  )
}
