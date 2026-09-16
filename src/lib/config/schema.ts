import { z } from "zod"

export const brandIdSchema = z.enum(["noord", "volta"])

export const themeSchema = z.object({
  accent: z.string().min(1),
  surface: z.string().min(1),
  radius: z.string().min(1),
  fontBody: z.string().min(1),
  fontDisplay: z.string().min(1),
  density: z.string().min(1),
})

export const behaviourSchema = z.object({
  systemPrompt: z.string().min(1),
  greeting: z.string().min(1),
  starterPrompts: z.array(z.string()),
  model: z.string().min(1),
})

export const entrySchema = z.enum(["launcher", "bar", "recommendations"])
export const positionSchema = z.enum([
  "bottom-right",
  "bottom-center",
  "bottom-left",
])

export const launcherIconSchema = z.enum(["chat", "sparkles", "help"])
export const iconStyleSchema = z.enum(["solid", "outline"])

/**
 * The launcher fields default rather than require so a config published
 * before they existed still parses; the defaults match what the onboarding
 * preview showed before they were configurable.
 */
export const surfaceSchema = z.object({
  entry: entrySchema,
  /** Launcher only. */
  position: positionSchema.optional(),
  /** Launcher only. */
  icon: launcherIconSchema.default("chat"),
  /** Launcher only. Filled or stroked glyph, matching how the site draws its marks. */
  iconStyle: iconStyleSchema.default("solid"),
  /** Launcher only. Empty renders a bare circle. */
  label: z.string().default(""),
  /** Whether the agent takes over the site's own search box. */
  searchAssist: z.boolean().default(true),
})

export const agentConfigSchema = z.object({
  id: brandIdSchema,
  name: z.string().min(1),
  theme: themeSchema,
  behaviour: behaviourSchema,
  surface: surfaceSchema,
})

export type Theme = z.infer<typeof themeSchema>
export type Behaviour = z.infer<typeof behaviourSchema>
export type Surface = z.infer<typeof surfaceSchema>
export type Entry = z.infer<typeof entrySchema>
export type Position = z.infer<typeof positionSchema>
export type LauncherIcon = z.infer<typeof launcherIconSchema>
export type IconStyle = z.infer<typeof iconStyleSchema>
export type AgentConfig = z.infer<typeof agentConfigSchema>
