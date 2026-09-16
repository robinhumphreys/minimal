"use client"

import Link from "next/link"
import { SearchIcon } from "lucide-react"

import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetTitle,
} from "@/components/noord/ui/sheet"
import { useSearchAssist } from "@/lib/config/use-surface"
import { useOverlays } from "@/lib/noord/overlays"
import type { NavModel } from "@/lib/noord/types"

/**
 * Site navigation for phones and tablets.
 *
 * Deliberately spare: a list of names in large type, no rules, no chevrons, no
 * section headings and no merchandising. The categories are the content, and
 * anything drawn between them competes with them. The desktop bar covers `lg`
 * and up, so this never opens there.
 */
export function NavOverlay({ nav }: { nav: NavModel }) {
  const open = useOverlays((state) => state.open) === "nav"
  const toggle = useOverlays((state) => state.toggle)
  const show = useOverlays((state) => state.show)
  const searchAssist = useSearchAssist("noord")
  const close = useOverlays((state) => state.close)

  return (
    <Sheet open={open} onOpenChange={(next) => toggle("nav", next)}>
      <SheetContent side="full">
        <SheetTitle className="sr-only">Menu</SheetTitle>

        {/* Search sits where the hamburger was, so the two swap in place. */}
        <div className="noord-sheet-gutter flex h-noord-header shrink-0 items-center">
          {searchAssist && (
            <button
              type="button"
              onClick={() => show("search")}
              aria-label="Search"
              className="-ml-1 flex size-10 items-center justify-center text-noord-ink transition-colors hover:text-noord-ink-muted"
            >
              <SearchIcon className="size-5" strokeWidth={1.5} />
            </button>
          )}
        </div>

        <SheetBody>
          <nav className="noord-sheet-gutter flex flex-col pt-5 pb-8">
            <ul className="flex flex-col gap-1">
              {nav.menu.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className="block text-noord-nav text-noord-ink transition-colors hover:text-noord-ink-muted"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="mt-10 flex flex-col gap-1.5">
              {nav.secondary.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className="block text-noord-nav-sub text-noord-ink transition-colors hover:text-noord-ink-muted"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}
