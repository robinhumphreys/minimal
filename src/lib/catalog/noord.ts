import type { Category, Product } from "./types"

export const categories: Category[] = [
  {
    slug: "suits",
    name: "Suits",
    description: "Two-piece suits in Italian cloth, cut to three house fits.",
  },
  {
    slug: "jackets",
    name: "Jackets",
    description: "Suit jackets sold on their own, to wear with odd trousers.",
  },
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
    slug: "navy-checked-tailored-fit-havana-blazer",
    name: "Navy Checked Tailored Fit Havana Blazer",
    category: "jackets",
    price: 44900,
    images: [
      "/catalog/noord/navy-checked-tailored-fit-havana-blazer-1.jpg",
      "/catalog/noord/navy-checked-tailored-fit-havana-blazer-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Havana",
      fabric: "Wrinkle-Free Wool",
      composition: "100% Wool",
      colour: "Navy",
      mill: "Rogna, Italy",
    },
    description:
      "A Checked Tailored Fit Havana Blazer in Wrinkle-Free Wool, woven by Rogna, Italy. The cloth carries a checked pattern.",
    tags: ["tailoring", "formal", "wool", "checked"],
  },
  {
    slug: "black-relaxed-fit-shirt-jacket",
    name: "Black Relaxed Fit Shirt-Jacket",
    category: "jackets",
    price: 24900,
    images: [
      "/catalog/noord/black-relaxed-fit-shirt-jacket-1.jpg",
      "/catalog/noord/black-relaxed-fit-shirt-jacket-2.jpg",
    ],
    attributes: {
      fit: "Relaxed Fit Shirt-Jacket",
      fabric: "Pure Wool",
      composition: "100% Wool",
      colour: "Black",
      mill: "Longda, China Mainland",
    },
    description:
      "A Relaxed Fit Shirt-Jacket in Pure Wool, woven by Longda, China Mainland.",
    tags: ["tailoring", "everyday", "wool"],
  },
  {
    slug: "navy-relaxed-fit-roma-suit-jacket",
    name: "Navy Relaxed Fit Roma Suit Jacket",
    category: "jackets",
    price: 42900,
    images: [
      "/catalog/noord/navy-relaxed-fit-roma-suit-jacket-1.jpg",
      "/catalog/noord/navy-relaxed-fit-roma-suit-jacket-2.jpg",
    ],
    attributes: {
      fit: "Relaxed Fit Roma",
      fabric: "Pure Linen",
      composition: "100% Linen",
      colour: "Navy",
      mill: "Libeco, Belgium",
    },
    description:
      "A Relaxed Fit Roma Suit Jacket in Pure Linen, woven by Libeco, Belgium.",
    tags: ["tailoring", "formal", "linen"],
  },
  {
    slug: "black-tailored-fit-havana-dinner-jacket",
    name: "Black Tailored Fit Havana Dinner Jacket",
    category: "jackets",
    price: 42900,
    images: [
      "/catalog/noord/black-tailored-fit-havana-dinner-jacket-1.jpg",
      "/catalog/noord/black-tailored-fit-havana-dinner-jacket-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Havana",
      fabric: "Pure S110's Wool",
      composition: "100% Wool",
      colour: "Black",
      mill: "Vitale Barberis Canonico, Italy",
    },
    description:
      "A Tailored Fit Havana Dinner Jacket in Pure S110's Wool, woven by Vitale Barberis Canonico, Italy.",
    tags: ["tailoring", "formal", "wool"],
  },
  {
    slug: "navy-tailored-fit-havana-blazer",
    name: "Navy Tailored Fit Havana Blazer",
    category: "jackets",
    price: 29900,
    images: [
      "/catalog/noord/navy-tailored-fit-havana-blazer-1.jpg",
      "/catalog/noord/navy-tailored-fit-havana-blazer-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Havana",
      fabric: "Pure Wool",
      composition: "100% Wool",
      colour: "Navy",
      mill: "Reda, Italy",
    },
    description:
      "A Tailored Fit Havana Blazer in Pure Wool, woven by Reda, Italy.",
    tags: ["tailoring", "formal", "wool"],
  },
  {
    slug: "white-point-collar-shirt",
    name: "White Point Collar Shirt",
    category: "shirts",
    price: 11900,
    images: [
      "/catalog/noord/white-point-collar-shirt-1.jpg",
      "/catalog/noord/white-point-collar-shirt-2.jpg",
    ],
    attributes: {
      fabric: "Egyptian Cotton",
      composition: "100% Cotton",
      colour: "White",
      mill: "Albini, Italy",
      collar: "Large Point",
      cuff: "Single Cuff",
    },
    description:
      "A Point Collar Shirt in Egyptian Cotton, woven by Albini, Italy. Large Point collar with a single cuff.",
    tags: ["shirts", "formal", "cotton"],
  },
  {
    slug: "white-twill-tuxedo-shirt",
    name: "White Twill Tuxedo Shirt",
    category: "shirts",
    price: 14900,
    images: [
      "/catalog/noord/white-twill-tuxedo-shirt-1.jpg",
      "/catalog/noord/white-twill-tuxedo-shirt-2.jpg",
    ],
    attributes: {
      fabric: "Egyptian Cotton",
      composition: "100% Cotton",
      colour: "White",
      mill: "Testa 1919 Srl, Italy",
      collar: "High Widespread",
      cuff: "Double Cuff",
    },
    description:
      "A Twill Tuxedo Shirt in Egyptian Cotton, woven by Testa 1919 Srl, Italy. High Widespread collar with a double cuff.",
    tags: ["shirts", "formal", "cotton"],
  },
  {
    slug: "light-brown-corduroy-shirt",
    name: "Light Brown Corduroy Shirt",
    category: "shirts",
    price: 12900,
    images: [
      "/catalog/noord/light-brown-corduroy-shirt-1.jpg",
      "/catalog/noord/light-brown-corduroy-shirt-2.jpg",
    ],
    attributes: {
      fabric: "Pure Cotton Corduroy",
      composition: "100% Cotton",
      colour: "Light Brown",
      mill: "Pontoglio, Italy",
      collar: "Classic",
      cuff: "Single Round Adjustable",
    },
    description:
      "A Corduroy Shirt in Pure Cotton Corduroy, woven by Pontoglio, Italy. Classic collar with a single round adjustable cuff.",
    tags: ["shirts", "everyday", "cotton"],
  },
  {
    slug: "black-wool-mohair-zip-overshirt",
    name: "Black Wool Mohair Zip Overshirt",
    category: "shirts",
    price: 17900,
    images: [
      "/catalog/noord/black-wool-mohair-zip-overshirt-1.jpg",
      "/catalog/noord/black-wool-mohair-zip-overshirt-2.jpg",
    ],
    attributes: {
      fabric: "Wool Mohair",
      composition: "73% Wool, 27% Mohair",
      colour: "Black",
      mill: "Vitale Barberis Canonico, Italy",
      collar: "Camp",
      cuff: "Single Cuff One Button",
    },
    description:
      "A Wool Mohair Zip Overshirt in Wool Mohair, woven by Vitale Barberis Canonico, Italy. Camp collar with a single cuff one button.",
    tags: ["shirts", "everyday", "wool"],
  },
  {
    slug: "white-classic-collar-shirt",
    name: "White Classic Collar Shirt",
    category: "shirts",
    price: 8900,
    images: [
      "/catalog/noord/white-classic-collar-shirt-1.jpg",
      "/catalog/noord/white-classic-collar-shirt-2.jpg",
    ],
    attributes: {
      fabric: "Pure Cotton",
      composition: "100% Cotton",
      colour: "White",
      mill: "Testa 1919 Srl, Italy",
      collar: "Classic",
      cuff: "Single Cuff",
    },
    description:
      "A Classic Collar Shirt in Pure Cotton, woven by Testa 1919 Srl, Italy. Classic collar with a single cuff.",
    tags: ["shirts", "formal", "cotton"],
  },
  {
    slug: "white-pique-tuxedo-shirt",
    name: "White Piqué Tuxedo Shirt",
    category: "shirts",
    price: 14900,
    images: [
      "/catalog/noord/white-pique-tuxedo-shirt-1.jpg",
      "/catalog/noord/white-pique-tuxedo-shirt-2.jpg",
    ],
    attributes: {
      fabric: "Egyptian Cotton",
      composition: "100% Cotton",
      colour: "White",
      mill: "Testa 1919 Srl, Italy",
      collar: "High Widespread",
      cuff: "Double Cuff",
    },
    description:
      "A Piqué Tuxedo Shirt in Egyptian Cotton, woven by Testa 1919 Srl, Italy. High Widespread collar with a double cuff.",
    tags: ["shirts", "formal", "cotton"],
  },
  {
    slug: "light-blue-cotton-flannel-shirt",
    name: "Light Blue Cotton Flannel Shirt",
    category: "shirts",
    price: 12900,
    images: [
      "/catalog/noord/light-blue-cotton-flannel-shirt-1.jpg",
      "/catalog/noord/light-blue-cotton-flannel-shirt-2.jpg",
    ],
    attributes: {
      fabric: "Egyptian Cotton Flannel",
      composition: "100% Cotton",
      colour: "Light Blue",
      mill: "Beste, Italy",
      collar: "Classic",
      cuff: "Single Cuff",
    },
    description:
      "A Cotton Flannel Shirt in Egyptian Cotton Flannel, woven by Beste, Italy. Classic collar with a single cuff.",
    tags: ["shirts", "everyday", "cotton"],
  },
  {
    slug: "light-brown-straight-leg-suit-trousers",
    name: "Light Brown Straight Leg Suit Trousers",
    category: "trousers",
    price: 17900,
    images: [
      "/catalog/noord/light-brown-straight-leg-suit-trousers-1.jpg",
      "/catalog/noord/light-brown-straight-leg-suit-trousers-2.jpg",
    ],
    attributes: {
      fit: "Straight Leg Milano",
      fabric: "Wrinkle-Free 4-Ply Wool",
      composition: "100% Wool",
      colour: "Light Brown",
      mill: "Rogna, Italy",
    },
    description:
      "A pair of Straight Leg Suit Trousers in Wrinkle-Free 4-Ply Wool, woven by Rogna, Italy. Cut to our Straight Leg Milano.",
    tags: ["trousers", "formal", "wool"],
  },
  {
    slug: "mid-taupe-wide-leg-trousers",
    name: "Mid Taupe Wide Leg Trousers",
    category: "trousers",
    price: 16900,
    images: [
      "/catalog/noord/mid-taupe-wide-leg-trousers-1.jpg",
      "/catalog/noord/mid-taupe-wide-leg-trousers-2.jpg",
    ],
    attributes: {
      fit: "Wide Leg Straight Duca",
      fabric: "Pure Wool",
      composition: "100% Wool",
      colour: "Mid Taupe",
      mill: "Di Sondrio, Italy",
    },
    description:
      "A pair of Wide Leg Trousers in Pure Wool, woven by Di Sondrio, Italy. Cut to our Wide Leg Straight Duca.",
    tags: ["trousers", "everyday", "wool"],
  },
  {
    slug: "navy-wide-leg-tapered-chinos",
    name: "Navy Wide Leg Tapered Chinos",
    category: "trousers",
    price: 11900,
    images: [
      "/catalog/noord/navy-wide-leg-tapered-chinos-1.jpg",
      "/catalog/noord/navy-wide-leg-tapered-chinos-2.jpg",
    ],
    attributes: {
      fit: "Wide Leg Tapered Chinos",
      fabric: "Stretch Cotton",
      composition: "98% Cotton, 2% Elastane",
      colour: "Navy",
      mill: "Cervotessile, Italy",
    },
    description:
      "A pair of Wide Leg Tapered Chinos in Stretch Cotton, woven by Cervotessile, Italy.",
    tags: ["trousers", "everyday", "cotton"],
  },
  {
    slug: "navy-straight-leg-jeans",
    name: "Navy Straight Leg Jeans",
    category: "trousers",
    price: 14900,
    images: [
      "/catalog/noord/navy-straight-leg-jeans-1.jpg",
      "/catalog/noord/navy-straight-leg-jeans-2.jpg",
    ],
    attributes: {
      fabric: "Pure Cotton",
      composition: "100% Cotton",
      colour: "Navy",
      mill: "Candiani, Italy",
    },
    description:
      "A pair of Straight Leg Jeans in Pure Cotton, woven by Candiani, Italy.",
    tags: ["trousers", "everyday", "cotton"],
  },
  {
    slug: "dark-grey-wide-leg-tapered-suit-trousers",
    name: "Dark Grey Wide Leg Tapered Suit Trousers",
    category: "trousers",
    price: 16900,
    images: [
      "/catalog/noord/dark-grey-wide-leg-tapered-suit-trousers-1.jpg",
      "/catalog/noord/dark-grey-wide-leg-tapered-suit-trousers-2.jpg",
    ],
    attributes: {
      fit: "Wide Leg Tapered Firenze",
      fabric: "Pure S120's Wool Flannel",
      composition: "100% Wool",
      colour: "Dark Grey",
      mill: "Vitale Barberis Canonico, Italy",
    },
    description:
      "A pair of Wide Leg Tapered Suit Trousers in Pure S120's Wool Flannel, woven by Vitale Barberis Canonico, Italy. Cut to our Wide Leg Tapered Firenze.",
    tags: ["trousers", "formal", "wool"],
  },
  {
    slug: "dark-grey-wide-leg-trousers",
    name: "Dark Grey Wide Leg Trousers",
    category: "trousers",
    price: 16900,
    images: [
      "/catalog/noord/dark-grey-wide-leg-trousers-1.jpg",
      "/catalog/noord/dark-grey-wide-leg-trousers-2.jpg",
    ],
    attributes: {
      fit: "Wide Leg Straight Duca",
      fabric: "Pure Wool",
      composition: "100% Wool",
      colour: "Dark Grey",
      mill: "Di Sondrio, Italy",
    },
    description:
      "A pair of Wide Leg Trousers in Pure Wool, woven by Di Sondrio, Italy. Cut to our Wide Leg Straight Duca.",
    tags: ["trousers", "everyday", "wool"],
  },
  {
    slug: "navy-slim-leg-chinos",
    name: "Navy Slim Leg Chinos",
    category: "trousers",
    price: 11900,
    images: [
      "/catalog/noord/navy-slim-leg-chinos-1.jpg",
      "/catalog/noord/navy-slim-leg-chinos-2.jpg",
    ],
    attributes: {
      fabric: "Stretch Cotton",
      composition: "98% Cotton, 2% Elastane",
      colour: "Navy",
      mill: "Cervotessile, Italy",
    },
    description:
      "A pair of Slim Leg Chinos in Stretch Cotton, woven by Cervotessile, Italy.",
    tags: ["trousers", "everyday", "cotton"],
  },
  {
    slug: "mid-blue-straight-leg-jeans",
    name: "Mid Blue Straight Leg Jeans",
    category: "trousers",
    price: 14900,
    images: [
      "/catalog/noord/mid-blue-straight-leg-jeans-1.jpg",
      "/catalog/noord/mid-blue-straight-leg-jeans-2.jpg",
    ],
    attributes: {
      fabric: "Selvedge Denim",
      composition: "100% Cotton",
      colour: "Mid Blue",
      mill: "Candiani, Italy",
    },
    description:
      "A pair of Straight Leg Jeans in Selvedge Denim, woven by Candiani, Italy.",
    tags: ["trousers", "everyday", "denim"],
  },
  {
    slug: "off-white-long-sleeve-polo",
    name: "Off-White Long Sleeve Polo",
    category: "knitwear",
    price: 23900,
    images: [
      "/catalog/noord/off-white-long-sleeve-polo-1.jpg",
      "/catalog/noord/off-white-long-sleeve-polo-2.jpg",
    ],
    attributes: {
      fabric: "Pure Cashmere",
      composition: "100% Cashmere",
      colour: "Off-White",
    },
    description:
      "A Long Sleeve Polo in Pure Cashmere.",
    tags: ["knitwear", "everyday", "cashmere"],
  },
  {
    slug: "navy-ribbed-long-sleeve-funnel-neck",
    name: "Navy Ribbed Long Sleeve Funnel-Neck",
    category: "knitwear",
    price: 18900,
    images: [
      "/catalog/noord/navy-ribbed-long-sleeve-funnel-neck-1.jpg",
      "/catalog/noord/navy-ribbed-long-sleeve-funnel-neck-2.jpg",
    ],
    attributes: {
      fabric: "Wool Cashmere",
      composition: "70% Wool, 30% Cashmere",
      colour: "Navy",
    },
    description:
      "A Ribbed Long Sleeve Funnel-Neck in Wool Cashmere.",
    tags: ["knitwear", "everyday", "cashmere"],
  },
  {
    slug: "navy-merino-zip-cardigan",
    name: "Navy Merino Zip Cardigan",
    category: "knitwear",
    price: 17900,
    images: [
      "/catalog/noord/navy-merino-zip-cardigan-1.jpg",
      "/catalog/noord/navy-merino-zip-cardigan-2.jpg",
    ],
    attributes: {
      fabric: "Pure Wool",
      composition: "100% Wool",
      colour: "Navy",
    },
    description:
      "A Merino Zip Cardigan in Pure Wool.",
    tags: ["knitwear", "everyday", "wool"],
  },
  {
    slug: "off-white-short-sleeve-crewneck",
    name: "Off-White Short Sleeve Crewneck",
    category: "knitwear",
    price: 9900,
    images: [
      "/catalog/noord/off-white-short-sleeve-crewneck-1.jpg",
      "/catalog/noord/off-white-short-sleeve-crewneck-2.jpg",
    ],
    attributes: {
      fabric: "Cotton Silk",
      composition: "70% Cotton, 30% Silk",
      colour: "Off-White",
    },
    description:
      "A Short Sleeve Crewneck in Cotton Silk.",
    tags: ["knitwear", "everyday", "cotton"],
  },
  {
    slug: "navy-long-sleeve-polo-cardigan",
    name: "Navy Long Sleeve Polo Cardigan",
    category: "knitwear",
    price: 13900,
    images: [
      "/catalog/noord/navy-long-sleeve-polo-cardigan-1.jpg",
      "/catalog/noord/navy-long-sleeve-polo-cardigan-2.jpg",
    ],
    attributes: {
      fabric: "Pure Wool",
      composition: "100% Wool",
      colour: "Navy",
    },
    description:
      "A Long Sleeve Polo Cardigan in Pure Wool.",
    tags: ["knitwear", "everyday", "wool"],
  },
  {
    slug: "navy-merino-long-sleeve-polo",
    name: "Navy Merino Long Sleeve Polo",
    category: "knitwear",
    price: 10900,
    images: [
      "/catalog/noord/navy-merino-long-sleeve-polo-1.jpg",
      "/catalog/noord/navy-merino-long-sleeve-polo-2.jpg",
    ],
    attributes: {
      fabric: "Pure Wool",
      composition: "100% Wool",
      colour: "Navy",
    },
    description:
      "A Merino Long Sleeve Polo in Pure Wool.",
    tags: ["knitwear", "everyday", "wool"],
  },
  {
    slug: "light-brown-ribbed-henley",
    name: "Light Brown Ribbed Henley",
    category: "knitwear",
    price: 12900,
    images: [
      "/catalog/noord/light-brown-ribbed-henley-1.jpg",
      "/catalog/noord/light-brown-ribbed-henley-2.jpg",
    ],
    attributes: {
      fabric: "Pure Wool",
      composition: "100% Wool",
      colour: "Light Brown",
    },
    description:
      "A Ribbed Henley in Pure Wool.",
    tags: ["knitwear", "everyday", "wool"],
  },
  {
    slug: "mid-brown-ribbed-mouline-zip-cardigan",
    name: "Mid Brown Ribbed Mouliné Zip Cardigan",
    category: "knitwear",
    price: 18900,
    images: [
      "/catalog/noord/mid-brown-ribbed-mouline-zip-cardigan-1.jpg",
      "/catalog/noord/mid-brown-ribbed-mouline-zip-cardigan-2.jpg",
    ],
    attributes: {
      fabric: "Wool Cotton",
      composition: "63% Wool, 37% Cotton",
      colour: "Mid Brown",
    },
    description:
      "A Ribbed Mouliné Zip Cardigan in Wool Cotton.",
    tags: ["knitwear", "everyday", "wool"],
  },
  {
    slug: "black-bomber-jacket-oco10022999",
    name: "Black Bomber Jacket in Wool Blend",
    category: "outerwear",
    price: 39900,
    images: [
      "/catalog/noord/black-bomber-jacket-oco10022999-1.jpg",
      "/catalog/noord/black-bomber-jacket-oco10022999-2.jpg",
    ],
    attributes: {
      fabric: "Wool Blend",
      composition: "99% Wool, 1% Polyamide",
      colour: "Black",
      mill: "ARCHé, Italy",
    },
    description:
      "A Bomber Jacket in Wool Blend, woven by ARCHé, Italy.",
    tags: ["outerwear", "everyday", "wool"],
  },
  {
    slug: "navy-overcoat",
    name: "Navy Overcoat",
    category: "outerwear",
    price: 44900,
    images: [
      "/catalog/noord/navy-overcoat-1.jpg",
      "/catalog/noord/navy-overcoat-2.jpg",
    ],
    attributes: {
      fabric: "Pure Wool",
      composition: "100% Wool",
      colour: "Navy",
      mill: "Angelico, Italy",
    },
    description:
      "An Overcoat in Pure Wool, woven by Angelico, Italy.",
    tags: ["outerwear", "everyday", "wool"],
  },
  {
    slug: "navy-padded-zip-vest",
    name: "Navy Padded Zip Vest",
    category: "outerwear",
    price: 34900,
    images: [
      "/catalog/noord/navy-padded-zip-vest-1.jpg",
      "/catalog/noord/navy-padded-zip-vest-2.jpg",
    ],
    attributes: {
      fabric: "Pure Cashmere",
      composition: "100% Cashmere",
      colour: "Navy",
      mill: "Colombo, Italy",
    },
    description:
      "A Padded Zip Vest in Pure Cashmere, woven by Colombo, Italy.",
    tags: ["outerwear", "everyday", "cashmere"],
  },
  {
    slug: "taupe-field-jacket",
    name: "Taupe Field Jacket",
    category: "outerwear",
    price: 29900,
    images: [
      "/catalog/noord/taupe-field-jacket-1.jpg",
      "/catalog/noord/taupe-field-jacket-2.jpg",
    ],
    attributes: {
      fabric: "Technical Fabric",
      composition: "100% Polyamide",
      colour: "Taupe",
      mill: "Majocchi, Italy",
    },
    description:
      "A Field Jacket in Technical Fabric, woven by Majocchi, Italy.",
    tags: ["outerwear", "everyday"],
  },
  {
    slug: "navy-raincoat",
    name: "Navy Raincoat",
    category: "outerwear",
    price: 34900,
    images: [
      "/catalog/noord/navy-raincoat-1.jpg",
      "/catalog/noord/navy-raincoat-2.jpg",
    ],
    attributes: {
      fabric: "Water-Repellent Wool Polyurethane",
      composition: "75% Wool, 25% Polyurethane",
      colour: "Navy",
      mill: "Vitale Barberis Canonico, Italy",
    },
    description:
      "A Raincoat in Water-Repellent Wool Polyurethane, woven by Vitale Barberis Canonico, Italy.",
    tags: ["outerwear", "everyday", "wool"],
  },
  {
    slug: "black-shirt-jacket",
    name: "Black Shirt-Jacket",
    category: "outerwear",
    price: 27900,
    images: [
      "/catalog/noord/black-shirt-jacket-1.jpg",
      "/catalog/noord/black-shirt-jacket-2.jpg",
    ],
    attributes: {
      fabric: "Pure Wool",
      composition: "100% Wool",
      colour: "Black",
      mill: "Longda, China Mainland",
    },
    description:
      "A Shirt-Jacket in Pure Wool, woven by Longda, China Mainland.",
    tags: ["outerwear", "everyday", "wool"],
  },
  {
    slug: "black-peacoat",
    name: "Black Peacoat",
    category: "outerwear",
    price: 39900,
    images: [
      "/catalog/noord/black-peacoat-1.jpg",
      "/catalog/noord/black-peacoat-2.jpg",
    ],
    attributes: {
      fabric: "Pure Wool",
      composition: "100% Wool",
      colour: "Black",
      mill: "Longda, China Mainland",
    },
    description:
      "A Peacoat in Pure Wool, woven by Longda, China Mainland.",
    tags: ["outerwear", "everyday", "wool"],
  },
  {
    slug: "black-bomber-jacket-j1061",
    name: "Black Bomber Jacket in Pure Wool",
    category: "outerwear",
    price: 37900,
    images: [
      "/catalog/noord/black-bomber-jacket-j1061-1.jpg",
      "/catalog/noord/black-bomber-jacket-j1061-2.jpg",
    ],
    attributes: {
      fabric: "Pure Wool",
      composition: "100% Wool",
      colour: "Black",
      mill: "Longda, China Mainland",
    },
    description:
      "A Bomber Jacket in Pure Wool, woven by Longda, China Mainland.",
    tags: ["outerwear", "everyday", "wool"],
  },
  {
    slug: "black-penny-loafer",
    name: "Black Penny Loafer",
    category: "shoes",
    price: 22900,
    images: [
      "/catalog/noord/black-penny-loafer-1.jpg",
      "/catalog/noord/black-penny-loafer-2.jpg",
    ],
    attributes: {
      fabric: "Leather",
      colour: "Black",
      sole: "Leather",
      construction: "Blake-Stitched",
    },
    description:
      "A Penny Loafer in Leather. Leather sole, blake-stitched construction.",
    tags: ["shoes", "everyday", "leather"],
  },
  {
    slug: "dark-brown-oxford",
    name: "Dark Brown Oxford",
    category: "shoes",
    price: 22900,
    images: [
      "/catalog/noord/dark-brown-oxford-1.jpg",
      "/catalog/noord/dark-brown-oxford-2.jpg",
    ],
    attributes: {
      fabric: "Leather",
      colour: "Dark Brown",
      sole: "Leather",
      construction: "Blake-Stitched",
    },
    description:
      "An Oxford in Leather. Leather sole, blake-stitched construction.",
    tags: ["shoes", "formal", "leather"],
  },
  {
    slug: "black-sneaker",
    name: "Black Sneaker",
    category: "shoes",
    price: 14900,
    images: [
      "/catalog/noord/black-sneaker-1.jpg",
      "/catalog/noord/black-sneaker-2.jpg",
    ],
    attributes: {
      fabric: "Suede & Technical Fabric",
      colour: "Black",
      lining: "Suede Black",
      sole: "Rubber",
      construction: "Cemented",
    },
    description:
      "A Sneaker in Suede & Technical Fabric. Rubber sole, cemented construction.",
    tags: ["shoes", "everyday", "suede"],
  },
  {
    slug: "black-boot",
    name: "Black Boot",
    category: "shoes",
    price: 29900,
    images: [
      "/catalog/noord/black-boot-1.jpg",
      "/catalog/noord/black-boot-2.jpg",
    ],
    attributes: {
      fabric: "Leather",
      colour: "Black",
      lining: "Calf (lining) Black",
      sole: "Leather",
      construction: "Blake-Stitched",
    },
    description:
      "A Boot in Leather. Leather sole, blake-stitched construction.",
    tags: ["shoes", "everyday", "leather"],
  },
  {
    slug: "black-tuxedo-slip-on",
    name: "Black Tuxedo Slip-On",
    category: "shoes",
    price: 24900,
    images: [
      "/catalog/noord/black-tuxedo-slip-on-1.jpg",
      "/catalog/noord/black-tuxedo-slip-on-2.jpg",
    ],
    attributes: {
      fabric: "Cotton Velvet",
      colour: "Black",
      sole: "Leather",
      construction: "Blake-Stitched",
    },
    description:
      "A Tuxedo Slip-On in Cotton Velvet. Leather sole, blake-stitched construction.",
    tags: ["shoes", "everyday", "cotton"],
  },
  {
    slug: "brown-derby",
    name: "Brown Derby",
    category: "shoes",
    price: 27900,
    images: [
      "/catalog/noord/brown-derby-1.jpg",
      "/catalog/noord/brown-derby-2.jpg",
    ],
    attributes: {
      fabric: "Italian Calf Leather",
      colour: "Brown",
      lining: "Calf Leather",
      sole: "Leather",
      construction: "Blake",
    },
    description:
      "A Derby in Italian Calf Leather. Leather sole, blake construction.",
    tags: ["shoes", "formal", "leather"],
  },
  {
    slug: "off-white-slide",
    name: "Off-White Slide",
    category: "shoes",
    price: 19900,
    images: [
      "/catalog/noord/off-white-slide-1.jpg",
      "/catalog/noord/off-white-slide-2.jpg",
    ],
    attributes: {
      fabric: "Suede",
      colour: "Off-White",
      lining: "Calf Leather",
      sole: "Rubber",
      construction: "Cemented",
    },
    description:
      "A Slide in Suede. Rubber sole, cemented construction.",
    tags: ["shoes", "everyday", "suede"],
  },
  {
    slug: "black-tassel-loafer",
    name: "Black Tassel Loafer",
    category: "shoes",
    price: 22900,
    images: [
      "/catalog/noord/black-tassel-loafer-1.jpg",
      "/catalog/noord/black-tassel-loafer-2.jpg",
    ],
    attributes: {
      fabric: "Italian Calf Leather",
      colour: "Black",
      lining: "Calf Leather",
      sole: "Leather",
      construction: "Goodyear",
    },
    description:
      "A Tassel Loafer in Italian Calf Leather. Leather sole, goodyear construction.",
    tags: ["shoes", "everyday", "leather"],
  },
  {
    slug: "dark-brown-gloves",
    name: "Dark Brown Gloves",
    category: "accessories",
    price: 9900,
    images: [
      "/catalog/noord/dark-brown-gloves-1.jpg",
      "/catalog/noord/dark-brown-gloves-2.jpg",
    ],
    attributes: {
      fabric: "Leather",
      composition: "100% Leather",
      colour: "Dark Brown",
    },
    description:
      "A pair of Gloves in Leather.",
    tags: ["accessory", "everyday", "leather"],
  },
  {
    slug: "black-scarf",
    name: "Black Scarf",
    category: "accessories",
    price: 15900,
    images: [
      "/catalog/noord/black-scarf-1.jpg",
      "/catalog/noord/black-scarf-2.jpg",
    ],
    attributes: {
      fabric: "Pure Cashmere",
      composition: "100% Cashmere",
      colour: "Black",
    },
    description:
      "A Scarf in Pure Cashmere.",
    tags: ["accessory", "everyday", "cashmere"],
  },
  {
    slug: "black-belt",
    name: "Black Belt",
    category: "accessories",
    price: 7900,
    images: [
      "/catalog/noord/black-belt-1.jpg",
      "/catalog/noord/black-belt-2.jpg",
    ],
    attributes: {
      fabric: "Italian Cow Leather",
      colour: "Black",
      width: "3 cm",
    },
    description:
      "A Belt in Italian Cow Leather. 3 cm wide.",
    tags: ["accessory", "everyday", "leather"],
  },
  {
    slug: "light-blue-beanie",
    name: "Light Blue Beanie",
    category: "accessories",
    price: 7900,
    images: [
      "/catalog/noord/light-blue-beanie-1.jpg",
      "/catalog/noord/light-blue-beanie-2.jpg",
    ],
    attributes: {
      fabric: "Wool Cashmere",
      composition: "70% Wool, 30% Cashmere",
      colour: "Light Blue",
    },
    description:
      "A Beanie in Wool Cashmere.",
    tags: ["accessory", "everyday", "cashmere"],
  },
  {
    slug: "black-suspenders",
    name: "Black Suspenders",
    category: "accessories",
    price: 5900,
    images: [
      "/catalog/noord/black-suspenders-1.jpg",
      "/catalog/noord/black-suspenders-2.jpg",
    ],
    attributes: {
      fabric: "Polyester Blend & Leather",
      composition: "80% Polyester, 15% Cowhide, 5% Elastane",
      colour: "Black",
      mill: "Gigidue, Italy",
    },
    description:
      "A pair of Suspenders in Polyester Blend & Leather, woven by Gigidue, Italy.",
    tags: ["accessory", "formal", "leather"],
  },
  {
    slug: "black-self-tie-bow-tie",
    name: "Black Self-tie Bow Tie",
    category: "accessories",
    price: 2900,
    images: [
      "/catalog/noord/black-self-tie-bow-tie-1.jpg",
      "/catalog/noord/black-self-tie-bow-tie-2.jpg",
    ],
    attributes: {
      fabric: "Pure Silk",
      composition: "100% Silk",
      colour: "Black",
    },
    description:
      "A Self-tie Bow Tie in Pure Silk.",
    tags: ["accessory", "formal", "silk"],
  },
  {
    slug: "black-regular-socks",
    name: "Black Regular Socks",
    category: "accessories",
    price: 1200,
    images: [
      "/catalog/noord/black-regular-socks-1.jpg",
      "/catalog/noord/black-regular-socks-2.jpg",
    ],
    attributes: {
      fabric: "Pure Cotton",
      composition: "100% Cotton",
      colour: "Black",
    },
    description:
      "A pair of Regular Socks in Pure Cotton.",
    tags: ["accessory", "everyday", "cotton"],
  },
  {
    slug: "white-pocket-square",
    name: "White Pocket Square",
    category: "accessories",
    price: 2900,
    images: [
      "/catalog/noord/white-pocket-square-1.jpg",
      "/catalog/noord/white-pocket-square-2.jpg",
    ],
    attributes: {
      fabric: "Pure Silk",
      composition: "100% Silk",
      colour: "White",
    },
    description:
      "A Pocket Square in Pure Silk.",
    tags: ["accessory", "formal", "silk"],
  },
  {
    slug: "navy-tailored-fit-havana-suit-c5778-s4",
    name: "Navy Tailored Fit Havana Suit in Pure S110's Wool",
    category: "suits",
    price: 54800,
    images: [
      "/catalog/noord/navy-tailored-fit-havana-suit-c5778-s4-1.jpg",
      "/catalog/noord/navy-tailored-fit-havana-suit-c5778-s4-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Havana",
      trousers: "Straight Leg Milano",
      fabric: "Pure S110's Wool",
      composition: "100% Wool",
      colour: "Navy",
      mill: "Vitale Barberis Canonico, Italy",
    },
    description:
      "A two-piece Havana suit in Pure S110's Wool, woven by Vitale Barberis Canonico, Italy. Tailored fit through the jacket, with straight leg Milano trousers.",
    tags: ["formal", "wool", "tailoring"],
  },
  {
    slug: "navy-tailored-fit-havana-suit-c6634-s2",
    name: "Navy Tailored Fit Havana Suit in Pure S110's Wool",
    category: "suits",
    price: 54800,
    images: [
      "/catalog/noord/navy-tailored-fit-havana-suit-c6634-s2-1.jpg",
      "/catalog/noord/navy-tailored-fit-havana-suit-c6634-s2-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Havana",
      trousers: "Straight Leg Milano",
      fabric: "Pure S110's Wool",
      composition: "100% Wool",
      colour: "Navy",
      mill: "Vitale Barberis Canonico, Italy",
    },
    description:
      "A two-piece Havana suit in Pure S110's Wool, woven by Vitale Barberis Canonico, Italy. Tailored fit through the jacket, with straight leg Milano trousers.",
    tags: ["formal", "wool", "tailoring"],
  },
  {
    slug: "navy-tailored-fit-havana-suit-jacket-c6860",
    name: "Navy Tailored Fit Havana Suit Jacket in Wrinkle-Free 4-Ply Wool",
    category: "jackets",
    price: 44900,
    images: [
      "/catalog/noord/navy-tailored-fit-havana-suit-jacket-c6860-1.jpg",
      "/catalog/noord/navy-tailored-fit-havana-suit-jacket-c6860-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Havana",
      fabric: "Wrinkle-Free 4-Ply Wool",
      composition: "100% Wool",
      colour: "Navy",
      mill: "Rogna, Italy",
    },
    description:
      "A Havana suit jacket in Wrinkle-Free 4-Ply Wool, woven by Rogna, Italy. Tailored fit, and sold on its own so it works as a blazer with odd trousers.",
    tags: ["formal", "wool", "jacket"],
  },
  {
    slug: "navy-tailored-fit-havana-suit-jacket-c6861",
    name: "Navy Tailored Fit Havana Suit Jacket in Wrinkle-Free 4-Ply Wool",
    category: "jackets",
    price: 44900,
    images: [
      "/catalog/noord/navy-tailored-fit-havana-suit-jacket-c6861-1.jpg",
      "/catalog/noord/navy-tailored-fit-havana-suit-jacket-c6861-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Havana",
      fabric: "Wrinkle-Free 4-Ply Wool",
      composition: "100% Wool",
      colour: "Navy",
      mill: "Rogna, Italy",
    },
    description:
      "A Havana suit jacket in Wrinkle-Free 4-Ply Wool, woven by Rogna, Italy. Tailored fit, and sold on its own so it works as a blazer with odd trousers.",
    tags: ["formal", "wool", "jacket"],
  },
  {
    slug: "dark-grey-perennial-tailored-fit-havana-suit-jacket",
    name: "Dark Grey Perennial Tailored Fit Havana Suit Jacket",
    category: "jackets",
    price: 26900,
    images: [
      "/catalog/noord/dark-grey-perennial-tailored-fit-havana-suit-jacket-1.jpg",
      "/catalog/noord/dark-grey-perennial-tailored-fit-havana-suit-jacket-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Havana",
      fabric: "Pure Tropical Wool",
      composition: "100% Wool",
      colour: "Dark Grey",
      mill: "Vitale Barberis Canonico, Italy",
    },
    description:
      "A Havana suit jacket in Pure Tropical Wool, woven by Vitale Barberis Canonico, Italy. Tailored fit, and sold on its own so it works as a blazer with odd trousers.",
    tags: ["formal", "wool", "jacket"],
  },
  {
    slug: "dark-grey-perennial-tailored-fit-havana-suit",
    name: "Dark Grey Perennial Tailored Fit Havana Suit",
    category: "suits",
    price: 39800,
    images: [
      "/catalog/noord/dark-grey-perennial-tailored-fit-havana-suit-1.jpg",
      "/catalog/noord/dark-grey-perennial-tailored-fit-havana-suit-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Havana",
      trousers: "Straight Leg Milano",
      fabric: "Pure Tropical Wool",
      composition: "100% Wool",
      colour: "Dark Grey",
      mill: "Vitale Barberis Canonico, Italy",
    },
    description:
      "A two-piece Havana suit in Pure Tropical Wool, woven by Vitale Barberis Canonico, Italy. Tailored fit through the jacket, with straight leg Milano trousers.",
    tags: ["formal", "wool", "tailoring"],
  },
  {
    slug: "navy-perennial-tailored-fit-havana-suit-jacket",
    name: "Navy Perennial Tailored Fit Havana Suit Jacket",
    category: "jackets",
    price: 26900,
    images: [
      "/catalog/noord/navy-perennial-tailored-fit-havana-suit-jacket-1.jpg",
      "/catalog/noord/navy-perennial-tailored-fit-havana-suit-jacket-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Havana",
      fabric: "Pure Tropical Wool",
      composition: "100% Wool",
      colour: "Navy",
      mill: "Vitale Barberis Canonico, Italy",
    },
    description:
      "A Havana suit jacket in Pure Tropical Wool, woven by Vitale Barberis Canonico, Italy. Tailored fit, and sold on its own so it works as a blazer with odd trousers.",
    tags: ["formal", "wool", "jacket"],
  },
  {
    slug: "navy-perennial-tailored-fit-havana-suit-c9669-s",
    name: "Navy Perennial Tailored Fit Havana Suit in Pure Tropical Wool",
    category: "suits",
    price: 39800,
    images: [
      "/catalog/noord/navy-perennial-tailored-fit-havana-suit-c9669-s-1.jpg",
      "/catalog/noord/navy-perennial-tailored-fit-havana-suit-c9669-s-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Havana",
      trousers: "Straight Leg Milano",
      fabric: "Pure Tropical Wool",
      composition: "100% Wool",
      colour: "Navy",
      mill: "Vitale Barberis Canonico, Italy",
    },
    description:
      "A two-piece Havana suit in Pure Tropical Wool, woven by Vitale Barberis Canonico, Italy. Tailored fit through the jacket, with straight leg Milano trousers.",
    tags: ["formal", "wool", "tailoring"],
  },
  {
    slug: "navy-tailored-fit-havana-suit-p6948",
    name: "Navy Tailored Fit Havana Suit in Pure S150's Wool",
    category: "suits",
    price: 89900,
    images: [
      "/catalog/noord/navy-tailored-fit-havana-suit-p6948-1.jpg",
      "/catalog/noord/navy-tailored-fit-havana-suit-p6948-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Havana",
      trousers: "Straight Leg Milano",
      fabric: "Pure S150's Wool",
      composition: "100% Wool",
      colour: "Navy",
      mill: "E.Thomas, Italy",
    },
    description:
      "A two-piece Havana suit in Pure S150's Wool, woven by E.Thomas, Italy. Tailored fit through the jacket, with straight leg Milano trousers.",
    tags: ["formal", "wool", "tailoring"],
  },
  {
    slug: "dark-brown-tailored-fit-milano-suit-p6952",
    name: "Dark Brown Tailored Fit Milano Suit in Wool Mohair",
    category: "suits",
    price: 62900,
    images: [
      "/catalog/noord/dark-brown-tailored-fit-milano-suit-p6952-1.jpg",
      "/catalog/noord/dark-brown-tailored-fit-milano-suit-p6952-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Milano",
      trousers: "Straight Leg Milano",
      fabric: "Wool Mohair",
      composition: "73% Wool, 27% Mohair",
      colour: "Dark Brown",
      mill: "Vitale Barberis Canonico, Italy",
    },
    description:
      "A two-piece Milano suit in Wool Mohair, woven by Vitale Barberis Canonico, Italy. Tailored fit through the jacket, with straight leg Milano trousers.",
    tags: ["formal", "wool", "tailoring"],
  },
  {
    slug: "black-tailored-fit-milano-suit",
    name: "Black Tailored Fit Milano Suit",
    category: "suits",
    price: 62900,
    images: [
      "/catalog/noord/black-tailored-fit-milano-suit-1.jpg",
      "/catalog/noord/black-tailored-fit-milano-suit-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Milano",
      trousers: "Straight Leg Milano",
      fabric: "Wool Mohair",
      composition: "73% Wool, 27% Mohair",
      colour: "Black",
      mill: "Vitale Barberis Canonico, Italy",
    },
    description:
      "A two-piece Milano suit in Wool Mohair, woven by Vitale Barberis Canonico, Italy. Tailored fit through the jacket, with straight leg Milano trousers.",
    tags: ["formal", "wool", "tailoring"],
  },
  {
    slug: "navy-perennial-tailored-fit-havana-suit-p7272",
    name: "Navy Perennial Tailored Fit Havana Suit in Pure Tropical Wool",
    category: "suits",
    price: 39900,
    images: [
      "/catalog/noord/navy-perennial-tailored-fit-havana-suit-p7272-1.jpg",
      "/catalog/noord/navy-perennial-tailored-fit-havana-suit-p7272-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Havana",
      trousers: "Straight Leg Milano",
      fabric: "Pure Tropical Wool",
      composition: "100% Wool",
      colour: "Navy",
      mill: "Vitale Barberis Canonico, Italy",
    },
    description:
      "A two-piece Havana suit in Pure Tropical Wool, woven by Vitale Barberis Canonico, Italy. Tailored fit through the jacket, with straight leg Milano trousers.",
    tags: ["formal", "wool", "tailoring"],
  },
  {
    slug: "dark-green-perennial-tailored-fit-havana-suit",
    name: "Dark Green Perennial Tailored Fit Havana Suit",
    category: "suits",
    price: 39900,
    images: [
      "/catalog/noord/dark-green-perennial-tailored-fit-havana-suit-1.jpg",
      "/catalog/noord/dark-green-perennial-tailored-fit-havana-suit-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Havana",
      trousers: "Straight Leg Milano",
      fabric: "Pure Tropical Wool",
      composition: "100% Wool",
      colour: "Dark Green",
      mill: "Vitale Barberis Canonico, Italy",
    },
    description:
      "A two-piece Havana suit in Pure Tropical Wool, woven by Vitale Barberis Canonico, Italy. Tailored fit through the jacket, with straight leg Milano trousers.",
    tags: ["formal", "wool", "tailoring"],
  },
  {
    slug: "dark-brown-tailored-fit-milano-suit-smm10005b01",
    name: "Dark Brown Tailored Fit Milano Suit in Wrinkle-Free 4-Ply Wool",
    category: "suits",
    price: 62800,
    images: [
      "/catalog/noord/dark-brown-tailored-fit-milano-suit-smm10005b01-1.jpg",
      "/catalog/noord/dark-brown-tailored-fit-milano-suit-smm10005b01-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Milano",
      trousers: "Straight Leg Milano",
      fabric: "Wrinkle-Free 4-Ply Wool",
      composition: "100% Wool",
      colour: "Dark Brown",
      mill: "Rogna, Italy",
    },
    description:
      "A two-piece Milano suit in Wrinkle-Free 4-Ply Wool, woven by Rogna, Italy. Tailored fit through the jacket, with straight leg Milano trousers.",
    tags: ["formal", "wool", "tailoring"],
  },
  {
    slug: "mid-blue-tailored-fit-milano-suit",
    name: "Mid Blue Tailored Fit Milano Suit",
    category: "suits",
    price: 64900,
    images: [
      "/catalog/noord/mid-blue-tailored-fit-milano-suit-1.jpg",
      "/catalog/noord/mid-blue-tailored-fit-milano-suit-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Milano",
      trousers: "Wide Leg Straight Duca",
      fabric: "Wool Blend",
      composition: "67% Wool, 33% Viscose",
      colour: "Mid Blue",
      mill: "Beste, Italy",
    },
    description:
      "A two-piece Milano suit in Wool Blend, woven by Beste, Italy. Tailored fit through the jacket, with wide leg straight Duca trousers.",
    tags: ["formal", "wool", "tailoring"],
  },
  {
    slug: "mid-blue-checked-perennial-tailored-fit-havana-suit",
    name: "Mid Blue Checked Perennial Tailored Fit Havana Suit",
    category: "suits",
    price: 39900,
    images: [
      "/catalog/noord/mid-blue-checked-perennial-tailored-fit-havana-suit-1.jpg",
      "/catalog/noord/mid-blue-checked-perennial-tailored-fit-havana-suit-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Havana",
      trousers: "Straight Leg Milano",
      fabric: "Pure Tropical Wool",
      composition: "100% Wool",
      colour: "Mid Blue",
      mill: "Vitale Barberis Canonico, Italy",
    },
    description:
      "A two-piece Havana suit in Pure Tropical Wool, woven by Vitale Barberis Canonico, Italy. Tailored fit through the jacket, with straight leg Milano trousers. The cloth carries a checked pattern.",
    tags: ["formal", "wool", "tailoring", "checked"],
  },
  {
    slug: "mid-grey-checked-perennial-tailored-fit-havana-suit",
    name: "Mid Grey Checked Perennial Tailored Fit Havana Suit",
    category: "suits",
    price: 39900,
    images: [
      "/catalog/noord/mid-grey-checked-perennial-tailored-fit-havana-suit-1.jpg",
      "/catalog/noord/mid-grey-checked-perennial-tailored-fit-havana-suit-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Havana",
      trousers: "Straight Leg Milano",
      fabric: "Pure Tropical Wool",
      composition: "100% Wool",
      colour: "Mid Grey",
      mill: "Vitale Barberis Canonico, Italy",
    },
    description:
      "A two-piece Havana suit in Pure Tropical Wool, woven by Vitale Barberis Canonico, Italy. Tailored fit through the jacket, with straight leg Milano trousers. The cloth carries a checked pattern.",
    tags: ["formal", "wool", "tailoring", "checked"],
  },
  {
    slug: "navy-houndstooth-perennial-tailored-fit-havana-suit",
    name: "Navy Houndstooth Perennial Tailored Fit Havana Suit",
    category: "suits",
    price: 39900,
    images: [
      "/catalog/noord/navy-houndstooth-perennial-tailored-fit-havana-suit-1.jpg",
      "/catalog/noord/navy-houndstooth-perennial-tailored-fit-havana-suit-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Havana",
      trousers: "Straight Leg Milano",
      fabric: "Pure Tropical Wool",
      composition: "100% Wool",
      colour: "Navy",
      mill: "Vitale Barberis Canonico, Italy",
    },
    description:
      "A two-piece Havana suit in Pure Tropical Wool, woven by Vitale Barberis Canonico, Italy. Tailored fit through the jacket, with straight leg Milano trousers. The cloth carries a houndstooth pattern.",
    tags: ["formal", "wool", "tailoring", "houndstooth"],
  },
  {
    slug: "light-brown-perennial-tailored-fit-havana-suit",
    name: "Light Brown Perennial Tailored Fit Havana Suit",
    category: "suits",
    price: 39900,
    images: [
      "/catalog/noord/light-brown-perennial-tailored-fit-havana-suit-1.jpg",
      "/catalog/noord/light-brown-perennial-tailored-fit-havana-suit-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Havana",
      trousers: "Straight Leg Milano",
      fabric: "Pure Tropical Wool",
      composition: "100% Wool",
      colour: "Light Brown",
      mill: "Vitale Barberis Canonico, Italy",
    },
    description:
      "A two-piece Havana suit in Pure Tropical Wool, woven by Vitale Barberis Canonico, Italy. Tailored fit through the jacket, with straight leg Milano trousers.",
    tags: ["formal", "wool", "tailoring"],
  },
  {
    slug: "dark-green-tailored-fit-milano-suit",
    name: "Dark Green Tailored Fit Milano Suit",
    category: "suits",
    price: 64900,
    images: [
      "/catalog/noord/dark-green-tailored-fit-milano-suit-1.jpg",
      "/catalog/noord/dark-green-tailored-fit-milano-suit-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Milano",
      trousers: "Straight Leg Milano",
      fabric: "Pure S120's Wool",
      composition: "100% Wool",
      colour: "Dark Green",
      mill: "E.Thomas, Italy",
    },
    description:
      "A two-piece Milano suit in Pure S120's Wool, woven by E.Thomas, Italy. Tailored fit through the jacket, with straight leg Milano trousers.",
    tags: ["formal", "wool", "tailoring"],
  },
  {
    slug: "dark-red-relaxed-fit-roma-suit",
    name: "Dark Red Relaxed Fit Roma Suit",
    category: "suits",
    price: 64900,
    images: [
      "/catalog/noord/dark-red-relaxed-fit-roma-suit-1.jpg",
      "/catalog/noord/dark-red-relaxed-fit-roma-suit-2.jpg",
    ],
    attributes: {
      fit: "Relaxed Fit Roma",
      trousers: "Wide Leg Straight Duca",
      fabric: "Pure Wool",
      composition: "100% Wool",
      colour: "Dark Red",
      mill: "Botto Giuseppe, Italy",
    },
    description:
      "A two-piece Roma suit in Pure Wool, woven by Botto Giuseppe, Italy. Relaxed fit through the jacket, with wide leg straight Duca trousers.",
    tags: ["formal", "wool", "tailoring"],
  },
  {
    slug: "mid-brown-tailored-fit-milano-suit",
    name: "Mid Brown Tailored Fit Milano Suit",
    category: "suits",
    price: 64900,
    images: [
      "/catalog/noord/mid-brown-tailored-fit-milano-suit-1.jpg",
      "/catalog/noord/mid-brown-tailored-fit-milano-suit-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Milano",
      trousers: "Wide Leg Straight Duca",
      fabric: "Pure Wool",
      composition: "100% Wool",
      colour: "Mid Brown",
      mill: "Subalpino, Italy",
    },
    description:
      "A two-piece Milano suit in Pure Wool, woven by Subalpino, Italy. Tailored fit through the jacket, with wide leg straight Duca trousers.",
    tags: ["formal", "wool", "tailoring"],
  },
  {
    slug: "navy-striped-tailored-fit-milano-suit",
    name: "Navy Striped Tailored Fit Milano Suit",
    category: "suits",
    price: 64900,
    images: [
      "/catalog/noord/navy-striped-tailored-fit-milano-suit-1.jpg",
      "/catalog/noord/navy-striped-tailored-fit-milano-suit-2.jpg",
    ],
    attributes: {
      fit: "Tailored Fit Milano",
      trousers: "Straight Leg Milano",
      fabric: "Pure Wool",
      composition: "100% Wool",
      colour: "Navy",
      mill: "Opera Piemontese, Italy",
    },
    description:
      "A two-piece Milano suit in Pure Wool, woven by Opera Piemontese, Italy. Tailored fit through the jacket, with straight leg Milano trousers. The cloth carries a striped pattern.",
    tags: ["formal", "wool", "tailoring", "striped"],
  },
  {
    slug: "navy-herringbone-relaxed-fit-roma-suit",
    name: "Navy Herringbone Relaxed Fit Roma Suit",
    category: "suits",
    price: 64900,
    images: [
      "/catalog/noord/navy-herringbone-relaxed-fit-roma-suit-1.jpg",
      "/catalog/noord/navy-herringbone-relaxed-fit-roma-suit-2.jpg",
    ],
    attributes: {
      fit: "Relaxed Fit Roma",
      trousers: "Wide Leg Straight Duca",
      fabric: "Pure Wool",
      composition: "100% Wool",
      colour: "Navy",
      mill: "Cerruti, Italy",
    },
    description:
      "A two-piece Roma suit in Pure Wool, woven by Cerruti, Italy. Relaxed fit through the jacket, with wide leg straight Duca trousers. The cloth carries a herringbone pattern.",
    tags: ["formal", "wool", "tailoring", "herringbone"],
  },
  {
    slug: "light-blue-striped-shirt",
    name: "Light Blue Striped Widespread Collar Shirt",
    category: "shirts",
    price: 11900,
    images: [
      "/catalog/noord/light-blue-striped-shirt-1.jpg",
      "/catalog/noord/light-blue-striped-shirt-2.jpg",
    ],
    attributes: {
      fabric: "Egyptian cotton",
      colour: "Light blue",
      collar: "Classic widespread",
      cuff: "Single cuff",
      mill: "Albini, Italy",
    },
    description:
      "A striped poplin shirt woven by Albini in Italy. The widespread collar holds its shape under a jacket and the single cuff keeps the sleeve clean.",
    tags: ["formal", "everyday", "cotton"],
  },
]
