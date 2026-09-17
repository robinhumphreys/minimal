"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, SearchIcon, ShoppingBagIcon, UserIcon } from "lucide-react"
import { cn } from "cn"

import { useSearchAssist } from "@/lib/config/use-surface"
import { bagCount, useBag } from "@/lib/noord/bag"
import { useOverlays } from "@/lib/noord/overlays"
import type { NavModel } from "@/lib/noord/types"

import { Wordmark } from "./wordmark"

/** Sticky header: a phone bar below `lg`, inline categories above it. */
export function Header({ nav }: { nav: NavModel }) {
  const pathname = usePathname()
  const show = useOverlays((state) => state.show)
  const searchAssist = useSearchAssist("noord")
  const lines = useBag((state) => state.lines)
  const hydrated = useBag((state) => state.hydrated)
  const count = hydrated ? bagCount(lines) : 0

  return (
    <header className="sticky top-0 z-40 border-b border-noord-line bg-noord-paper/95 backdrop-blur-sm">
      <div className="noord-gutter flex h-noord-header items-center justify-between gap-4 lg:h-14">
        <div className="flex flex-1 items-center gap-6">
          <IconButton
            label="Open menu"
            onClick={() => show("nav")}
            className="lg:hidden"
          >
            <MenuIcon className="size-5" strokeWidth={1.5} />
          </IconButton>

          {/* Desktop only: hidden behind the hamburger on a phone. */}
          <ul className="hidden items-center gap-6 lg:flex">
            {nav.utility.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="noord-underline text-noord-micro text-noord-ink-muted uppercase"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/noord"
          className="shrink-0 focus-visible:ring-1 focus-visible:ring-noord-ink focus-visible:ring-offset-4 focus-visible:outline-none"
        >
          <Wordmark className="text-[0.8125rem] sm:text-sm lg:text-base" />
          <span className="sr-only">Noord Suits — home</span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-1">
          {/* Search is the agent's; without it there is nothing to open. */}
          {searchAssist && (
            <IconButton label="Search" onClick={() => show("search")}>
              <SearchIcon className="size-5" strokeWidth={1.5} />
            </IconButton>
          )}
          <Link
            href="/noord"
            aria-label="Account"
            className="relative hidden size-10 items-center justify-center text-noord-ink transition-colors hover:text-noord-ink-muted lg:flex"
          >
            <UserIcon className="size-5" strokeWidth={1.5} />
          </Link>
          <IconButton label={`Bag, ${count} items`} onClick={() => show("bag")}>
            <ShoppingBagIcon className="size-5" strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute top-1 right-0.5 min-w-4 rounded-noord bg-noord-ink px-1 text-center text-[0.5625rem] leading-4 font-medium text-noord-paper tabular-nums">
                {count}
              </span>
            )}
          </IconButton>
        </div>
      </div>

      <nav
        aria-label="Categories"
        className="hidden border-t border-noord-line lg:block"
      >
        <ul className="noord-gutter flex items-center justify-center gap-7 xl:gap-9">
          {nav.categories.map((category) => {
            const current = pathname === category.href
            return (
              <li key={category.href + category.label}>
                <Link
                  href={category.href}
                  aria-current={current ? "page" : undefined}
                  // `-mb-px` drops the underline onto the header rule rather
                  // than leaving it floating a pixel above it.
                  className={cn(
                    "-mb-px flex h-11 items-center border-b text-noord-micro text-noord-ink uppercase transition-colors hover:border-noord-ink",
                    current ? "border-noord-ink" : "border-transparent",
                  )}
                >
                  {category.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}

function IconButton({
  label,
  onClick,
  children,
  className,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "relative -mx-1 flex size-10 items-center justify-center text-noord-ink transition-colors hover:text-noord-ink-muted focus-visible:ring-1 focus-visible:ring-noord-ink focus-visible:outline-none",
        className,
      )}
    >
      {children}
    </button>
  )
}
