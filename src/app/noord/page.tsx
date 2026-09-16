import type { Metadata } from "next"

import { HomePage } from "@/components/noord/home-page"

export const metadata: Metadata = {
  title: "Noord Suits — Tailoring for the northern half of the year",
}

export default function Page() {
  return <HomePage />
}
