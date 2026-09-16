"use client"

import { useParams } from "next/navigation"

import { isBrandId, type BrandId } from "@/lib/catalog/types"
import { useAdminStore } from "@/lib/store/admin"

/**
 * The organisation an admin screen belongs to: the `[org]` segment of its
 * address. The layout has already refused any slug that is not a brand, so
 * the fallback to the store only covers a screen rendered outside that route.
 */
export function useOrg(): BrandId {
  const params = useParams<{ org?: string }>()
  const stored = useAdminStore((state) => state.active)
  const org = params?.org
  return typeof org === "string" && isBrandId(org) ? org : stored
}
