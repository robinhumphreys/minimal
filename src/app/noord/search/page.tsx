import type { Metadata } from "next"

import { HomePage } from "@/components/noord/home-page"

export const metadata: Metadata = {
  title: "Search — Noord Suits",
}

/** This route exists so a reload or shared link of the search sheet (see `useSearchUrl`) has somewhere to land. */
export default function Page() {
  return <HomePage />
}
