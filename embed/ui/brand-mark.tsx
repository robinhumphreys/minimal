import { cn } from "../cn"

import type { BrandId } from "@/lib/catalog/types"
import { BRAND_MARK_VIEW_BOX, brandMarkArtwork } from "@/lib/brand/marks"

/** Renders the same artwork the brand's `icon` route serves as its favicon; see `lib/brand/marks.ts`. */
export function BrandMark({
  brand,
  className,
  ...props
}: { brand: BrandId } & React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox={BRAND_MARK_VIEW_BOX}
      aria-hidden="true"
      className={cn("ma:shrink-0 ma:overflow-hidden", className)}
      {...props}
      // Static markup from brandMarkArtwork, not anything a user supplies.
      dangerouslySetInnerHTML={{ __html: brandMarkArtwork(brand) }}
    />
  )
}
