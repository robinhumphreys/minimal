import type { Category, Product } from "./types"

export const categories: Category[] = [
  {
    slug: "protein",
    name: "Protein",
    description: "Whey, casein and plant proteins for daily intake.",
  },
  {
    slug: "pre-workout",
    name: "Pre-Workout",
    description: "Stimulant and stim-free formulas for training energy.",
  },
  {
    slug: "recovery",
    name: "Recovery",
    description: "Post-session blends aimed at soreness and repair.",
  },
  {
    slug: "hydration",
    name: "Hydration",
    description: "Electrolytes and carbohydrate mixes for endurance work.",
  },
  {
    slug: "vitamins",
    name: "Vitamins",
    description: "Everyday micronutrient support in capsule form.",
  },
  {
    slug: "bars",
    name: "Bars",
    description: "Whole-food and protein bars for training and travel.",
  },
]

export const products: Product[] = [
  {
    slug: "whey-isolate",
    name: "Whey Isolate",
    category: "protein",
    price: 4900,
    compareAt: 5900,
    images: ["/catalog/volta/whey-isolate-1.jpg", "/catalog/volta/whey-isolate-2.jpg"],
    attributes: { flavour: "Vanilla", size: "900g", goal: "Muscle gain" },
    description:
      "A cold-filtered whey isolate at 27g protein per scoop. Mixes clear with water.",
    tags: ["protein", "lean", "post-workout"],
  },
  {
    slug: "pre-surge",
    name: "Pre-Surge",
    category: "pre-workout",
    price: 3400,
    images: ["/catalog/volta/pre-surge-1.jpg", "/catalog/volta/pre-surge-2.jpg"],
    attributes: { flavour: "Citrus", size: "300g", goal: "Training energy" },
    description:
      "Caffeine, beta-alanine and citrulline in a single scoop. Take twenty minutes before training.",
    tags: ["energy", "strength", "caffeine"],
  },
  {
    slug: "recovery-blend",
    name: "Recovery Blend",
    category: "recovery",
    price: 4200,
    images: [
      "/catalog/volta/recovery-blend-1.jpg",
      "/catalog/volta/recovery-blend-2.jpg",
    ],
    attributes: { flavour: "Berry", size: "750g", goal: "Recovery" },
    description:
      "Carbohydrate and protein in a 3:1 ratio with added tart cherry. Built for back-to-back sessions.",
    tags: ["recovery", "endurance", "post-workout"],
  },
  {
    slug: "electrolyte-mix",
    name: "Electrolyte Mix",
    category: "hydration",
    price: 2400,
    images: [
      "/catalog/volta/electrolyte-mix-1.jpg",
      "/catalog/volta/electrolyte-mix-2.jpg",
    ],
    attributes: { flavour: "Lemon", size: "30 sachets", goal: "Hydration" },
    description:
      "Sodium, potassium and magnesium in single-serve sachets. No added sugar.",
    tags: ["hydration", "endurance", "vegan"],
  },
  {
    slug: "daily-multi",
    name: "Daily Multi",
    category: "vitamins",
    price: 1900,
    images: ["/catalog/volta/daily-multi-1.jpg", "/catalog/volta/daily-multi-2.jpg"],
    attributes: { flavour: "Unflavoured", size: "120 capsules", goal: "General health" },
    description:
      "A two-a-day multivitamin with vitamin D3, zinc and magnesium. Capsule shell is plant-based.",
    tags: ["vitamins", "vegan", "daily"],
  },
  {
    slug: "oat-protein-bar",
    name: "Oat Protein Bar",
    category: "bars",
    price: 2900,
    compareAt: 3400,
    images: [
      "/catalog/volta/oat-protein-bar-1.jpg",
      "/catalog/volta/oat-protein-bar-2.jpg",
    ],
    attributes: { flavour: "Cocoa", size: "12 bars", goal: "Snacking" },
    description:
      "Rolled oats and pea protein at 15g per bar. Chewy rather than crunchy.",
    tags: ["snack", "vegan", "protein"],
  },
]
