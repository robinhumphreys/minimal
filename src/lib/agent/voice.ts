import type { Behaviour } from "@/lib/config/schema"

const VOICES: Record<Behaviour["voice"], string> = {
  warm: "Warm and encouraging, the way a good shop assistant is: interested in the shopper, never gushing.",
  direct:
    "Direct and economical. No small talk, no softeners; say the useful thing and stop.",
  playful:
    "Light and a little playful, with the odd dry line — never at the shopper's expense, and never at the cost of a clear answer.",
}

/**
 * The lines every prompt shares about how to sound: voice, spelling and
 * language are merchant settings, so they are written once and read by both
 * the chat and the search.
 */
export function voiceLines(behaviour: Behaviour): string {
  return [
    `Voice: ${VOICES[behaviour.voice]}`,
    `Spelling: ${behaviour.spelling === "british" ? "British" : "American"} English throughout.`,
    `Language: reply in the language the shopper writes in; when that is unclear, ${behaviour.language}.`,
  ].join("\n")
}
