// The catalog records one flavour per SKU, so the rest of the picker's row is
// demo data kept here, client-safe since the picker cannot reach the catalog.

/**
 * Plausible siblings by `attributes.form`, so a shopper switching flavour on
 * a bar is not offered "Unflavoured".
 */
const PALETTE: Record<string, string[]> = {
  Powder: [
    "Vanilla",
    "Chocolate",
    "Strawberry",
    "Cookies & Cream",
    "Banana",
    "Unflavoured",
  ],
  "Ready-to-Drink": [
    "Iced Coffee",
    "Vanilla",
    "Chocolate",
    "Strawberry",
    "Tropical Fruit",
  ],
  Bar: [
    "Chocolate Peanut",
    "Salted Caramel",
    "Cookies & Cream",
    "Hazelnut",
    "Raspberry",
  ],
  Wafer: ["Chocolate", "Vanilla", "Hazelnut"],
  Chocolate: ["Milk", "Salted Caramel Almond", "Biscuit"],
  Sachets: ["Fruit Punch", "Lemon", "Berry", "Unflavoured"],
  "Effervescent Tablets": ["Lemon", "Orange", "Berry", "Cola"],
  "Chewable Tablets": ["Orange", "Lemon", "Blackcurrant"],
}

/** Forms with no meaningful flavour, capsules taste of nothing. */
const UNFLAVOURED_FORMS = new Set(["Capsules", "Softgels", "Tablets"])

/**
 * Options with the product's own flavour first; a single entry (capsules and
 * the like) reads as "nothing to choose" and the picker hides itself.
 */
export function flavourOptions(
  form: string | undefined,
  flavour: string | undefined,
): string[] {
  const own = flavour ?? "Unflavoured"
  if (!form || UNFLAVOURED_FORMS.has(form)) return [own]

  const palette = PALETTE[form]
  if (!palette) return [own]

  // Case-insensitive so "Chocolate" from the catalog does not appear twice
  // alongside a palette entry that differs only in casing.
  const seen = new Set([own.toLowerCase()])
  const rest = palette.filter((option) => {
    const key = option.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return [own, ...rest].slice(0, 5)
}
