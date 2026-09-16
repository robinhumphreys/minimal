import type {
  AgentConfig,
  IconStyle,
  LauncherIcon,
  Position,
} from "@/lib/config/schema"

export type Placement = Position
export type { IconStyle, LauncherIcon }

/**
 * Everything the merchant can change about the Site chat surface.
 *
 * Deliberately a flat object rather than the nested `AgentConfig`: these are
 * the knobs one surface exposes, and the options form edits them by name.
 * `settingsFrom` and `applySettings` are the two directions of the same map.
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

export function settingsFrom(config: AgentConfig): SiteChatSettings {
  return {
    greeting: config.behaviour.greeting,
    starters: config.behaviour.starterPrompts,
    placement: config.surface.position ?? "bottom-right",
    icon: config.surface.icon,
    iconStyle: config.surface.iconStyle,
    label: config.surface.label,
    accent: config.theme.accent,
    radius: config.theme.radius,
  }
}

/**
 * Writes the surface's settings back into the draft. Choosing to set up Site
 * chat is choosing the launcher entry: the two are the same decision.
 */
export function applySettings(
  config: AgentConfig,
  settings: SiteChatSettings,
): AgentConfig {
  return {
    ...config,
    theme: {
      ...config.theme,
      accent: settings.accent,
      radius: settings.radius,
    },
    behaviour: {
      ...config.behaviour,
      greeting: settings.greeting,
      starterPrompts: settings.starters,
    },
    surface: {
      ...config.surface,
      entry: "launcher",
      position: settings.placement,
      icon: settings.icon,
      iconStyle: settings.iconStyle,
      label: settings.label,
    },
  }
}
