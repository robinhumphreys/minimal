import { createCn } from "cn/config"

/**
 * `cn`, taught the brands' font-size scales: unrecognised `text-*` utilities
 * are otherwise treated as colours, which once rendered a price white on white.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "volta-micro",
            "volta-label",
            "volta-body",
            "volta-lead",
            "volta-title",
            "volta-heading",
            "volta-display",
          ],
        },
      ],
    },
  },
})
