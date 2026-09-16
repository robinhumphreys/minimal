import { tool, type InferUITools, type UIDataTypes, type UIMessage } from "ai"
import { z } from "zod"

import type { SiteChatSettings } from "@/app/admin/[org]/agent/onboarding/_components/site-chat"
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

/**
 * Shared by the route and the customise chat: the route hands it to the model,
 * the chat uses the types to read the call back. Kept apart from the route
 * file so the client bundle does not pull in the server handler.
 */

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
  placement: positionSchema.optional().describe("Where the launcher sits."),
  shape: launcherShapeSchema
    .optional()
    .describe(
      "The launcher's shape: circle, square (follows the roundness), or pill (always labelled).",
    ),
  size: launcherSizeSchema
    .optional()
    .describe("The launcher's size: sm, md or lg."),
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
      "Seconds before the greeting pops up beside the closed launcher. 0 switches it off.",
    ),
  openOnProductPages: z
    .boolean()
    .optional()
    .describe("Whether the window opens by itself on product pages."),
  hiddenPaths: z
    .array(z.string().min(1))
    .optional()
    .describe(
      "Path prefixes the launcher stays off, e.g. ['/checkout']. Replaces the list.",
    ),
  searchAssist: z
    .boolean()
    .optional()
    .describe(
      "Whether the agent also takes over the site's own search box. False leaves the search box alone.",
    ),
})

export type SiteChatPatch = z.infer<typeof siteChatPatchSchema>

/**
 * No `execute`: the settings live in the merchant's browser, so the chat
 * applies the patch itself and posts the result back for the model to confirm.
 */
export const siteChatTools = {
  updateSiteChat: tool({
    description:
      "Change one or more settings of the agent. Send only the keys the merchant asked to change.",
    inputSchema: siteChatPatchSchema,
    outputSchema: z.object({ applied: siteChatPatchSchema }),
  }),
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
