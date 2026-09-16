import type { Metadata } from "next"

import { HomePage } from "@/components/volta/home-page"

export const metadata: Metadata = {
  title: "Volta — fuel the work",
  description:
    "Batch-tested protein, pre-workout, recovery and hydration for people who keep showing up.",
}

export default function Page() {
  return <HomePage />
}
