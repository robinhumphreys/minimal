/**
 * `@/lib/catalog` imports `node:fs`, so it's server-only; anything a client
 * component needs to format lives here instead.
 */

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    // Noord prices are whole euros; trailing ",00" is noise at this size.
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}
