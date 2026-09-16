import type { CSSProperties } from "react"

import { readableOn } from "@/lib/config/contrast"
import type { Theme } from "@/lib/config/schema"

/**
 * The merchant's four theme values, spent as a whole palette.
 *
 * Everything between the surface and the ink is mixed from the two rather than
 * fixed: a white panel and a charcoal one need different greys for a muted
 * bubble or a hairline, and the merchant should not have to know that. The
 * accent is only ever used at full strength, with its own readable foreground.
 */
export function themeStyle(theme: Theme): CSSProperties {
  const dark = readableOn(theme.surface) === "#ffffff"
  const ink = dark ? "#ffffff" : "#131313"
  const mix = (amount: number) =>
    `color-mix(in oklab, ${theme.surface}, ${ink} ${amount}%)`

  return {
    "--background": theme.surface,
    "--foreground": ink,
    "--card": theme.surface,
    "--card-foreground": ink,
    "--popover": theme.surface,
    "--popover-foreground": ink,
    "--primary": theme.accent,
    "--primary-foreground": readableOn(theme.accent),
    "--secondary": mix(dark ? 10 : 5),
    "--secondary-foreground": ink,
    "--muted": mix(dark ? 9 : 4.5),
    "--muted-foreground": mix(dark ? 62 : 55),
    "--accent": mix(dark ? 10 : 5),
    "--accent-foreground": ink,
    "--border": mix(dark ? 15 : 9),
    "--input": mix(dark ? 18 : 12),
    "--ring": theme.accent,
    "--radius": theme.radius,
    "--font-sans": theme.fontBody,
    "--font-display": theme.fontDisplay,
  } as CSSProperties
}
