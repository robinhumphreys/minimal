// One map shared by homepage tiles, banners and nav promos, so a category
// looks the same wherever it turns up.
export const CATEGORY_IMAGE: Record<string, string> = {
  protein: "/volta/editorial/plates-hands.webp",
  "pre-workout": "/volta/editorial/curl-dark.webp",
  recovery: "/volta/editorial/overhead-press.webp",
  hydration: "/volta/editorial/water-hands.webp",
  vitamins: "/volta/editorial/softgels-hand.webp",
  bars: "/volta/editorial/gym-floor.webp",
}

/** Wider crops, for the full-bleed category banners. */
export const CATEGORY_BANNER: Record<string, string> = {
  protein: "/volta/editorial/plates-rack.webp",
  "pre-workout": "/volta/editorial/curl-dark.webp",
  recovery: "/volta/editorial/barbell-hands.webp",
  hydration: "/volta/editorial/hydration-pour.webp",
  vitamins: "/volta/editorial/tablets-green.webp",
  bars: "/volta/editorial/gym-floor.webp",
}

const FALLBACK = "/volta/editorial/gym-floor.webp"

export function categoryImage(slug: string): string {
  return CATEGORY_IMAGE[slug] ?? FALLBACK
}

export function categoryBanner(slug: string): string {
  return CATEGORY_BANNER[slug] ?? FALLBACK
}
