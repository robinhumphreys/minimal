import { brandMarkSvg } from "@/lib/brand/marks"

// SVG, not `ImageResponse`: the mark is flat geometry, so one file answers every size without rasterising.
export const contentType = "image/svg+xml"

// `size` is deliberately not exported: Next turns it into `sizes="32x32"` on
// the <link>, which would pin a scalable mark to a single size.

export default function Icon() {
  return new Response(brandMarkSvg("noord"), {
    headers: { "Content-Type": contentType },
  })
}
