import { cn } from "../cn"

import type { BrandId } from "@/lib/catalog/types"
import { BRAND_MARK_VIEW_BOX, brandMarkArtwork } from "@/lib/brand/marks"

/**
 * A merchant's logo, at whatever size the caller sets it.
 *
 * The same artwork the brand's `icon` route serves as its favicon — see
 * `lib/brand/marks.ts` for why it is markup and not JSX. A mark the product
 * draws differently from the site it stands for is worse than no mark.
 */
export function BrandMark({
  brand,
  className,
  ...props
}: { brand: BrandId } & React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox={BRAND_MARK_VIEW_BOX}
      aria-hidden="true"
      // The field runs to the edges, so whatever radius the caller sets has to
      // clip it. An `<svg>` root already hides its overflow; this states it.
      className={cn("ma:shrink-0 ma:overflow-hidden", className)}
      {...props}
      // Static markup from the module above, not anything a user supplies.
      dangerouslySetInnerHTML={{ __html: brandMarkArtwork(brand) }}
    />
  )
}
