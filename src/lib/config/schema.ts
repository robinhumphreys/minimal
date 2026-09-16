import { z } from "zod"

export const brandIdSchema = z.enum(["noord", "volta"])

/*
 * Every knob is a choice, not a value. A merchant picks "square" or "round",
 * never a CSS length; "accent" or "plain", never a foreground colour. Choices
 * can be made to look right under any brand's surface; free values cannot.
 */

export const roundnessSchema = z.enum(["square", "soft", "round"])
export const fontChoiceSchema = z.enum([
  "site",
  "inter",
  "geist",
  "system",
  "serif",
])
export const headerStyleSchema = z.enum(["accent", "plain"])
export const thinkingStyleSchema = z.enum(["dots", "ring", "text"])
export const densitySchema = z.enum(["comfortable", "compact"])

export const themeSchema = z.object({
  accent: z.string().min(1),
  surface: z.string().min(1),
  roundness: roundnessSchema.default("soft"),
  /** `site` is whatever was matched off the merchant's own pages. */
  font: fontChoiceSchema.default("site"),
  /** The site's faces, as matched. Only read when `font` is `site`. */
  fontBody: z.string().min(1),
  fontDisplay: z.string().min(1),
  header: headerStyleSchema.default("accent"),
  thinking: thinkingStyleSchema.default("dots"),
  density: densitySchema.default("comfortable"),
})

export const voiceSchema = z.enum(["warm", "direct", "playful"])
export const spellingSchema = z.enum(["british", "american"])

export const behaviourSchema = z.object({
  systemPrompt: z.string().min(1),
  greeting: z.string().min(1),
  starterPrompts: z.array(z.string()),
  model: z.string().min(1),
  voice: voiceSchema.default("warm"),
  spelling: spellingSchema.default("british"),
  /** The language the agent falls back to when the shopper's is unclear. */
  language: z.string().min(1).default("English"),
  /** How many products a recommendation puts on the screen at most. */
  picks: z.number().int().min(2).max(4).default(3),
})

/** `none` is the site chat switched off; the other surfaces have their own flags. */
export const entrySchema = z.enum([
  "launcher",
  "bar",
  "recommendations",
  "none",
])
export const positionSchema = z.enum([
  "bottom-right",
  "bottom-center",
  "bottom-left",
])
export const launcherIconSchema = z.enum(["chat", "sparkles", "help"])
export const iconStyleSchema = z.enum(["solid", "outline"])
export const launcherShapeSchema = z.enum(["circle", "square", "pill"])
export const launcherSizeSchema = z.enum(["sm", "md", "lg"])
export const imageRatioSchema = z.enum(["portrait", "square"])

/**
 * Product help: a guided choice ("keuzehulp") opened from a trigger the
 * merchant places on a page. The agent asks one question at a time with
 * answers to tap, and ends on a product.
 */
export const productHelpSchema = z.object({
  enabled: z.boolean().default(false),
  /** Text on the trigger the embed draws into `minimal-agent-guide`. */
  label: z.string().min(1).default("Help me choose"),
  /** The guide's first line, before its first question. */
  greeting: z
    .string()
    .min(1)
    .default("Hi! A few quick questions and I will find you the right one."),
})

export const cardsSchema = z.object({
  /** How the catalogue is shot: tall for clothes, square for products. */
  ratio: imageRatioSchema.default("portrait"),
  price: z.boolean().default(true),
  rating: z.boolean().default(true),
})

/**
 * The launcher fields default rather than require so a config published
 * before they existed still parses.
 */
export const surfaceSchema = z.object({
  entry: entrySchema,
  /** Launcher only. */
  position: positionSchema.optional(),
  icon: launcherIconSchema.default("chat"),
  /** Filled or stroked glyph, matching how the site draws its marks. */
  iconStyle: iconStyleSchema.default("solid"),
  /** Empty renders the launcher without text. */
  label: z.string().default(""),
  shape: launcherShapeSchema.default("circle"),
  size: launcherSizeSchema.default("md"),
  cards: cardsSchema.default({ ratio: "portrait", price: true, rating: true }),
  /** Seconds before the greeting pops up beside a closed launcher. 0 is never. */
  nudge: z.number().int().min(0).max(120).default(0),
  openOnProductPages: z.boolean().default(false),
  /** Path prefixes the launcher stays off, e.g. `/checkout`. */
  hiddenPaths: z.array(z.string().min(1)).default([]),
  /** Whether the agent takes over the site's own search box. */
  searchAssist: z.boolean().default(true),
  productHelp: productHelpSchema.default({
    enabled: false,
    label: "Help me choose",
    greeting: "Hi! A few quick questions and I will find you the right one.",
  }),
})

export const avatarSchema = z.enum(["initial", "mark"])

export const identitySchema = z.object({
  /** Empty falls back to the brand's name. */
  assistantName: z.string().default(""),
  subtitle: z.string().default("Shopping assistant"),
  avatar: avatarSchema.default("initial"),
})

export const agentConfigSchema = z.object({
  id: brandIdSchema,
  name: z.string().min(1),
  theme: themeSchema,
  behaviour: behaviourSchema,
  surface: surfaceSchema,
  identity: identitySchema.default({
    assistantName: "",
    subtitle: "Shopping assistant",
    avatar: "initial",
  }),
})

export type Theme = z.infer<typeof themeSchema>
export type Behaviour = z.infer<typeof behaviourSchema>
export type Surface = z.infer<typeof surfaceSchema>
export type Cards = z.infer<typeof cardsSchema>
export type Identity = z.infer<typeof identitySchema>
export type ProductHelp = z.infer<typeof productHelpSchema>
export type Entry = z.infer<typeof entrySchema>
export type Position = z.infer<typeof positionSchema>
export type LauncherIcon = z.infer<typeof launcherIconSchema>
export type IconStyle = z.infer<typeof iconStyleSchema>
export type LauncherShape = z.infer<typeof launcherShapeSchema>
export type LauncherSize = z.infer<typeof launcherSizeSchema>
export type Roundness = z.infer<typeof roundnessSchema>
export type FontChoice = z.infer<typeof fontChoiceSchema>
export type HeaderStyle = z.infer<typeof headerStyleSchema>
export type ThinkingStyle = z.infer<typeof thinkingStyleSchema>
export type Density = z.infer<typeof densitySchema>
export type Voice = z.infer<typeof voiceSchema>
export type Spelling = z.infer<typeof spellingSchema>
export type ImageRatio = z.infer<typeof imageRatioSchema>
export type Avatar = z.infer<typeof avatarSchema>
export type AgentConfig = z.infer<typeof agentConfigSchema>
