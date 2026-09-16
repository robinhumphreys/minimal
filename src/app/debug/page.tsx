import type { Metadata } from "next"

import { BRAND_IDS, type BrandId } from "@/lib/catalog"
import { defaultConfig } from "@/lib/config/defaults"

import { DebugView } from "./debug-view"
import { fixturesFor, type Fixtures } from "./fixtures"

export const metadata: Metadata = { title: "Surfaces · debug" }

/**
 * Every surface, in every state worth looking at, for both brands, with
 * nothing behind it but fixtures: for checking how the AI modes look with
 * content in them without paying a model to say something.
 */
export default function Page() {
  const brands = Object.fromEntries(
    BRAND_IDS.map((brand) => [brand, fixturesFor(brand)]),
  ) as Record<BrandId, Fixtures>

  return (
    <DebugView
      brands={BRAND_IDS.map((brand) => ({
        config: defaultConfig(brand),
        fixtures: brands[brand],
      }))}
    />
  )
}
