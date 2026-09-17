"use client"

import { useParams } from "next/navigation"

import { isBrandId, type BrandId } from "@/lib/catalog/types"
import { useAdminStore } from "@/lib/store/admin"

/** The store fallback only covers a screen rendered outside the `[org]` route; the layout already refuses invalid slugs. */
export function useOrg(): BrandId {
  const params = useParams<{ org?: string }>()
  const stored = useAdminStore((state) => state.active)
  const org = params?.org
  return typeof org === "string" && isBrandId(org) ? org : stored
}
