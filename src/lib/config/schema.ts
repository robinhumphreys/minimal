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

export const surfaceSchema = z.object({
  entry: entrySchema,
  /** Launcher only. */
  position: positionSchema.optional(),
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
export type AgentConfig = z.infer<typeof agentConfigSchema>
