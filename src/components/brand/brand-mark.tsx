import { cn } from "cn"

import type { BrandId } from "@/lib/catalog/types"
import { BRAND_MARK_VIEW_BOX, brandMarkArtwork } from "@/lib/brand/marks"

/** A merchant's logo, at whatever size the caller sets it. */
export function BrandMark({
  brand,
  className,
  ...props
}: { brand: BrandId } & React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox={BRAND_MARK_VIEW_BOX}
      aria-hidden="true"
      // The artwork runs to the edges, so the caller's radius needs this
      // stated explicitly even though svg already clips overflow.
      className={cn("shrink-0 overflow-hidden", className)}
      {...props}
      // Static markup from lib/brand/marks.ts, not user-supplied.
      dangerouslySetInnerHTML={{ __html: brandMarkArtwork(brand) }}
    />
  )
}
