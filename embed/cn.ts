import { createCn } from "cn/config"

/** Taught the `ma:` prefix so the merger can see that `ma:px-3` and `ma:px-4` are rivals. */
export const cn = createCn({ prefix: "ma" })
