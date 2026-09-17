/**
 * Server components map `@/lib/catalog` into these and pass them down; the
 * client never reads the catalog directly since it imports `node:fs`.
 */

/** Everything a product tile needs. */
export type ProductCardModel = {
  slug: string
  name: string
  href: string
  image: string
  /** Cents, EUR. */
  price: number
  /** Cents, EUR. Shown struck through when present. */
  compareAt?: number
  colour?: string
  categoryName: string
}

/** A card plus the fields the search and filter UIs match against. */
export type SearchEntry = ProductCardModel & {
  category: string
  fit?: string
  fabric?: string
  tags: string[]
  /** Pre-lowercased haystack, so filtering does no work per keystroke. */
  haystack: string
}

/** The facets a category page can filter on, and that collections link into. */
export type FacetKey = "fit" | "fabric" | "colour"

export type NavLink = {
  label: string
  href: string
}

export type NavCategory = NavLink

export type NavModel = {
  /** Desktop category bar, and the search overlay's category matches. */
  categories: NavCategory[]
  /** The large type in the mobile menu: new arrivals, then the categories. */
  menu: NavLink[]
  /** The smaller group below it: service, not merchandise. */
  secondary: NavLink[]
  /** Compact links in the top-left of the desktop header. */
  utility: NavLink[]
}
