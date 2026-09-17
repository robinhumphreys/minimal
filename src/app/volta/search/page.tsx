import type { Metadata } from "next"

import { HomePage } from "@/components/volta/home-page"

export const metadata: Metadata = {
  title: "Search — Volta",
}

/** This route exists so a reload or shared link of the search sheet (see `useSearchUrl`) has somewhere to land. */
export default function Page() {
  return <HomePage />
}
