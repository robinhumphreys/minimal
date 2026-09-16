import type {
  AgentConfig,
  Avatar,
  Density,
  FontChoice,
  HeaderStyle,
  IconStyle,
  ImageRatio,
  LauncherIcon,
  LauncherShape,
  LauncherSize,
  Position,
  Roundness,
  Spelling,
  ThinkingStyle,
  Voice,
} from "@/lib/config/schema"

export type Placement = Position
export type { IconStyle, LauncherIcon }

/**
 * Everything the merchant can change about their agent, flat.
 *
 * Deliberately a flat object rather than the nested `AgentConfig`: these are
 * the knobs the studio exposes, the options form edits them by name and the
 * customise chat patches them by name. `settingsFrom` and `applySettings`
 * are the two directions of the same map.
 */
export type SiteChatSettings = {
  // What it says
  greeting: string
  starters: string[]
  assistantName: string
  subtitle: string
  avatar: Avatar
  voice: Voice
  spelling: Spelling
  language: string
  // The launcher
  placement: Placement
  shape: LauncherShape
  size: LauncherSize
  icon: LauncherIcon
  iconStyle: IconStyle
  /** Empty renders the launcher without text. */
  label: string
  // The window
  accent: string
  roundness: Roundness
  font: FontChoice
  header: HeaderStyle
  thinking: ThinkingStyle
  density: Density
  // Cards
  ratio: ImageRatio
  price: boolean
  rating: boolean
  picks: number
  // When it appears
  nudge: number
  openOnProductPages: boolean
  hiddenPaths: string[]
  searchAssist: boolean
}

type Option<T extends string> = { value: T; label: string }

export const PLACEMENTS: Option<Placement>[] = [
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-center", label: "Bottom centre" },
  { value: "bottom-right", label: "Bottom right" },
]
export const SHAPES: Option<LauncherShape>[] = [
  { value: "circle", label: "Circle" },
  { value: "square", label: "Square" },
  { value: "pill", label: "Pill" },
]
export const SIZES: Option<LauncherSize>[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
]
export const ICON_STYLES: Option<IconStyle>[] = [
  { value: "solid", label: "Solid" },
  { value: "outline", label: "Outline" },
]
export const LAUNCHER_ICONS: Option<LauncherIcon>[] = [
  { value: "chat", label: "Chat" },
  { value: "sparkles", label: "Sparkle" },
  { value: "help", label: "Question" },
]
export const ROUNDNESS: Option<Roundness>[] = [
  { value: "square", label: "Square" },
  { value: "soft", label: "Soft" },
  { value: "round", label: "Round" },
]
export const FONTS: Option<FontChoice>[] = [
  { value: "site", label: "Site font" },
  { value: "inter", label: "Inter" },
  { value: "geist", label: "Geist" },
  { value: "system", label: "System" },
  { value: "serif", label: "Serif" },
]
export const HEADERS: Option<HeaderStyle>[] = [
  { value: "accent", label: "Accent" },
  { value: "plain", label: "Plain" },
]
export const THINKING: Option<ThinkingStyle>[] = [
  { value: "dots", label: "Dots" },
  { value: "ring", label: "Ring" },
  { value: "text", label: "Text" },
]
export const DENSITIES: Option<Density>[] = [
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
]
export const RATIOS: Option<ImageRatio>[] = [
  { value: "portrait", label: "Portrait" },
  { value: "square", label: "Square" },
]
export const AVATARS: Option<Avatar>[] = [
  { value: "initial", label: "Initial" },
  { value: "mark", label: "Your mark" },
]
export const VOICES: Option<Voice>[] = [
  { value: "warm", label: "Warm" },
  { value: "direct", label: "Direct" },
  { value: "playful", label: "Playful" },
]
export const SPELLINGS: Option<Spelling>[] = [
  { value: "british", label: "British" },
  { value: "american", label: "American" },
]

export function settingsFrom(config: AgentConfig): SiteChatSettings {
  return {
    greeting: config.behaviour.greeting,
    starters: config.behaviour.starterPrompts,
    assistantName: config.identity.assistantName,
    subtitle: config.identity.subtitle,
    avatar: config.identity.avatar,
    voice: config.behaviour.voice,
    spelling: config.behaviour.spelling,
    language: config.behaviour.language,
    placement: config.surface.position ?? "bottom-right",
    shape: config.surface.shape,
    size: config.surface.size,
    icon: config.surface.icon,
    iconStyle: config.surface.iconStyle,
    label: config.surface.label,
    accent: config.theme.accent,
    roundness: config.theme.roundness,
    font: config.theme.font,
    header: config.theme.header,
    thinking: config.theme.thinking,
    density: config.theme.density,
    ratio: config.surface.cards.ratio,
    price: config.surface.cards.price,
    rating: config.surface.cards.rating,
    picks: config.behaviour.picks,
    nudge: config.surface.nudge,
    openOnProductPages: config.surface.openOnProductPages,
    hiddenPaths: config.surface.hiddenPaths,
    searchAssist: config.surface.searchAssist,
  }
}

/**
 * Writes the settings back into the draft. Choosing to set up Site chat is
 * choosing the launcher entry: the two are the same decision.
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
      roundness: settings.roundness,
      font: settings.font,
      header: settings.header,
      thinking: settings.thinking,
      density: settings.density,
    },
    behaviour: {
      ...config.behaviour,
      greeting: settings.greeting,
      starterPrompts: settings.starters,
      voice: settings.voice,
      spelling: settings.spelling,
      language: settings.language,
      picks: settings.picks,
    },
    surface: {
      ...config.surface,
      entry: "launcher",
      position: settings.placement,
      shape: settings.shape,
      size: settings.size,
      icon: settings.icon,
      iconStyle: settings.iconStyle,
      label: settings.label,
      cards: {
        ratio: settings.ratio,
        price: settings.price,
        rating: settings.rating,
      },
      nudge: settings.nudge,
      openOnProductPages: settings.openOnProductPages,
      hiddenPaths: settings.hiddenPaths,
      searchAssist: settings.searchAssist,
    },
    identity: {
      assistantName: settings.assistantName,
      subtitle: settings.subtitle,
      avatar: settings.avatar,
    },
  }
}
