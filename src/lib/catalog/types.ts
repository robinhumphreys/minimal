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
}

export type Catalog = {
  id: BrandId
  categories: Category[]
  products: Product[]
}
