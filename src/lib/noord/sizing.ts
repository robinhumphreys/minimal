/**
 * Size runs per category.
 *
 * The catalog has no size data yet, so these stand in. A product can override
 * them with a comma-separated `sizes` attribute the moment the catalog grows
 * one, without this file changing.
 */

/**
 * The stand-in run for a product that does not come in sizes. Named because
 * it is a value the UI has to recognise, not just another size label.
 */
export const ONE_SIZE = "One size"

const BY_CATEGORY: Record<string, string[]> = {
  suits: ["44", "46", "48", "50", "52", "54", "56"],
  jackets: ["44", "46", "48", "50", "52", "54", "56"],
  shirts: ["XS", "S", "M", "L", "XL", "XXL"],
  knitwear: ["XS", "S", "M", "L", "XL", "XXL"],
  outerwear: ["XS", "S", "M", "L", "XL", "XXL"],
  trousers: ["28", "30", "32", "34", "36", "38"],
  shoes: ["40", "41", "42", "43", "44", "45", "46"],
  accessories: [ONE_SIZE],
}

const FALLBACK = ["S", "M", "L", "XL"]

export function sizesFor(
  category: string,
  attributes: Record<string, string>,
): string[] {
  const declared = attributes.sizes
  if (declared) {
    return declared
      .split(",")
      .map((size) => size.trim())
      .filter(Boolean)
  }
  return BY_CATEGORY[category] ?? FALLBACK
}

/**
 * How a chosen size reads when it is named alongside a product — in the bag,
 * say. A one-size product has no size to state, so it stands on its own rather
 * than coming out as "Size one size".
 */
export function sizeLabel(size: string): string {
  return size === ONE_SIZE ? ONE_SIZE : `Size ${size}`
}

/**
 * Which sizes read as sold out. Deterministic from the slug so the server and
 * client agree, and so a given product looks the same on every visit.
 */
export function soldOutSizes(slug: string, sizes: string[]): string[] {
  if (sizes.length < 4) return []

  // `| 0` keeps this in int32 range; without it long slugs overflow to Infinity
  // and every modulo below becomes NaN.
  const hash = Math.abs(
    [...slug].reduce((acc, char) => ((acc * 31 + char.charCodeAt(0)) | 0), 7),
  )
  // Most products are fully stocked; roughly one in three loses a single size.
  if (hash % 3 !== 0) return []
  return [sizes[hash % sizes.length]]
}
