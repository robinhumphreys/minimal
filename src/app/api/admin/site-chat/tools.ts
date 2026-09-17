import { tool, type InferUITools, type UIDataTypes, type UIMessage } from "ai"
import { z } from "zod"

import type { SiteChatSettings } from "@/app/admin/[org]/agent/onboarding/_components/site-chat"

import type { ChatSurface } from "./surfaces"
import {
  avatarSchema,
  densitySchema,
  fontChoiceSchema,
  headerStyleSchema,
  iconStyleSchema,
  imageRatioSchema,
  launcherIconSchema,
  launcherShapeSchema,
  launcherSizeSchema,
  positionSchema,
  roundnessSchema,
  spellingSchema,
  thinkingStyleSchema,
  voiceSchema,
} from "@/lib/config/schema"

// Kept apart from the route file so the client bundle does not pull in the server handler.

/** Every key is optional: the model sends only what the merchant asked to change. */
export const siteChatPatchSchema = z.object({
  greeting: z
    .string()
    .min(1)
    .optional()
    .describe("The agent's opening message."),
  starters: z
    .array(z.string().min(1))
    .max(4)
    .optional()
    .describe(
      "Suggested questions shown under the greeting. Replaces the list.",
    ),
  assistantName: z
    .string()
    .optional()
    .describe(
      "What the assistant is called in the window's header. Empty for the brand's name.",
    ),
  subtitle: z
    .string()
    .optional()
    .describe(
      "The line under the assistant's name, e.g. 'Shopping assistant'. Empty for none.",
    ),
  avatar: avatarSchema
    .optional()
    .describe(
      "'initial' for a lettered disc, 'mark' for the brand's own logo.",
    ),
  voice: voiceSchema
    .optional()
    .describe("How the agent sounds: warm, direct or playful."),
  spelling: spellingSchema.optional().describe("British or American spelling."),
  language: z
    .string()
    .min(1)
    .optional()
    .describe(
      "The language the agent falls back to, e.g. 'English' or 'Dutch'.",
    ),
  placement: positionSchema.optional().describe("Where the chat button sits."),
  shape: launcherShapeSchema
    .optional()
    .describe(
      "The chat button's shape: circle, square (follows the roundness), or pill (always labelled).",
    ),
  size: launcherSizeSchema
    .optional()
    .describe("The chat button's size: sm, md or lg."),
  icon: launcherIconSchema.optional().describe("The launcher's glyph."),
  iconStyle: iconStyleSchema.optional().describe("Filled or outlined glyph."),
  label: z
    .string()
    .optional()
    .describe("Text beside the icon. Empty string for icon only."),
  accent: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional()
    .describe("Accent colour as a six-digit hex, e.g. #1d4ed8."),
  roundness: roundnessSchema
    .optional()
    .describe(
      "Corners of the window, bubbles and cards: square, soft or round.",
    ),
  font: fontChoiceSchema
    .optional()
    .describe(
      "'site' for the site's own font, or inter, geist, system, serif.",
    ),
  header: headerStyleSchema
    .optional()
    .describe(
      "The window's header: 'accent' fills it with the accent colour, 'plain' keeps it on the surface.",
    ),
  thinking: thinkingStyleSchema
    .optional()
    .describe("What waiting looks like: dots, a ring, or a line of text."),
  density: densitySchema
    .optional()
    .describe("Spacing: comfortable or compact."),
  ratio: imageRatioSchema
    .optional()
    .describe("Product image shape on cards: portrait or square."),
  price: z.boolean().optional().describe("Whether cards show the price."),
  rating: z
    .boolean()
    .optional()
    .describe("Whether cards show the star rating."),
  picks: z
    .number()
    .int()
    .min(2)
    .max(4)
    .optional()
    .describe("How many products a recommendation shows at most: 2, 3 or 4."),
  nudge: z
    .number()
    .int()
    .min(0)
    .max(120)
    .optional()
    .describe(
      "Seconds before the greeting pops up beside the closed chat button. 0 switches it off.",
    ),
  openOnProductPages: z
    .boolean()
    .optional()
    .describe("Whether the window opens by itself on product pages."),
  hiddenPaths: z
    .array(z.string().min(1))
    .optional()
    .describe(
      "Path prefixes the chat button stays off, e.g. ['/checkout']. Replaces the list.",
    ),
  searchAssist: z
    .boolean()
    .optional()
    .describe(
      "Whether the agent also takes over the site's own search box. False leaves the search box alone.",
    ),
  siteChat: z
    .boolean()
    .optional()
    .describe("Whether the chat button is on the site at all."),
  productHelp: z
    .boolean()
    .optional()
    .describe(
      "Whether Product help is on: a guided choice opened from a button the site places, asking one question at a time and ending on a product.",
    ),
  guideLabel: z
    .string()
    .min(1)
    .optional()
    .describe("Text on Product help's button, e.g. 'Help me choose'."),
  guideGreeting: z
    .string()
    .min(1)
    .optional()
    .describe("Product help's first line, before its first question."),
  guideSide: z
    .enum(["right", "left"])
    .optional()
    .describe(
      "Which edge Product help's panel comes in from on a wide screen.",
    ),
  chatPlaceholder: z
    .string()
    .min(1)
    .optional()
    .describe("What the site chat's composer says while empty."),
  searchPlaceholder: z
    .string()
    .min(1)
    .optional()
    .describe("What Search assist's refine box says while empty."),
  guidePlaceholder: z
    .string()
    .min(1)
    .optional()
    .describe("What Product help's answer box says while empty."),
})

export type SiteChatPatch = z.infer<typeof siteChatPatchSchema>

type PatchKey = keyof SiteChatPatch

// A change made from any tab applies to all three: one agent, three places it appears.
const SHARED_KEYS: readonly PatchKey[] = [
  "voice",
  "spelling",
  "language",
  "accent",
  "roundness",
  "font",
  "ratio",
  "price",
  "rating",
  "picks",
]

/** The model is told about, and given, only its own surface's keys. */
export const SURFACE_KEYS: Record<ChatSurface, readonly PatchKey[]> = {
  "site-chat": [
    ...SHARED_KEYS,
    "siteChat",
    "greeting",
    "starters",
    "chatPlaceholder",
    "assistantName",
    "subtitle",
    "avatar",
    "placement",
    "shape",
    "size",
    "icon",
    "iconStyle",
    "label",
    "header",
    "thinking",
    "density",
    "nudge",
    "openOnProductPages",
    "hiddenPaths",
  ],
  "search-assist": [...SHARED_KEYS, "searchAssist", "searchPlaceholder"],
  "product-help": [
    ...SHARED_KEYS,
    "productHelp",
    "guideLabel",
    "guideGreeting",
    "guideSide",
    "guidePlaceholder",
  ],
}

function patchSchemaFor(surface: ChatSurface) {
  const mask = Object.fromEntries(
    SURFACE_KEYS[surface].map((key) => [key, true as const]),
  ) as Record<PatchKey, true>
  return siteChatPatchSchema.pick(mask)
}

/** No `execute`: the settings live in the merchant's browser, so the chat applies the patch itself. */
export const siteChatTools = {
  updateSiteChat: tool({
    description:
      "Change one or more settings of the agent. Send only the keys the merchant asked to change.",
    inputSchema: siteChatPatchSchema,
    outputSchema: z.object({ applied: siteChatPatchSchema }),
  }),
}

/** The same tool, narrowed to the keys the surface's chat is allowed to change. */
export function toolsFor(surface: ChatSurface) {
  const schema = patchSchemaFor(surface)
  return {
    updateSiteChat: tool({
      description:
        "Change one or more settings of the agent. Send only the keys the merchant asked to change.",
      inputSchema: schema,
      outputSchema: z.object({ applied: schema }),
    }),
  }
}

export type SiteChatUIMessage = UIMessage<
  never,
  UIDataTypes,
  InferUITools<typeof siteChatTools>
>

export function applySiteChatPatch(
  settings: SiteChatSettings,
  patch: SiteChatPatch,
): SiteChatSettings {
  // Absent keys stay absent after zod, but a model can still send an explicit
  // `undefined`-shaped null; only defined values may overwrite a setting.
  const defined: Partial<SiteChatSettings> = {}
  for (const key of Object.keys(patch) as (keyof SiteChatPatch)[]) {
    const value = patch[key]
    if (value !== undefined) Object.assign(defined, { [key]: value })
  }
  return { ...settings, ...defined }
}
