import type { BrandId } from "@/lib/catalog/types"

/**
 * Kept as markup, not JSX: this artwork is also served as a standalone SVG
 * by the `icon` routes, where Next disallows importing `react-dom/server`.
 * Colours are hex, not the brand's CSS tokens: no stylesheet loads when a
 * browser fetches a favicon, so `var()` would resolve to nothing.
 */
export const BRAND_MARK_VIEW_BOX = "0 0 32 32"

const ARTWORK: Record<BrandId, string> = {
  /**
   * Noord's N, drawn as geometry rather than set in Inter: nothing loads a
   * font to render a favicon.
   */
  noord: [
    // --color-noord-ink
    `<rect width="32" height="32" fill="#131313"/>`,
    `<path d="M7.6 8h3.5l9.8 12.5V24l-9.8-12.5V24H7.6Z" fill="#ffffff"/>`,
    // --color-noord-ink-faint
    `<rect x="20.9" y="8" width="3.5" height="16" fill="#9a9a9a"/>`,
  ].join(""),

  /**
   * Volt fills the field, not the bolt: a near-black square would disappear
   * into a dark browser tab strip, and volt does not.
   */
  volta: [
    // --color-volta-volt
    `<rect width="32" height="32" fill="#d7ff00"/>`,
    // Scaled and centred, not redrawn, so the angles match the wordmark's.
    `<g transform="translate(8.8 4) scale(1.2)">`,
    // --color-volta-void
    `<path d="M7.4 0 0 11.6h4.2L3.1 20 12 7.6H7.1L7.4 0Z" fill="#212121"/>`,
    `</g>`,
  ].join(""),
}

/** The shapes inside the mark's viewBox, without the `<svg>` around them. */
export function brandMarkArtwork(brand: BrandId) {
  return ARTWORK[brand]
}

/**
 * The mark as a complete SVG document, for the `icon` routes to serve.
 * `xmlns` is required: fetched as a file, this is parsed as XML.
 */
export function brandMarkSvg(brand: BrandId) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${BRAND_MARK_VIEW_BOX}">${ARTWORK[brand]}</svg>`
}
