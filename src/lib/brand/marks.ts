import type { BrandId } from "@/lib/catalog/types"

/**
 * The merchants' logos, as square app marks.
 *
 * Each brand's storefront sets its name in type — see either brand's
 * `wordmark.tsx` — which is the right mark for a header and the wrong one for
 * a 16px browser tab: wide tracking and a two-word lockup are the first things
 * to go when a mark is shrunk. So each wordmark is compressed here to the one
 * thing that survives it, a single glyph on the brand's own field.
 *
 * Held as markup rather than JSX because the same artwork has to be two
 * things: a React element in the admin (`components/brand/brand-mark.tsx`) and
 * a standalone `.svg` file served by the `icon` routes under `app/noord` and
 * `app/volta`. Rendering the component to a string would be the obvious way to
 * share them, and Next refuses it — `react-dom/server` may not be imported
 * from the app router at all. So the shapes live here, in the one form both
 * consumers can take, and neither brand's mark can drift from the other's use.
 *
 * Colours are hex rather than the `--color-noord-*` / `--color-volta-*` tokens
 * for the same reason: no stylesheet is loaded when a browser fetches a
 * favicon, and a `var()` would resolve to nothing. Each is named below.
 *
 * Both marks paint their field to the edges rather than leaving it to the
 * page, because a favicon sits on whatever colour the tab strip happens to be
 * and a dark browser theme would otherwise swallow Noord's.
 */
export const BRAND_MARK_VIEW_BOX = "0 0 32 32"

const ARTWORK: Record<BrandId, string> = {
  /*
   * Noord's N, cut from the ink the storefront sets its type in.
   *
   * Two-tone because the wordmark is: "Noord" in semibold, "Suits" dropped to
   * a muted grey. The monogram keeps that hierarchy by lightening the last
   * stroke — one letter, still read as two weights. The grey is a step lighter
   * than the wordmark's `ink-muted`, which is mixed for black on white and
   * closes up when the ground is inverted.
   *
   * Drawn as geometry rather than set in Inter: nothing loads a font to render
   * a favicon, and a mark that falls back to Arial is not the brand's.
   *
   * The diagonal's two edges sit one stem width apart vertically, which is
   * what keeps it reading as the same stroke as the uprights rather than a
   * hairline laid across them.
   */
  noord: [
    // --color-noord-ink
    `<rect width="32" height="32" fill="#131313"/>`,
    // Left stem and diagonal.
    `<path d="M7.6 8h3.5l9.8 12.5V24l-9.8-12.5V24H7.6Z" fill="#ffffff"/>`,
    // Right stem, in --color-noord-ink-faint.
    `<rect x="20.9" y="8" width="3.5" height="16" fill="#9a9a9a"/>`,
  ].join(""),

  /*
   * Volta's bolt — the same path the wordmark draws, at app-mark scale.
   *
   * Volt on the field rather than the bolt: the storefront is dark and its
   * bolt is volt, but a near-black square is exactly what disappears into a
   * dark tab strip, and volt does not. It is also what tells the two accounts
   * apart at a glance in the admin, where both marks sit in the same well.
   */
  volta: [
    // --color-volta-volt
    `<rect width="32" height="32" fill="#d7ff00"/>`,
    // Scaled and centred rather than redrawn, so the angles stay the
    // wordmark's. 12x20 at 1.2 is 14.4x24 — four units of field on the short
    // axis, which is what keeps the bolt open once the mark is 16px.
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
 *
 * `xmlns` matters here and only here: a browser fetching this as a file parses
 * it as XML, and without the namespace it renders nothing.
 */
export function brandMarkSvg(brand: BrandId) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${BRAND_MARK_VIEW_BOX}">${ARTWORK[brand]}</svg>`
}
