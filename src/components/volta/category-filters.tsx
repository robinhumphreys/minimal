"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { XIcon } from "lucide-react"

import type { FacetGroup, FacetKey } from "@/lib/volta/types"

/**
 * Filter chips over a category's facets.
 *
 * State lives in the URL rather than in React: a filtered grid is something a
 * shopper shares and comes back to, and it keeps the page a server component
 * that re-renders with the right products instead of hiding tiles on the
 * client.
 */
export function CategoryFilters({
  groups,
  total,
  shown,
}: {
  groups: FacetGroup[]
  total: number
  shown: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const active = (key: FacetKey) => params.get(key)
  const filtered = groups.some((group) => active(group.key))

  function set(key: FacetKey, value: string) {
    const next = new URLSearchParams(params)
    // Tapping the chip that is already on is how a shopper clears it.
    if (next.get(key) === value) next.delete(key)
    else next.set(key, value)

    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  if (groups.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => (
        <div key={group.key} className="flex flex-col gap-2">
          <h3 className="volta-wide text-volta-micro text-volta-smoke">
            {group.label}
          </h3>
          {/*
            The chips scroll rather than wrap: a category with eight forms and
            eight flavours would otherwise push the grid below the fold.
          */}
          <ul className="-mx-volta-gutter flex gap-2 overflow-x-auto px-volta-gutter pb-1 md:mx-0 md:flex-wrap md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {group.options.map((option) => {
              const on = active(group.key) === option.value
              return (
                <li key={option.value} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => set(group.key, option.value)}
                    aria-pressed={on}
                    className={
                      on
                        ? "volta-wide flex items-center gap-1.5 rounded-volta border-2 border-volta-volt bg-volta-volt px-3 py-2 text-volta-micro text-volta-void"
                        : "volta-wide flex items-center gap-1.5 rounded-volta border-2 border-volta-line px-3 py-2 text-volta-micro text-volta-chalk transition-colors hover:border-volta-line-strong"
                    }
                  >
                    {option.value}
                    <span
                      className={
                        on
                          ? "tabular-nums text-volta-void/60"
                          : "tabular-nums text-volta-smoke"
                      }
                    >
                      {option.count}
                    </span>
                    {on && <XIcon className="size-3" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      <div className="flex items-center justify-between gap-4 border-t border-volta-line pt-3">
        <p className="text-volta-micro tracking-volta-wide text-volta-ash uppercase tabular-nums">
          {filtered ? `${shown} of ${total}` : `${total}`} products
        </p>
        {filtered && (
          <Link
            href={pathname}
            scroll={false}
            replace
            className="volta-wide text-volta-micro text-volta-volt hover:underline"
          >
            Clear filters
          </Link>
        )}
      </div>
    </div>
  )
}
