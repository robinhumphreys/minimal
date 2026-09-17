// Server-only: reads `@/lib/catalog`, which touches `node:fs`.
import {
  getCatalog,
  getCategory,
  getProduct,
  getProductsInCategory,
  getReviews,
  type Product,
  type Review,
} from "@/lib/catalog"

import type {
  FacetGroup,
  FacetKey,
  NavModel,
  ProductCardModel,
  RatingBreakdown,
  ReviewModel,
  SearchEntry,
} from "@/lib/volta/types"

const BRAND = "volta" as const

export function productHref(slug: string) {
  return `/${BRAND}/product/${slug}`
}

export function categoryHref(slug: string) {
  return `/${BRAND}/${slug}`
}

/** A category page pre-filtered to one facet value, the target of nav links. */
export function facetHref(category: string, facet: FacetKey, value: string) {
  return `${categoryHref(category)}?${facet}=${encodeURIComponent(value)}`
}

// Goals cut across categories, so each is a tag query, not a category page.
export const GOALS: { label: string; tag: string }[] = [
  { label: "Build muscle", tag: "protein" },
  { label: "Train harder", tag: "pre-workout" },
  { label: "Recover faster", tag: "post-workout" },
  { label: "Go longer", tag: "endurance" },
  { label: "Stay hydrated", tag: "hydration" },
  { label: "Everyday health", tag: "vitamins" },
]

export function goalHref(tag: string) {
  return `/${BRAND}?goal=${encodeURIComponent(tag)}`
}

export function toCard(product: Product): ProductCardModel {
  const category = getCategory(BRAND, product.category)
  return {
    slug: product.slug,
    name: product.name,
    href: productHref(product.slug),
    image: product.images[0],
    price: product.price,
    rating: product.rating,
    reviewCount: product.reviewCount,
    categoryName: category?.name ?? product.category,
    flavour: product.attributes.flavour,
    size: product.attributes.size,
  }
}

export function toSearchEntry(product: Product): SearchEntry {
  const card = toCard(product)
  return {
    ...card,
    category: product.category,
    form: product.attributes.form,
    goal: GOALS.find((goal) => product.tags.includes(goal.tag))?.label,
    tags: product.tags,
    haystack: [
      product.name,
      card.categoryName,
      ...Object.values(product.attributes),
      ...product.tags,
    ]
      .join(" ")
      .toLowerCase(),
  }
}

export function searchIndex(): SearchEntry[] {
  return getCatalog(BRAND).products.map(toSearchEntry)
}

const FACET_LABELS: Record<FacetKey, string> = {
  form: "Form",
  flavour: "Flavour",
  goal: "Goal",
}

/** The attribute a facet reads. `goal` is derived, so it has no attribute. */
function facetValue(product: Product, facet: FacetKey): string | undefined {
  if (facet === "goal") {
    return GOALS.find((goal) => product.tags.includes(goal.tag))?.label
  }
  return product.attributes[facet]
}

/** Distinct values of one facet across a set of products, most common first. */
function facetOptions(products: Product[], facet: FacetKey, limit: number) {
  const counts = new Map<string, number>()
  for (const product of products) {
    const value = facetValue(product, facet)
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }))
}

/** The filter chips a category page offers. Facets with one value are dropped. */
export function facetGroups(categorySlug: string): FacetGroup[] {
  const products = getProductsInCategory(BRAND, categorySlug)

  return (
    (["form", "goal", "flavour"] as FacetKey[])
      .map((key) => ({
        key,
        label: FACET_LABELS[key],
        options: facetOptions(products, key, 8),
      }))
      // A row offering a single choice is not a choice.
      .filter((group) => group.options.length > 1)
  )
}

export function filterProducts(
  categorySlug: string,
  filters: Partial<Record<FacetKey, string>>,
): ProductCardModel[] {
  return getProductsInCategory(BRAND, categorySlug)
    .filter((product) =>
      (Object.entries(filters) as [FacetKey, string][]).every(
        ([key, value]) => !value || facetValue(product, key) === value,
      ),
    )
    .map(toCard)
}

// Editorial links the catalog does not model; they point at real category
// pages so nothing in the demo dead-ends.
const SERVICE = [
  { label: "Track your order", href: `/${BRAND}` },
  { label: "Delivery & returns", href: `/${BRAND}` },
  { label: "Subscribe & save", href: `/${BRAND}` },
  { label: "Batch test results", href: `/${BRAND}` },
  { label: "Contact us", href: `/${BRAND}` },
]

export function navModel(): NavModel {
  const catalog = getCatalog(BRAND)

  const categories = catalog.categories.map((category) => ({
    label: category.name,
    href: categoryHref(category.slug),
  }))

  return {
    categories,
    goals: GOALS.map((goal) => ({
      label: goal.label,
      href: goalHref(goal.tag),
    })),
    service: SERVICE,
    featured: topRated(2),
  }
}

/** Highest rated first, ties broken by review count. The homepage rails use this. */
export function topRated(count: number, categorySlug?: string) {
  const products = categorySlug
    ? getProductsInCategory(BRAND, categorySlug)
    : getCatalog(BRAND).products

  return [...products]
    .sort(
      (a, b) =>
        (b.rating ?? 0) - (a.rating ?? 0) ||
        (b.reviewCount ?? 0) - (a.reviewCount ?? 0),
    )
    .slice(0, count)
    .map(toCard)
}

/** Most reviewed first, "what everyone is buying" rather than "what scores best". */
export function bestSellers(count: number) {
  return [...getCatalog(BRAND).products]
    .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    .slice(0, count)
    .map(toCard)
}

/** Products carrying a goal's tag, across every category. */
export function productsForGoal(tag: string, count: number) {
  return getCatalog(BRAND)
    .products.filter((product) => product.tags.includes(tag))
    .slice(0, count)
    .map(toCard)
}

/** Products from the same category, excluding the one being viewed. */
export function relatedProducts(product: Product, count: number) {
  return getProductsInCategory(BRAND, product.category)
    .filter((candidate) => candidate.slug !== product.slug)
    .slice(0, count)
    .map(toCard)
}

// The best-selling product of every other category, so a protein shopper is
// cross-sold a shaker-adjacent SKU, not another whey.
export function crossSell(product: Product, count: number) {
  return getCatalog(BRAND)
    .categories.filter((category) => category.slug !== product.category)
    .map((category) => topRated(1, category.slug)[0])
    .filter((card): card is ProductCardModel => card !== undefined)
    .slice(0, count)
}

function toReviewModel(review: Review, withProduct: boolean): ReviewModel {
  const product = withProduct ? getProduct(BRAND, review.product) : undefined
  return {
    id: review.id,
    author: review.author,
    rating: review.rating,
    title: review.title,
    body: review.body,
    date: review.date,
    verified: review.verified,
    context: review.context,
    productName: product?.name,
    productHref: product ? productHref(product.slug) : undefined,
  }
}

/** Newest first. The PDP shows these under the buy block. */
export function productReviews(slug: string, count?: number): ReviewModel[] {
  const reviews = getReviews(BRAND, slug)
  return (count ? reviews.slice(0, count) : reviews).map((review) =>
    toReviewModel(review, false),
  )
}

/**
 * One five-star review per product; repeating the same whey proves less than
 * showing different products.
 */
export function testimonials(count: number): ReviewModel[] {
  const seen = new Set<string>()
  const picked: Review[] = []

  for (const review of getReviews(BRAND)) {
    if (review.rating < 5 || seen.has(review.product)) continue
    seen.add(review.product)
    picked.push(review)
    if (picked.length === count) break
  }

  return picked.map((review) => toReviewModel(review, true))
}

/**
 * The catalog stores only a mean and total, not per-star counts, so this
 * reconstructs an approximate spread that sums back to the total.
 */
export function ratingBreakdown(
  rating: number,
  total: number,
): RatingBreakdown[] {
  // Mass falls off with distance from the mean, faster on the low side so the
  // long tail of 1-star reviews stays thin.
  const weights = [5, 4, 3, 2, 1].map((stars) => {
    const distance = Math.abs(stars - rating)
    return Math.exp(-distance * (stars < rating ? 2.2 : 1.4))
  })

  const sum = weights.reduce((a, b) => a + b, 0)
  const counts = weights.map((weight) => Math.round((weight / sum) * total))

  // Rounding drifts; put the difference on the largest bucket.
  const drift = total - counts.reduce((a, b) => a + b, 0)
  const largest = counts.indexOf(Math.max(...counts))
  counts[largest] += drift

  return [5, 4, 3, 2, 1].map((stars, index) => ({
    stars,
    count: counts[index],
    percent: total === 0 ? 0 : Math.round((counts[index] / total) * 100),
  }))
}
