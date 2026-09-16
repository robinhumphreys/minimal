import { tool, type InferUITools, type UIDataTypes, type UIMessage } from "ai"
import { z } from "zod"

import type { SiteChatSettings } from "@/app/admin/agent/onboarding/_components/site-chat"

/**
 * Shared by the route and the customise chat: the route hands it to the model,
 * the chat uses the types to read the call back. Kept apart from the route
 * file so the client bundle does not pull in the server handler.
 */

const placementSchema = z.enum(["bottom-right", "bottom-center", "bottom-left"])
const iconSchema = z.enum(["chat", "sparkles", "help"])
const iconStyleSchema = z.enum(["solid", "outline"])

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
  placement: placementSchema.optional().describe("Where the launcher sits."),
  icon: iconSchema.optional().describe("The launcher's glyph."),
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
  radius: z
    .string()
    .regex(/^\d+(\.\d+)?(px|rem)$/)
    .optional()
    .describe("Corner radius as a CSS length, e.g. 0px, 8px or 1rem."),
})

export type SiteChatPatch = z.infer<typeof siteChatPatchSchema>

/**
 * No `execute`: the settings live in the merchant's browser, so the chat
 * applies the patch itself and posts the result back for the model to confirm.
 */
export const siteChatTools = {
  updateSiteChat: tool({
    description:
      "Change one or more settings of the site chat. Send only the keys the merchant asked to change.",
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
