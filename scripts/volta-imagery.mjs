/**
 * Crops and compresses the Volta editorial photography into
 * `public/volta/editorial`.
 *
 * Run once, from the repo root, with the source shots in `SRC`:
 *
 *   node scripts/volta-imagery.mjs
 *
 * The output is committed, so this only needs running when the source set or
 * the crops change. Originals are Unsplash shots and are not in the repo.
 */
import sharp from "sharp"
import path from "node:path"

const SRC = process.env.VOLTA_IMAGERY ?? "/Users/robin/Downloads/volta imagery"
const OUT = "public/volta/editorial"

/**
 * name -> [source file, aspect]. Aspects are the shapes the layouts need:
 * wide for full-bleed bands, portrait for nav/category tiles, square for rails.
 */
const JOBS = [
  // Hero: black-background deadlift silhouette. Two crops, one per breakpoint.
  ["hero-wide", "anastase-maragos-9dzWZQWZMdE-unsplash.jpg", 2000, 1125],
  ["hero-tall", "anastase-maragos-9dzWZQWZMdE-unsplash.jpg", 1200, 1600],

  ["plates-rack", "andrew-valdivia-NNYw7vzQZNE-unsplash.jpg", 1000, 1250],
  ["plates-hands", "andrew-valdivia-bP82pq5z_PE-unsplash.jpg", 1000, 1250],
  [
    "overhead-press",
    "logan-weaver-lgnwvr-ALdfSuMfLl8-unsplash.jpg",
    1000,
    1250,
  ],
  ["barbell-hands", "logan-weaver-lgnwvr-LzT-WMv1xrI-unsplash.jpg", 1000, 1250],
  ["barbell-dark", "tyler-raye-Xb1d-N04Quc-unsplash.jpg", 1000, 1250],
  ["water-hands", "mrjn-photography-YpZ2cj4s0oo-unsplash.jpg", 1000, 1250],
  ["softgels-hand", "kristine-kozaka-Xe8YmGY-5D4-unsplash.jpg", 1000, 1250],
  ["lime-pour", "mae-mu-YNMjGIPgD_c-unsplash.jpg", 1000, 1250],

  ["gym-floor", "danielle-cerullo-CQfNt66ttZM-unsplash.jpg", 1800, 1013],
  ["curl-dark", "luke-witter-k47w6BeapCs-unsplash.jpg", 1800, 1013],
  ["deadlift-legs", "victor-freitas-WvDYdXDzkhs-unsplash.jpg", 1800, 1013],
  ["hydration-pour", "anderson-rian-klwak-FdEiA-unsplash.jpg", 1800, 1013],
  ["tablets-green", "mika-baumeister-wbw5RjQXxyg-unsplash.jpg", 1800, 1013],

  ["drink-water", "engin-akyurt-PcU17evKnew-unsplash.jpg", 1200, 1200],
  ["lemon-water", "john-cardamone-Cy4Z2QhInZc-unsplash.jpg", 1200, 1200],
  ["gummies-citrus", "maria-kozyr-KQBX7YTcGuc-unsplash.jpg", 1200, 1200],
  [
    "bottle-softgels",
    "supliful-supplements-on-demand-URH9F9E32og-unsplash.jpg",
    1200,
    1200,
  ],
]

for (const [name, file, w, h] of JOBS) {
  await sharp(path.join(SRC, file))
    .resize(w, h, { fit: "cover", position: "attention" })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(path.join(OUT, `${name}.jpg`))
  console.log(`${name}.jpg  ${w}x${h}`)
}
