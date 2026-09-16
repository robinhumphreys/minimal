import type { BrandId } from "@/lib/catalog/types"
import type { AgentConfig } from "@/lib/config/schema"

export type Placement = "bottom-right" | "bottom-center" | "bottom-left"
export type LauncherIcon = "chat" | "sparkles" | "help"
export type IconStyle = "solid" | "outline"

/**
 * Everything the merchant can change about the Site chat surface.
 *
 * Deliberately a flat object rather than the nested `AgentConfig`: these are
 * the knobs one surface exposes, and the chat on the right edits them by name.
 * Reconciling them back into the published config is a later problem.
 */
export type SiteChatSettings = {
  greeting: string
  starters: string[]
  placement: Placement
  icon: LauncherIcon
  iconStyle: IconStyle
  /** Empty renders the launcher as a bare circle. */
  label: string
  accent: string
  radius: string
}

export const PLACEMENTS: { value: Placement; label: string }[] = [
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-center", label: "Bottom centre" },
  { value: "bottom-right", label: "Bottom right" },
]

export const ICON_STYLES: { value: IconStyle; label: string }[] = [
  { value: "solid", label: "Solid" },
  { value: "outline", label: "Outline" },
]

export const LAUNCHER_ICONS: { value: LauncherIcon; label: string }[] = [
  { value: "chat", label: "Chat" },
  { value: "sparkles", label: "Sparkle" },
  { value: "help", label: "Question" },
]

/**
 * How each brand draws its marks. Noord's storefront is hairlines and thin
 * rules; Volta's is filled blocks of volt. The launcher follows whichever the
 * site already does rather than picking one for both.
 */
const ICON_STYLE_BY_BRAND: Record<BrandId, IconStyle> = {
  noord: "outline",
  volta: "solid",
}

/**
 * Seeds the surface from what onboarding said it had matched off the site, so
 * the merchant lands on something already theirs rather than on defaults.
 */
export function settingsFrom(config: AgentConfig): SiteChatSettings {
  return {
    greeting: config.behaviour.greeting,
    starters: config.behaviour.starterPrompts,
    placement: config.surface.position ?? "bottom-right",
    icon: "chat",
    iconStyle: ICON_STYLE_BY_BRAND[config.id],
    label: "",
    accent: config.theme.accent,
    radius: config.theme.radius,
  }
}
