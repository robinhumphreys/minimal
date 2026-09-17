"use client"

import * as React from "react"

import type { BrandId } from "@/lib/catalog/types"
import { useAdminStore } from "@/lib/store/admin"

/** Keeps the store's `active` in step with the address for anything that still reads it; screens read the route directly. */
export function OrgSync({
  org,
  children,
}: {
  org: BrandId
  children: React.ReactNode
}) {
  React.useLayoutEffect(() => {
    if (useAdminStore.getState().active !== org) {
      useAdminStore.getState().setActive(org)
    }
  }, [org])

  return children
}
