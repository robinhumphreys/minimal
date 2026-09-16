"use client"

import Link from "next/link"
import { ArrowRightIcon } from "@phosphor-icons/react/ssr"

import { useOverlays } from "@/lib/volta/overlays"
import type { NavModel } from "@/lib/volta/types"

import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/volta/ui/sheet"

import { ProductCard } from "./product-card"
import { Wordmark } from "./wordmark"

/**
 * The phone site navigation, behind the hamburger.
 *
 * Categories are a flat list: each one's page carries its own filters, so
 * there is nothing to expand here. Never rendered on desktop — `<DesktopNav>`
 * owns that.
 */
export function NavOverlay({ nav }: { nav: NavModel }) {
  const open = useOverlays((state) => state.open)
  const toggle = useOverlays((state) => state.toggle)

  return (
    <Sheet
      open={open === "nav"}
      onOpenChange={(next) => toggle("nav", next)}
      modal
    >
      <SheetContent side="left" className="lg:hidden">
        <SheetHeader>
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Wordmark className="text-lg" />
        </SheetHeader>

        <SheetBody>
          <div className="volta-gutter pb-10">
            <ul className="flex flex-col">
              {nav.categories.map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className="flex items-center justify-between border-b border-volta-line py-4 text-volta-title text-volta-chalk"
                  >
                    {category.label}
                    <ArrowRightIcon className="size-4 text-volta-smoke" />
                  </Link>
                </li>
              ))}
            </ul>

            <Section title="Shop by goal">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                {nav.goals.map((goal) => (
                  <li key={goal.href}>
                    <Link
                      href={goal.href}
                      className="volta-wide text-volta-label text-volta-chalk"
                    >
                      {goal.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Help">
              <ul className="flex flex-col gap-3">
                {nav.service.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-volta-body text-volta-ash"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Top rated">
              {/*
                The drawer is dark but tiles are drawn for white, so the promos
                get their own slab of it — the same rule as the page shelves.
              */}
              <div className="grid grid-cols-2 gap-4 rounded-volta bg-volta-chalk p-4">
                {nav.featured.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    sizes="45vw"
                  />
                ))}
              </div>
            </Section>
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 border-b border-volta-line py-7 last:border-b-0">
      <h3 className="volta-wide text-volta-micro text-volta-smoke">{title}</h3>
      {children}
    </section>
  )
}
