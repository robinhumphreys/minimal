import type { DetailedHTMLProps, HTMLAttributes } from "react"

type CustomElement<Extra = Record<string, never>> = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> &
  Extra

/**
 * The mount points a storefront leaves for the embed. Empty until the embed
 * fills them, and they stay empty on a site the embed never reaches.
 */
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      /** Filled by the embed when `surface.entry` is `bar`. */
      "minimal-agent-bar": CustomElement
      /** Filled by the embed on product pages. */
      "minimal-agent-recommendations": CustomElement<{ "data-product": string }>
      /**
       * Filled by the embed with its reading of the site's own search box.
       * The storefront puts the search the shopper submitted on `data-query`,
       * and marks its own input and results `data-native-search` so the
       * embed can stand them down while it answers.
       */
      "minimal-agent-search": CustomElement<{ "data-query": string }>
      /**
       * Filled by the embed with the button that opens Product help, for
       * whatever the page says it is about.
       */
      "minimal-agent-guide": CustomElement<{ "data-topic": string }>
    }
  }
}
