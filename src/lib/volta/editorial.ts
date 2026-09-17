// One map shared by homepage tiles, banners and nav promos, so a category
// looks the same wherever it turns up. Cropped by scripts/volta-imagery.mjs.
export const CATEGORY_IMAGE: Record<string, string> = {
  protein: "/volta/editorial/plates-hands.jpg",
  "pre-workout": "/volta/editorial/curl-dark.jpg",
  recovery: "/volta/editorial/overhead-press.jpg",
  hydration: "/volta/editorial/water-hands.jpg",
  vitamins: "/volta/editorial/softgels-hand.jpg",
  bars: "/volta/editorial/gym-floor.jpg",
}

/** Wider crops, for the full-bleed category banners. */
export const CATEGORY_BANNER: Record<string, string> = {
  protein: "/volta/editorial/plates-rack.jpg",
  "pre-workout": "/volta/editorial/curl-dark.jpg",
  recovery: "/volta/editorial/barbell-hands.jpg",
  hydration: "/volta/editorial/hydration-pour.jpg",
  vitamins: "/volta/editorial/tablets-green.jpg",
  bars: "/volta/editorial/gym-floor.jpg",
}

const FALLBACK = "/volta/editorial/gym-floor.jpg"

export function categoryImage(slug: string): string {
  return CATEGORY_IMAGE[slug] ?? FALLBACK
}

export function categoryBanner(slug: string): string {
  return CATEGORY_BANNER[slug] ?? FALLBACK
}
