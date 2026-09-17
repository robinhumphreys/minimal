import type { CSSProperties } from "react"

import { readableOn } from "@/lib/config/contrast"
import type { Theme } from "@/lib/config/schema"

const RADIUS: Record<Theme["roundness"], string> = {
  square: "0px",
  soft: "0.5rem",
  round: "1rem",
}

/** Falls back to the named face if the root layout's font variables are absent. */
const FONTS: Record<Exclude<Theme["font"], "site">, string> = {
  inter:
    'var(--font-noord-sans), Inter, "Helvetica Neue", Helvetica, Arial, sans-serif',
  geist:
    'var(--font-geist-sans), Geist, "Helvetica Neue", Helvetica, Arial, sans-serif',
  system: "system-ui, -apple-system, sans-serif",
  serif: 'Georgia, "Times New Roman", Times, serif',
}

export function radiusOf(theme: Theme): string {
  return RADIUS[theme.roundness]
}

/** Everything between surface and ink is mixed from the two, not fixed, since a light and a dark surface need different greys. */
export function themeStyle(theme: Theme): CSSProperties {
  const dark = readableOn(theme.surface) === "#ffffff"
  const ink = dark ? "#ffffff" : "#131313"
  const mix = (amount: number) =>
    `color-mix(in oklab, ${theme.surface}, ${ink} ${amount}%)`
  const body = theme.font === "site" ? theme.fontBody : FONTS[theme.font]
  const display = theme.font === "site" ? theme.fontDisplay : body

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
    "--radius": radiusOf(theme),
    "--font-sans": body,
    "--font-display": display,
    "--minimal-gap": theme.density === "compact" ? "0.75rem" : "1rem",
    "--card-spacing": theme.density === "compact" ? "0.625rem" : "0.875rem",
  } as CSSProperties
}
