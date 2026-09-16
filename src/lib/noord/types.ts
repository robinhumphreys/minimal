/**
 * The shapes Noord's client components receive as props.
 *
 * Server components map `@/lib/catalog` into these and pass them down; nothing
 * on the client reads the catalog directly, because `@/lib/catalog` imports
 * `node:fs`.
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

/** The facets a category page can filter on, and that the nav links into. */
export type FacetKey = "fit" | "fabric" | "colour"

export type NavLink = {
  label: string
  href: string
}

/** One column of links inside a desktop nav panel. */
export type NavColumn = {
  title: string
  links: NavLink[]
}

/** The image card pinned to the right of a desktop nav panel. */
export type NavPromo = {
  image: string
  eyebrow: string
  title: string
  href: string
}

export type NavCategory = NavLink & {
  /** Populated from catalog attributes; empty when a category has no facets. */
  columns: NavColumn[]
  promo?: NavPromo
}

export type NavModel = {
  categories: NavCategory[]
  explore: NavLink[]
  service: NavLink[]
  /** Compact links in the top-left of the desktop header. */
  utility: NavLink[]
  /** Two promo tiles pinned to the bottom of the mobile nav overlay. */
  featured: ProductCardModel[]
}
