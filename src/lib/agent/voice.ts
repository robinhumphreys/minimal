import type { Behaviour } from "@/lib/config/schema"

const VOICES: Record<Behaviour["voice"], string> = {
  warm: "Warm and encouraging, the way a good shop assistant is: interested in the shopper, never gushing.",
  direct:
    "Direct and economical. No small talk, no softeners; say the useful thing and stop.",
  playful:
    "Light and a little playful, with the odd dry line — never at the shopper's expense, and never at the cost of a clear answer.",
}

/**
 * Voice, spelling and language are merchant settings shared by chat and
 * search, so the lines describing them are written once, here.
 */
export function voiceLines(behaviour: Behaviour): string {
  return [
    `Voice: ${VOICES[behaviour.voice]}`,
    `Spelling: ${behaviour.spelling === "british" ? "British" : "American"} English throughout.`,
    `Language: reply in the language the shopper writes in; when that is unclear, ${behaviour.language}.`,
  ].join("\n")
}
