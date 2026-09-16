"use client"

import Link from "next/link"
import { MenuIcon, SearchIcon, ShoppingBagIcon, UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { bagCount, useBag } from "@/lib/volta/bag"
import { useOverlays } from "@/lib/volta/overlays"
import type { NavModel } from "@/lib/volta/types"

import { DesktopNav } from "./desktop-nav"
import { Wordmark } from "./wordmark"

/**
 * Sticky header with two distinct layouts.
 *
 * Below `lg` it is the phone bar: hamburger, wordmark, search, bag. From `lg`
 * up the hamburger is gone entirely and the categories live inline with hover
 * panels — no mobile navigation survives onto the desktop layout.
 */
export function Header({ nav }: { nav: NavModel }) {
  const show = useOverlays((state) => state.show)
  const lines = useBag((state) => state.lines)
  const hydrated = useBag((state) => state.hydrated)
  const count = hydrated ? bagCount(lines) : 0

  return (
    <header className="sticky top-0 z-40 border-b border-volta-line bg-volta-void/95 backdrop-blur">
      <div className="volta-gutter flex h-volta-header items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-6">
          <IconButton
            label="Open menu"
            onClick={() => show("nav")}
            className="-ml-2 lg:hidden"
          >
            <MenuIcon className="size-6" strokeWidth={2.25} />
          </IconButton>

          {/* Desktop only: the service links that sit behind the hamburger
              on a phone. */}
          <ul className="hidden items-center gap-6 lg:flex">
            {nav.utility.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="volta-underline volta-wide text-volta-micro text-volta-ash transition-colors hover:text-volta-chalk"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/volta"
          className="shrink-0 rounded-volta focus-visible:ring-2 focus-visible:ring-volta-volt focus-visible:ring-offset-4 focus-visible:ring-offset-volta-void focus-visible:outline-none"
        >
          <Wordmark className="text-lg sm:text-xl" />
          <span className="sr-only">Volta — home</span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-1">
          <IconButton label="Search" onClick={() => show("search")}>
            <SearchIcon className="size-5" strokeWidth={2.25} />
          </IconButton>
          <Link
            href="/volta"
            aria-label="Account"
            className="hidden size-10 items-center justify-center text-volta-chalk transition-colors hover:text-volta-volt lg:flex"
          >
            <UserIcon className="size-5" strokeWidth={2.25} />
          </Link>
          <IconButton
            label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}
            onClick={() => show("bag")}
            className="-mr-2"
          >
            <ShoppingBagIcon className="size-5" strokeWidth={2.25} />
            {count > 0 && (
              <span className="absolute top-0.5 right-0 min-w-4 rounded-volta-pill bg-volta-volt px-1 text-center text-[0.5625rem] leading-4 font-bold text-volta-void tabular-nums">
                {count}
              </span>
            )}
          </IconButton>
        </div>
      </div>

      <DesktopNav nav={nav} />
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
        "relative flex size-10 items-center justify-center rounded-volta text-volta-chalk transition-colors hover:text-volta-volt focus-visible:ring-2 focus-visible:ring-volta-volt focus-visible:outline-none",
        className,
      )}
    >
      {children}
    </button>
  )
}
