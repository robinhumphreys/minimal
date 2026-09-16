"use client"

import Link from "next/link"
import { ArrowRightIcon } from "@phosphor-icons/react/ssr"

import { useOverlays } from "@/lib/volta/overlays"
import type { NavModel } from "@/lib/volta/types"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/volta/ui/accordion"
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
 * Categories are accordions rather than a drill-down stack: with six of them
 * the whole tree fits on one screen, and a stack would cost a tap and an
 * animation for no gain. Never rendered on desktop — `<DesktopNav>` owns that.
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
            <Accordion className="border-t-0">
              {nav.categories.map((category) => (
                <AccordionItem key={category.href} value={category.href}>
                  <AccordionTrigger className="text-volta-title">
                    {category.label}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4">
                    <Link
                      href={category.href}
                      className="volta-wide flex items-center gap-2 text-volta-label text-volta-volt"
                    >
                      All {category.label}
                      <ArrowRightIcon className="size-3.5" />
                    </Link>
                    {category.columns.map((column) => (
                      <div key={column.title} className="flex flex-col gap-2">
                        <h4 className="volta-wide text-volta-micro text-volta-smoke">
                          {column.title}
                        </h4>
                        <ul className="flex flex-wrap gap-x-4 gap-y-2">
                          {column.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                className="text-volta-body text-volta-ash"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

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
