import type { Metadata } from "next"

import { HomePage } from "@/components/noord/home-page"

export const metadata: Metadata = {
  title: "Search — Noord Suits",
}

/**
 * The address of the search sheet. The sheet is a client overlay that reads
 * `?q=` off the URL and opens itself when the path is this one (see
 * `useSearchUrl`); this route exists so a reload or a shared link has
 * somewhere to land, with the home page as the backdrop.
 */
export default function Page() {
  return <HomePage />
}
