import type { DetailedHTMLProps, HTMLAttributes } from "react"

type CustomElement<Extra = Record<string, never>> = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> &
  Extra

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      /** Mount point filled by the embed when `surface.entry` is `bar`. */
      "minimal-agent-bar": CustomElement
      /** Mount point filled by the embed on product pages. */
      "minimal-agent-recommendations": CustomElement<{ "data-product": string }>
    }
  }
}
