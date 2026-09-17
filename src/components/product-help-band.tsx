"use client"

import type { BrandId } from "@/lib/catalog/types"
import { useProductHelp } from "@/lib/config/use-surface"

/**
 * Category pages are server components; this is the client seam that lets
 * the band follow the merchant's Product help switch, hiding fully when off.
 */
export function ProductHelpBand({
  brand,
  children,
}: {
  brand: BrandId
  children: React.ReactNode
}) {
  const enabled = useProductHelp(brand)
  if (!enabled) return null
  return <>{children}</>
}
