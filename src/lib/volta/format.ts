/**
 * Client-safe formatting helpers.
 *
 * `@/lib/catalog` imports `node:fs` to validate image paths, so it can only be
 * reached from server components. Anything a Volta client component needs to
 * format lives here instead.
 */

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100)
}

/** "4.8" — always one decimal, so star rows do not jitter in width. */
export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

/** "3.4k" past a thousand: the exact count stops mattering at that size. */
export function formatCount(count: number): string {
  if (count < 1000) return String(count)
  return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
}

/** Whole percent saved, for the "-30%" badge. Returns 0 when there is no saving. */
export function discountPercent(price: number, compareAt?: number): number {
  if (!compareAt || compareAt <= price) return 0
  return Math.round(((compareAt - price) / compareAt) * 100)
}

/** "August 2026" — reviews are dated to the month, not the day. */
export function formatReviewDate(iso: string): string {
  const [year, month] = iso.split("-")
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(Number(year), Number(month) - 1, 1))
}
