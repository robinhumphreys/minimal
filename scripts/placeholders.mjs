// Generates a flat grey placeholder WebP for every image path referenced by the
// catalog files. Real photography replaces these later; the catalog shape does
// not change.
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const catalogDir = path.join(root, "src", "lib", "catalog")
const brands = ["noord", "volta"]
const SIZE = 1200

const imagePaths = new Set()
for (const brand of brands) {
  const source = await readFile(path.join(catalogDir, `${brand}.ts`), "utf8")
  for (const match of source.matchAll(/"(\/catalog\/[^"]+\.webp)"/g)) {
    imagePaths.add(match[1])
  }
}

if (imagePaths.size === 0) {
  throw new Error("No image paths found in the catalog files.")
}

let written = 0
for (const imagePath of [...imagePaths].sort()) {
  const target = path.join(root, "public", imagePath)
  if (existsSync(target)) continue

  await mkdir(path.dirname(target), { recursive: true })

  // Vary the grey slightly per file so the placeholders are distinguishable.
  const hash = [...imagePath].reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const value = 190 + (hash % 40)

  const buffer = await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 3,
      background: { r: value, g: value, b: value },
    },
  })
    .webp({ quality: 70 })
    .toBuffer()

  await writeFile(target, buffer)
  written += 1
}

console.log(
  `placeholders: ${written} written, ${imagePaths.size - written} already present`,
)
