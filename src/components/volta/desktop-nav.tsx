import Link from "next/link"

import type { NavModel } from "@/lib/volta/types"

/**
 * Plain links: each category page carries its own filters, so a dropdown
 * here would only repeat them a click early.
 */
export function DesktopNav({ nav }: { nav: NavModel }) {
  return (
    <nav
      aria-label="Categories"
      className="hidden min-w-0 self-stretch lg:block"
    >
      <ul className="ml-6 flex h-full items-center gap-6 xl:ml-10 xl:gap-8">
        {nav.categories.map((category) => (
          <li key={category.href} className="flex h-full">
            <Link
              href={category.href}
              // `-mb-px` drops the underline onto the header rule rather than
              // leaving it floating a pixel above it.
              className="volta-wide -mb-px flex h-full items-center border-b-2 border-transparent text-volta-label whitespace-nowrap text-volta-chalk transition-colors hover:border-volta-volt hover:text-volta-volt"
            >
              {category.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
