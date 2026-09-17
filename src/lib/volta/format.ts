// `@/lib/catalog` imports `node:fs`, so it's server-only; client formatting
// helpers live here instead.

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100)
}

/** Always one decimal, so star rows do not jitter in width. */
export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

/** Abbreviated past a thousand, since the exact count stops mattering. */
export function formatCount(count: number): string {
  if (count < 1000) return String(count)
  return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
}

/** Reviews are dated to the month, not the day. */
export function formatReviewDate(iso: string): string {
  const [year, month] = iso.split("-")
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(Number(year), Number(month) - 1, 1))
}
