"use client"

import * as React from "react"

import type { BrandId } from "@/lib/catalog/types"
import { useAdminStore } from "@/lib/store/admin"

/**
 * Keeps the admin store's `active` in step with the organisation in the
 * address, for anything that still reads the store. The screens themselves
 * read the slug straight from the route, so nothing waits on this.
 */
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
