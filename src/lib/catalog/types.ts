export type BrandId = "noord" | "volta"

export const BRAND_IDS: readonly BrandId[] = ["noord", "volta"] as const

export function isBrandId(value: string): value is BrandId {
  return (BRAND_IDS as readonly string[]).includes(value)
}

export type Category = {
  slug: string
  name: string
  description: string
}

export type Product = {
  /** Unique per brand, kebab-case, used in the URL. */
  slug: string
  name: string
  /** Matches a `Category.slug` of the same brand. */
  category: string
  /** Cents, EUR. */
  price: number
  /** Cents, EUR. Shown struck through when present. */
  compareAt?: number
  /** Paths under `/public`. First entry is the primary image. */
  images: string[]
  attributes: Record<string, string>
  description: string
  tags: string[]
  /**
   * Mean customer rating, 0–5, one decimal.
   *
   * Optional because only brands that surface social proof carry it: Noord
   * shows none, Volta shows it on every tile. Always paired with
   * `reviewCount` — a star row with no count behind it is not evidence.
   */
  rating?: number
  reviewCount?: number
}

/** A customer review. Brands that show none simply leave `Catalog.reviews` empty. */
export type Review = {
  /** Unique per brand. */
  id: string
  /** Matches a `Product.slug` of the same brand. */
  product: string
  author: string
  /** 1–5, whole stars. */
  rating: number
  title: string
  body: string
  /** ISO date, `YYYY-MM-DD`. */
  date: string
  /** Bought the product through the shop, rather than reviewing unprompted. */
  verified: boolean
  /** Free-text context under the name, e.g. "Marathon, 3:12". */
  context?: string
}

export type Catalog = {
  id: BrandId
  categories: Category[]
  products: Product[]
  reviews: Review[]
}
