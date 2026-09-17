"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { CheckIcon } from "@phosphor-icons/react/ssr"

import type { FacetGroup, FacetKey } from "@/lib/volta/types"

/**
 * State lives in the URL, not React, so a filtered grid is shareable and the
 * page stays a server component that re-renders instead of hiding tiles.
 */
export function CategoryFilters({ groups }: { groups: FacetGroup[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const active = (key: FacetKey) => params.get(key)
  const filtered = groups.some((group) => active(group.key))

  function set(key: FacetKey, value: string) {
    const next = new URLSearchParams(params)
    // Ticking the option that is already on is how a shopper clears it.
    if (next.get(key) === value) next.delete(key)
    else next.set(key, value)

    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  if (groups.length === 0) return null

  return (
    <aside aria-label="Filters" className="flex flex-col">
      <div className="flex items-baseline justify-between border-b border-volta-mist pb-3">
        <h2 className="volta-wide text-volta-label text-volta-void">Filter</h2>
        {filtered && (
          <Link
            href={pathname}
            scroll={false}
            replace
            className="volta-wide text-volta-micro text-volta-slate hover:text-volta-void hover:underline"
          >
            Clear all
          </Link>
        )}
      </div>

      {groups.map((group) => (
        <section
          key={group.key}
          className="flex flex-col gap-3 border-b border-volta-mist py-5 last:border-b-0"
        >
          <h3 className="volta-wide text-volta-micro text-volta-slate">
            {group.label}
          </h3>
          <ul className="flex flex-col gap-2">
            {group.options.map((option) => {
              const on = active(group.key) === option.value
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => set(group.key, option.value)}
                    aria-pressed={on}
                    className="group/option flex w-full items-center gap-3 text-left text-volta-body text-volta-void"
                  >
                    <span
                      aria-hidden
                      className={
                        on
                          ? "flex size-4 shrink-0 items-center justify-center rounded-[3px] bg-volta-void text-volta-volt"
                          : "flex size-4 shrink-0 items-center justify-center rounded-[3px] border border-volta-mist transition-colors group-hover/option:border-volta-slate"
                      }
                    >
                      {on && <CheckIcon className="size-3" weight="bold" />}
                    </span>
                    <span className="flex-1">{option.value}</span>
                    <span className="text-volta-micro text-volta-slate tabular-nums">
                      {option.count}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </aside>
  )
}
