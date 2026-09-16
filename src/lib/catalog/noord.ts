import type { Category, Product } from "./types"

export const categories: Category[] = [
  {
    slug: "shirts",
    name: "Shirts",
    description: "Woven shirts for the office and the weekend.",
  },
  {
    slug: "trousers",
    name: "Trousers",
    description: "Tailored and casual trousers cut for everyday wear.",
  },
  {
    slug: "knitwear",
    name: "Knitwear",
    description: "Merino and lambswool layers in classic weights.",
  },
  {
    slug: "outerwear",
    name: "Outerwear",
    description: "Coats and jackets for northern European weather.",
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "Leather goods and small finishing pieces.",
  },
  {
    slug: "shoes",
    name: "Shoes",
    description: "Welted and blake-stitched footwear in leather.",
  },
]

export const products: Product[] = [
  {
    slug: "oxford-shirt",
    name: "Oxford Shirt",
    category: "shirts",
    price: 9500,
    images: ["/catalog/noord/oxford-shirt-1.jpg", "/catalog/noord/oxford-shirt-2.jpg"],
    attributes: { fit: "Regular", fabric: "Cotton oxford", colour: "Pale blue" },
    description:
      "A button-down oxford woven in Portugal. Softens with every wash without losing its shape.",
    tags: ["formal", "everyday", "cotton"],
  },
  {
    slug: "pleated-trousers",
    name: "Pleated Trousers",
    category: "trousers",
    price: 14500,
    compareAt: 17500,
    images: [
      "/catalog/noord/pleated-trousers-1.jpg",
      "/catalog/noord/pleated-trousers-2.jpg",
    ],
    attributes: { fit: "Relaxed", fabric: "Wool twill", colour: "Charcoal" },
    description:
      "Single-pleat trousers with a high rise and a gentle taper. Cut from a mid-weight wool twill.",
    tags: ["formal", "winter", "wool"],
  },
  {
    slug: "merino-crew",
    name: "Merino Crew",
    category: "knitwear",
    price: 11000,
    images: ["/catalog/noord/merino-crew-1.jpg", "/catalog/noord/merino-crew-2.jpg"],
    attributes: { fit: "Regular", fabric: "Extrafine merino", colour: "Oatmeal" },
    description:
      "A fine-gauge crew neck that layers under a jacket. Knitted from extrafine merino.",
    tags: ["layering", "winter", "wool"],
  },
  {
    slug: "wool-overcoat",
    name: "Wool Overcoat",
    category: "outerwear",
    price: 39500,
    compareAt: 45000,
    images: ["/catalog/noord/wool-overcoat-1.jpg", "/catalog/noord/wool-overcoat-2.jpg"],
    attributes: { fit: "Straight", fabric: "Wool melton", colour: "Navy" },
    description:
      "A single-breasted overcoat that falls just below the knee. Heavy melton, half-lined in cupro.",
    tags: ["formal", "winter", "outerwear"],
  },
  {
    slug: "leather-belt",
    name: "Leather Belt",
    category: "accessories",
    price: 6500,
    images: ["/catalog/noord/leather-belt-1.jpg", "/catalog/noord/leather-belt-2.jpg"],
    attributes: { width: "30mm", fabric: "Vegetable-tanned leather", colour: "Dark brown" },
    description:
      "A vegetable-tanned belt with a solid brass buckle. Darkens evenly with wear.",
    tags: ["accessory", "leather", "everyday"],
  },
  {
    slug: "derby-shoes",
    name: "Derby Shoes",
    category: "shoes",
    price: 28500,
    images: ["/catalog/noord/derby-shoes-1.jpg", "/catalog/noord/derby-shoes-2.jpg"],
    attributes: { fit: "True to size", fabric: "Calf leather", colour: "Black" },
    description:
      "An open-laced derby on a rounded last. Goodyear welted so it can be resoled.",
    tags: ["formal", "leather", "shoes"],
  },
]
