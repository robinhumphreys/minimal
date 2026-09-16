"use client"

import { motion } from "motion/react"

import { MinimalLogo } from "@/app/admin/_components/minimal-logo"
import { NextButton } from "@/app/admin/_components/next-button"

/**
 * The flow's front door: one sentence and one button. Everything the merchant
 * needs to decide here is whether to begin, so there is nothing else on screen
 * to decide about.
 */
export function IntroStep({ next }: { next: string }) {
  return (
    <motion.div
      // Arrives rather than appears: the mark, then the sentence, then the
      // button, each a beat behind the last, which is also the order they are
      // meant to be read in.
      initial="hidden"
      animate="shown"
      transition={{ staggerChildren: 0.09, delayChildren: 0.05 }}
      className="flex h-full flex-col items-center justify-center px-8 py-16 text-center"
    >
      <Fade>
        <MinimalLogo className="size-8 text-muted-foreground" />
      </Fade>
      <Fade>
        <h1 className="mt-6 max-w-lg font-heading text-3xl tracking-tight text-balance">
          Hi! Let&rsquo;s set up your agentic storefront
        </h1>
      </Fade>
      <Fade>
        <NextButton href={next} className="mt-8">
          Start
        </NextButton>
      </Fade>
    </motion.div>
  )
}

/** One child of the stagger: up a few pixels as it fades in. */
function Fade({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 6 },
        shown: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
