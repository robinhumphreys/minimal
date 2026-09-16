import { createCn } from "cn/config"

/**
 * `cn`, taught the brands' custom font-size scales.
 *
 * Out of the box the merger classifies any `text-*` it does not recognise as a
 * colour, so `cn("text-volta-title", "text-volta-void")` reads the two as
 * rivals and drops the first. Both are real utilities that set different
 * properties, and the price on a product tile silently rendered white on white
 * until they were declared here.
 *
 * Every custom `--text-*` token in `src/styles/*.css` has to be listed. Add a
 * size token, add it here.
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
