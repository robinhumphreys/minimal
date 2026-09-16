import { brandMarkSvg } from "@/lib/brand/marks"

/**
 * Noord's favicon: the same mark the admin puts beside the account's name.
 *
 * SVG rather than `ImageResponse`: the mark is flat geometry, so one file
 * answers every size a tab strip, bookmark bar or home screen asks for, and
 * rasterises for none of them.
 */
export const contentType = "image/svg+xml"

// `size` is deliberately not exported: Next turns it into `sizes="32x32"` on
// the <link>, which would pin a scalable mark to a single size.

export default function Icon() {
  return new Response(brandMarkSvg("noord"), {
    headers: { "Content-Type": contentType },
  })
}
