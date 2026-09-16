// Builds the standalone embed bundle served at /embed.js and /embed.css.
// Pass --watch to rebuild on change alongside `next dev`.
import { spawn } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import * as esbuild from "esbuild"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const watch = process.argv.includes("--watch")

const options = {
  absWorkingDir: root,
  entryPoints: ["embed/main.tsx"],
  outfile: "public/embed.js",
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["chrome111", "edge111", "firefox111", "safari16.4"],
  jsx: "automatic",
  minify: true,
  sourcemap: false,
  tsconfig: "tsconfig.json",
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "info",
}

const tailwindArgs = [
  "@tailwindcss/cli",
  "--input",
  "embed/styles.css",
  "--output",
  "public/embed.css",
  "--minify",
  ...(watch ? ["--watch"] : []),
]

function runTailwind() {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", tailwindArgs, { cwd: root, stdio: "inherit" })
    child.on("error", reject)
    if (watch) {
      // In watch mode the CLI never exits; let the caller carry on.
      resolve(child)
      return
    }
    child.on("exit", (code) =>
      code === 0
        ? resolve(child)
        : reject(new Error(`tailwind exited with ${code}`)),
    )
  })
}

if (watch) {
  const context = await esbuild.context(options)
  await context.watch()
  await runTailwind()
} else {
  await esbuild.build(options)
  await runTailwind()
}
