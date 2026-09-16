/**
 * The shapes Volta's client components receive as props.
 *
 * Server components map `@/lib/catalog` into these and pass them down; nothing
 * on the client reads the catalog directly, because `@/lib/catalog` imports
 * `node:fs`.
 */

/** Everything a product tile needs, including the social proof Volta always shows. */
export type ProductCardModel = {
  slug: string
  name: string
  href: string
  image: string
  /** Cents, EUR. */
  price: number
  /** 0–5, one decimal. Undefined means the tile shows no star row. */
  rating?: number
  reviewCount?: number
  categoryName: string
  /** From `attributes.flavour`, shown under the name where it exists. */
  flavour?: string
  /** From `attributes.size`, e.g. "1000 g". */
  size?: string
}

/** A card plus the fields the search and filter UIs match against. */
export type SearchEntry = ProductCardModel & {
  category: string
  form?: string
  goal?: string
  tags: string[]
  /** Pre-lowercased haystack, so filtering does no work per keystroke. */
  haystack: string
}

/** The facets a category page can filter on, and that the nav links into. */
export type FacetKey = "form" | "flavour" | "goal"

/** One filter chip on a category page: a value and how many products carry it. */
export type FacetOption = {
  value: string
  count: number
}

export type FacetGroup = {
  key: FacetKey
  label: string
  options: FacetOption[]
}

export type NavLink = {
  label: string
  href: string
}

/** One column of links inside a nav panel. */
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
  /** "Shop by goal" — the entry point most nutrition shoppers actually use. */
  goals: NavLink[]
  service: NavLink[]
  /** Compact links in the top-left of the desktop header. */
  utility: NavLink[]
  /** Promo tiles pinned to the bottom of the mobile nav overlay. */
  featured: ProductCardModel[]
}

/** A review flattened for the client. Same fields, minus the catalog import. */
export type ReviewModel = {
  id: string
  author: string
  rating: number
  title: string
  body: string
  /** ISO date, `YYYY-MM-DD`. */
  date: string
  verified: boolean
  context?: string
  /** The product it is about. Set on homepage testimonials, omitted on a PDP. */
  productName?: string
  productHref?: string
}

/** How many reviews sit at each star level, for the PDP histogram. */
export type RatingBreakdown = {
  stars: number
  count: number
  /** 0–100, of the product's total review count. */
  percent: number
}
