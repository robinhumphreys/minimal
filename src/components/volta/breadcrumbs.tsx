import Link from "next/link"
import { CaretRightIcon } from "@phosphor-icons/react/ssr"

import { cn } from "@/lib/utils"

export type Crumb = {
  label: string
  /** Omitted on the last crumb — you do not link to the page you are on. */
  href?: string
}

// Each separator lives inside the `<li>` it precedes: an `<ol>` may only
// contain `<li>`, and a bare sibling caret sat on its own baseline, stepping
// the trail.
export function Breadcrumbs({
  trail,
  className,
}: {
  trail: Crumb[]
  className?: string
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {trail.map((crumb, index) => (
          <li key={crumb.label} className="flex items-center gap-2">
            {index > 0 && (
              <CaretRightIcon
                aria-hidden
                className="size-3.5 shrink-0 text-volta-smoke"
              />
            )}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className={cn(
                  "volta-wide text-volta-micro text-volta-ash",
                  "transition-colors hover:text-volta-volt",
                )}
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                aria-current="page"
                className="volta-wide text-volta-micro text-volta-chalk"
              >
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
