/**
 * Footer link inventory.
 *
 * None of these pages exist — this is a demo storefront — so every href points
 * back at a real route. Kept in one place so the footer component stays about
 * layout, and so the list is obvious to swap for real URLs later.
 */

import type { NavLink } from "@/lib/noord/types"

const HOME = "/noord"

export type FooterColumn = {
  title: string
  links: NavLink[]
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Customer service",
    links: [
      { label: "Contact us", href: HOME },
      { label: "Track your order", href: HOME },
      { label: "Shipping", href: HOME },
      { label: "Returns & exchanges", href: HOME },
      { label: "Payment methods", href: HOME },
      { label: "Size guide", href: HOME },
      { label: "FAQ", href: HOME },
    ],
  },
  {
    title: "Service & fit",
    links: [
      { label: "Book an appointment", href: HOME },
      { label: "Free alterations", href: HOME },
      { label: "Made to measure", href: HOME },
      { label: "The house fits", href: "/noord/jackets" },
      { label: "Fabric library", href: "/noord/suits" },
      { label: "Care & repair", href: HOME },
    ],
  },
  {
    title: "About Noord Suits",
    links: [
      { label: "Our story", href: HOME },
      { label: "Craftsmanship", href: HOME },
      { label: "Sustainability", href: HOME },
      { label: "Stores", href: HOME },
      { label: "Careers", href: HOME },
      { label: "Press", href: HOME },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "Suits", href: "/noord/suits" },
      { label: "Jackets", href: "/noord/jackets" },
      { label: "Shirts", href: "/noord/shirts" },
      { label: "Trousers", href: "/noord/trousers" },
      { label: "Knitwear", href: "/noord/knitwear" },
      { label: "Outerwear", href: "/noord/outerwear" },
      { label: "Shoes", href: "/noord/shoes" },
      { label: "Accessories", href: "/noord/accessories" },
    ],
  },
]

export const FOOTER_LEGAL: NavLink[] = [
  { label: "Terms & conditions", href: HOME },
  { label: "Privacy policy", href: HOME },
  { label: "Cookie settings", href: HOME },
  { label: "Accessibility", href: HOME },
]
