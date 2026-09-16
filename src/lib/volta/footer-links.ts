/**
 * Footer link inventory.
 *
 * None of these pages exist — this is a demo storefront — so every href points
 * back at a real route. Kept in one place so the footer component stays about
 * layout, and so the list is obvious to swap for real URLs later.
 */

import type { NavLink } from "@/lib/volta/types"

const HOME = "/volta"

export type FooterColumn = {
  title: string
  links: NavLink[]
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Shop",
    links: [
      { label: "Protein", href: `${HOME}/protein` },
      { label: "Pre-workout", href: `${HOME}/pre-workout` },
      { label: "Recovery", href: `${HOME}/recovery` },
      { label: "Hydration", href: `${HOME}/hydration` },
      { label: "Vitamins", href: `${HOME}/vitamins` },
      { label: "Bars", href: `${HOME}/bars` },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Track your order", href: HOME },
      { label: "Delivery & returns", href: HOME },
      { label: "Payment methods", href: HOME },
      { label: "Subscribe & save", href: HOME },
      { label: "Contact us", href: HOME },
      { label: "FAQ", href: HOME },
    ],
  },
  {
    title: "Volta",
    links: [
      { label: "What we test for", href: HOME },
      { label: "Sourcing", href: HOME },
      { label: "Athletes", href: HOME },
      { label: "Gym partners", href: HOME },
      { label: "Careers", href: HOME },
      { label: "Press", href: HOME },
    ],
  },
]

export const LEGAL_LINKS: NavLink[] = [
  { label: "Terms", href: HOME },
  { label: "Privacy", href: HOME },
  { label: "Cookies", href: HOME },
  { label: "Accessibility", href: HOME },
]
