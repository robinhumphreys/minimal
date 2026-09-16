"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/noord/ui/sheet"
import { useOverlays } from "@/lib/noord/overlays"
import type { NavLink, NavModel } from "@/lib/noord/types"

import { Wordmark } from "./wordmark"

/**
 * Site navigation for phones and tablets.
 *
 * The desktop bar covers `lg` and up on its own, so this never opens there —
 * the hamburger that triggers it is hidden at that width.
 */
export function NavOverlay({ nav }: { nav: NavModel }) {
  const open = useOverlays((state) => state.open) === "nav"
  const toggle = useOverlays((state) => state.toggle)
  const close = useOverlays((state) => state.close)

  return (
    <Sheet open={open} onOpenChange={(next) => toggle("nav", next)}>
      <SheetContent side="full">
        <SheetHeader className="justify-center">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Wordmark className="text-[0.8125rem] sm:text-sm" />
        </SheetHeader>

        <SheetBody>
          <div className="noord-gutter mx-auto w-full max-w-5xl pt-6 pb-16">
            <nav className="grid gap-10 md:grid-cols-2 md:gap-16">
              <ul className="flex flex-col">
                {nav.categories.map((category) => (
                  <li key={category.href + category.label}>
                    <Link
                      href={category.href}
                      onClick={close}
                      className="group flex items-center justify-between gap-4 border-b border-noord-line py-3.5"
                    >
                      <span className="text-noord-section text-noord-ink transition-colors group-hover:text-noord-ink-muted">
                        {category.label}
                      </span>
                      <ArrowRightIcon
                        className="size-4 shrink-0 text-noord-ink-faint transition-transform group-hover:translate-x-1"
                        strokeWidth={1.5}
                      />
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-10">
                <LinkGroup title="Explore" links={nav.explore} onNavigate={close} />
                <LinkGroup title="Service" links={nav.service} onNavigate={close} />
              </div>
            </nav>

            {nav.featured.length > 0 && (
              <section className="mt-14">
                <h2 className="mb-4 text-noord-micro text-noord-ink-faint uppercase">
                  Featured
                </h2>
                <div className="grid grid-cols-2 gap-3 md:max-w-lg">
                  {nav.featured.map((product) => (
                    <Link
                      key={product.slug}
                      href={product.href}
                      onClick={close}
                      className="group flex flex-col gap-2"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-noord-wash">
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 16rem, 45vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <span className="text-noord-micro text-noord-ink-muted uppercase">
                        {product.categoryName}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}

function LinkGroup({
  title,
  links,
  onNavigate,
}: {
  title: string
  links: NavLink[]
  onNavigate: () => void
}) {
  return (
    <div>
      <h2 className="mb-3 text-noord-micro text-noord-ink-faint uppercase">
        {title}
      </h2>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className="noord-underline text-noord-lead text-noord-ink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
