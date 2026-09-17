"use client"

import * as React from "react"

import type { BrandId } from "@/lib/catalog/types"

/**
 * The same tag a merchant pastes into their own site, added when the
 * storefront mounts and torn down when it unmounts.
 *
 * Not `next/script`: that loads a given `src` once per session, so after a
 * client-side navigation from one storefront to the other the first brand's
 * agent stayed mounted, and after a navigation to the admin its launcher was
 * left floating over the screen. A merchant's site never leaves the
 * storefront, so none of this applies to the tag they paste.
 */
export function AgentEmbed({ brand }: { brand: BrandId }) {
  React.useEffect(() => {
    const script = document.createElement("script")
    script.src = "/embed.js"
    script.dataset.agent = brand
    script.async = true
    document.body.appendChild(script)
    return () => {
      window.MinimalAgent?.destroy()
      script.remove()
    }
  }, [brand])

  return null
}
