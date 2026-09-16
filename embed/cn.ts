import { createCn } from "cn/config"

/**
 * The embed's `cn`, taught its Tailwind prefix. Every utility in the bundle is
 * written `ma:flex`, so the merger has to know the prefix to see that
 * `ma:px-3` and `ma:px-4` are rivals. See `styles.css`.
 */
export const cn = createCn({ prefix: "ma" })
