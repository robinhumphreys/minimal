"use client"

import type { BrandId } from "@/lib/catalog/types"
import { useProductHelp } from "@/lib/config/use-surface"

/**
 * The storefront's own framing around a `minimal-agent-guide` mount. The
 * category pages are server components, so this is the one client seam
 * that lets the band follow the merchant's Product help switch: off, and
 * neither the copy nor the empty mount is on the page.
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
