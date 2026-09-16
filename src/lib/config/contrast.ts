/**
 * Picks black or white for text sitting on `background`.
 *
 * A merchant's accent is whatever their brand is — Noord's near-black and
 * Volta's highlighter yellow both end up behind a label, and one of them
 * cannot carry white. Relative luminance per WCAG, thresholded where the two
 * contrast ratios cross.
 */
export function readableOn(background: string): "#ffffff" | "#131313" {
  const hex = background.trim().replace("#", "")
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((character) => character + character)
          .join("")
      : hex

  if (full.length !== 6) return "#ffffff"

  const channel = (offset: number) => {
    const value = parseInt(full.slice(offset, offset + 2), 16) / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  }

  const luminance =
    0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4)

  return luminance > 0.36 ? "#131313" : "#ffffff"
}
