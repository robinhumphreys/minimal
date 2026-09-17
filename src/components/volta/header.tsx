"use client"

import Link from "next/link"
import {
  ListIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
} from "@phosphor-icons/react/ssr"
import { useSearchAssist } from "@/lib/config/use-surface"
import { cn } from "@/lib/utils"

import { bagCount, useBag } from "@/lib/volta/bag"
import { useOverlays } from "@/lib/volta/overlays"
import type { NavModel } from "@/lib/volta/types"

import { DesktopNav } from "./desktop-nav"
import { Wordmark } from "./wordmark"

// From `lg` up the hamburger is gone entirely and the categories sit inline
// instead; no mobile navigation survives onto the desktop layout.
export function Header({ nav }: { nav: NavModel }) {
  const show = useOverlays((state) => state.show)
  const searchAssist = useSearchAssist("volta")
  const lines = useBag((state) => state.lines)
  const hydrated = useBag((state) => state.hydrated)
  const count = hydrated ? bagCount(lines) : 0

  return (
    <header className="sticky top-0 z-40 border-b border-volta-line bg-volta-void/95 backdrop-blur">
      <div className="volta-gutter flex h-volta-header items-center gap-4">
        <IconButton
          label="Open menu"
          onClick={() => show("nav")}
          className="-ml-2 lg:hidden"
        >
          <ListIcon className="size-6" weight="bold" />
        </IconButton>

        <Link
          href="/volta"
          className="shrink-0 rounded-volta focus-visible:ring-2 focus-visible:ring-volta-volt focus-visible:ring-offset-4 focus-visible:ring-offset-volta-void focus-visible:outline-none"
        >
          <Wordmark className="text-lg sm:text-xl" />
          <span className="sr-only">Volta — home</span>
        </Link>

        <DesktopNav nav={nav} />

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Search is the agent's; without it there is nothing to open. */}
          {searchAssist && (
            <ActionButton
              label="Search"
              onClick={() => show("search")}
              icon={<MagnifyingGlassIcon className="size-5" weight="bold" />}
            />
          )}
          <Link
            href="/volta"
            className="hidden h-10 items-center gap-2 rounded-volta px-2 text-volta-chalk transition-colors hover:text-volta-volt focus-visible:ring-2 focus-visible:ring-volta-volt focus-visible:outline-none lg:flex"
          >
            <UserIcon className="size-5" weight="bold" />
            <span className="volta-wide text-volta-micro">Account</span>
          </Link>
          <ActionButton
            label="Cart"
            srLabel={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
            onClick={() => show("bag")}
            className="-mr-2"
            icon={<ShoppingCartIcon className="size-5" weight="bold" />}
          >
            {count > 0 && (
              <span className="min-w-4 rounded-volta-pill bg-volta-volt px-1 text-center text-[0.5625rem] leading-4 font-bold text-volta-void tabular-nums">
                {count}
              </span>
            )}
          </ActionButton>
        </div>
      </div>
    </header>
  )
}

/**
 * Label drops below `sm`, where the bar is too narrow for three of them;
 * `srLabel` covers cases where the visible word is not the whole story.
 */
function ActionButton({
  label,
  srLabel,
  onClick,
  icon,
  children,
  className,
}: {
  label: string
  srLabel?: string
  onClick: () => void
  icon: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={srLabel ?? label}
      className={cn(
        "flex h-10 items-center gap-2 rounded-volta px-2 text-volta-chalk transition-colors hover:text-volta-volt focus-visible:ring-2 focus-visible:ring-volta-volt focus-visible:outline-none",
        className,
      )}
    >
      {icon}
      <span
        aria-hidden
        className="volta-wide hidden text-volta-micro sm:inline"
      >
        {label}
      </span>
      {children}
    </button>
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
