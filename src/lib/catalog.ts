/**
 * Source catalogue for AUREL. This data seeds the `products` table on a fresh
 * database and acts as an offline fallback if the database is unreachable.
 */

export type Category = "women" | "men" | "accessories";
export type CollectionSlug = "atelier-tailoring" | "soft-structure" | "night-archive";

export type ProductColor = { name: string; hex: string };

export type Product = {
  slug: string;
  name: string;
  category: Category;
  collection: CollectionSlug;
  kind: string;
  /** Price in cents */
  price: number;
  colors: ProductColor[];
  sizes: string[];
  images: string[];
  description: string;
  details: string[];
  isNew: boolean;
};

export const CATEGORY_LABEL: Record<Category, string> = {
  women: "Women",
  men: "Men",
  accessories: "Accessories",
};

export const CATEGORY_SLUGS: Category[] = ["women", "men", "accessories"];

export const COLLECTION_LABEL: Record<CollectionSlug, string> = {
  "atelier-tailoring": "Atelier Tailoring",
  "soft-structure": "Soft Structure",
  "night-archive": "Night Archive",
};

export type CollectionInfo = {
  slug: CollectionSlug;
  name: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const COLLECTIONS: CollectionInfo[] = [
  {
    slug: "atelier-tailoring",
    name: "Atelier Tailoring",
    tagline: "Precision-cut, built to hold its line",
    description:
      "Sharp-shouldered coats, pressed trousers and structured leather goods cut from traceable European wool. The backbone of the AUREL wardrobe.",
    image: "/images/col-atelier.jpg",
    imageAlt: "Two men in taupe double-breasted tailoring photographed on the street",
  },
  {
    slug: "soft-structure",
    name: "Soft Structure",
    tagline: "Everyday architecture in knit and crepe",
    description:
      "Cashmere knits, unlined jackets and relaxed blazers that keep their shape while letting the body move. Made to be worn on repeat.",
    image: "/images/col-soft.jpg",
    imageAlt: "Two models in beige turtlenecks and black trousers against a linen backdrop",
  },
  {
    slug: "night-archive",
    name: "Night Archive",
    tagline: "After dark, sharper",
    description:
      "Leather, deep black wool and hard light. Twelve pieces built for the hours the city keeps, cut close and finished by hand.",
    image: "/images/col-night.jpg",
    imageAlt: "Model in a black shirt and leather jacket against a dark studio backdrop",
  },
];

export type CategoryInfo = {
  slug: Category;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  gridClass: string;
};

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "women",
    name: "Women",
    description:
      "Sculpted outerwear, fluid tailoring and second-skin cashmere — the women's collection is cut to move with you.",
    image: "/images/cat-women.jpg",
    imageAlt: "Woman wearing a camel belted trench coat over a black dress",
    gridClass: "md:col-span-5",
  },
  {
    slug: "men",
    name: "Men",
    description:
      "Double-faced overcoats, relaxed tailoring and knitwear with weight — considered menswear made to be kept for decades.",
    image: "/images/cat-men.jpg",
    imageAlt: "Man wearing a camel overcoat over a navy waistcoat and white shirt",
    gridClass: "md:col-span-4",
  },
  {
    slug: "accessories",
    name: "Accessories",
    description:
      "Vegetable-tanned leather goods, sculptural eyewear and the small pieces that finish a look.",
    image: "/images/cat-accessories.jpg",
    imageAlt: "Three leather top-handle bags arranged on a grey studio set",
    gridClass: "md:col-span-3",
  },
];

const P = "/images/products/";

const color = (name: string, hex: string): ProductColor => ({ name, hex });
export const COLORS = {
  sand: color("Sand", "#c9b59a"),
  black: color("Black", "#1b1a18"),
  greige: color("Greige", "#a39c92"),
  charcoal: color("Charcoal", "#3a3734"),
  camel: color("Camel", "#b98a5a"),
  ivory: color("Ivory", "#efe8da"),
  stone: color("Stone", "#d9d0c2"),
  ecru: color("Ecru", "#e6dcc9"),
  taupe: color("Taupe", "#8c7f70"),
  houndstooth: color("Houndstooth", "#55504a"),
  navy: color("Navy", "#2b3140"),
  tan: color("Tan", "#c49a6c"),
  oxblood: color("Oxblood", "#5a2230"),
  horn: color("Horn", "#6b4a2e"),
};

const WOMEN_SIZES = ["XS", "S", "M", "L"];
const WOMEN_SIZES_XL = ["XS", "S", "M", "L", "XL"];
const MEN_SIZES = ["S", "M", "L", "XL"];
const ONE_SIZE = ["One Size"];

export const catalog: Product[] = [
  /* ----------------------------- Women ----------------------------- */
  {
    slug: "sculpted-trench-coat",
    name: "Sculpted Trench Coat",
    category: "women",
    collection: "atelier-tailoring",
    kind: "Outerwear",
    price: 69000,
    colors: [COLORS.sand, COLORS.black],
    sizes: WOMEN_SIZES,
    images: [`${P}p-trench-1.jpg`, `${P}p-trench-2.jpg`, `${P}p-trench-3.jpg`],
    isNew: true,
    description:
      "A double-breasted trench in bonded cotton gabardine with a sculpted shoulder and storm shield. Belted at the waist, it moves from the morning commute to a late dinner without missing a step.",
    details: [
      "Bonded cotton gabardine, 100% cotton",
      "Relaxed fit with a sculpted shoulder — take your usual size",
      "Double-breasted front with horn-look buttons and detachable belt",
      "Storm shield, gun flap and deep welt pockets",
      "Made in Portugal · Style AU26-014",
    ],
  },
  {
    slug: "structured-wool-coat",
    name: "Structured Wool Coat",
    category: "women",
    collection: "atelier-tailoring",
    kind: "Outerwear",
    price: 64000,
    colors: [COLORS.greige, COLORS.charcoal],
    sizes: WOMEN_SIZES,
    images: [`${P}p-wool-coat.jpg`],
    isNew: false,
    description:
      "A sharply shouldered, double-breasted coat in greige wool with a nipped waist. The kind of coat that makes everything underneath look considered.",
    details: [
      "Double-faced wool, 600 g",
      "Fitted through the bodice — take your usual size",
      "Fully lined in cupro",
      "Horn-look buttons, flap pockets",
      "Made in Portugal · Style AU26-015",
    ],
  },
  {
    slug: "camel-wrap-coat",
    name: "Camel Wrap Coat",
    category: "women",
    collection: "atelier-tailoring",
    kind: "Outerwear",
    price: 72000,
    colors: [COLORS.camel, COLORS.ivory],
    sizes: WOMEN_SIZES_XL,
    images: [`${P}p-wrap-coat.jpg`],
    isNew: true,
    description:
      "A long wrap coat in brushed camel wool with a self-tie belt and a shawl collar. Falls to mid-calf and closes with a single hidden hook.",
    details: [
      "Brushed wool-cashmere, 620 g",
      "Relaxed fit — true to size",
      "Self-tie belt, hidden hook closure",
      "Deep welt pockets, back vent",
      "Made in Italy · Style AU26-016",
    ],
  },
  {
    slug: "wide-leg-trouser",
    name: "Wide-Leg Trouser",
    category: "women",
    collection: "atelier-tailoring",
    kind: "Tailoring",
    price: 28000,
    colors: [COLORS.black, COLORS.stone],
    sizes: WOMEN_SIZES,
    images: [`${P}p-trouser-1.jpg`, `${P}p-trouser-2.jpg`],
    isNew: true,
    description:
      "A high-rise, wide-leg trouser with a pressed crease and a fluid drape. Cut from a weighty viscose-wool twill that holds its line from desk to dinner.",
    details: [
      "Viscose-wool twill, 310 g",
      "High rise, full length — fits true to size",
      "Pressed front crease, side zip",
      "Unfinished hem for tailoring",
      "Made in Portugal · Style AU26-017",
    ],
  },
  {
    slug: "relaxed-suit-jacket",
    name: "Relaxed Suit Jacket",
    category: "women",
    collection: "soft-structure",
    kind: "Tailoring",
    price: 52000,
    colors: [COLORS.ivory],
    sizes: WOMEN_SIZES,
    images: [`${P}p-suit-jacket.jpg`],
    isNew: false,
    description:
      "An unstructured single-breasted jacket in ivory stretch-wool, with soft shoulders and a slightly elongated body. Wear it as a suit with the matching trouser, or over everything.",
    details: [
      "Stretch wool, 98% wool / 2% elastane",
      "Relaxed fit — true to size",
      "Unpadded shoulder, half-lined",
      "Two-button front, welt pockets",
      "Made in Portugal · Style AU26-018",
    ],
  },
  {
    slug: "cashmere-turtleneck",
    name: "Cashmere Turtleneck",
    category: "women",
    collection: "soft-structure",
    kind: "Knitwear",
    price: 31000,
    colors: [COLORS.camel, COLORS.ecru, COLORS.black],
    sizes: WOMEN_SIZES,
    images: [`${P}p-turtleneck-1.jpg`, `${P}p-turtleneck-2.jpg`],
    isNew: true,
    description:
      "A second-skin cashmere turtleneck with a rolled collar and ribbed trims. Knit from four-ply Mongolian cashmere, it is the piece you will reach for every day from October to March.",
    details: [
      "100% Mongolian cashmere, four-ply",
      "Slim fit — size up for a relaxed look",
      "Rolled collar and ribbed cuffs",
      "Hand wash cold or dry clean",
      "Style AU26-019",
    ],
  },
  {
    slug: "cropped-leather-jacket",
    name: "Cropped Leather Jacket",
    category: "women",
    collection: "night-archive",
    kind: "Outerwear",
    price: 56000,
    colors: [COLORS.black],
    sizes: WOMEN_SIZES,
    images: [`${P}p-leather-jacket.jpg`],
    isNew: true,
    description:
      "A cropped, boxy jacket in vegetable-tanned lambskin that softens with every wear. Quilted panels at the shoulder add structure without weight.",
    details: [
      "Vegetable-tanned lambskin",
      "Cropped boxy fit — true to size",
      "Quilted shoulder panels, silver hardware",
      "Fully lined in cupro",
      "Made in Italy · Style AU26-020",
    ],
  },
  {
    slug: "leather-trench-coat",
    name: "Leather Trench Coat",
    category: "women",
    collection: "night-archive",
    kind: "Outerwear",
    price: 98000,
    colors: [COLORS.black],
    sizes: ["XS", "S", "M"],
    images: [`${P}p-leather-trench.jpg`],
    isNew: false,
    description:
      "A floor-skimming trench in supple lambskin with a storm shield and a belt that ties at the waist. The loudest quiet piece in the collection.",
    details: [
      "Supple lambskin, 0.7 mm",
      "Relaxed fit — true to size",
      "Storm shield and detachable belt",
      "Satin lining, sealed seams",
      "Made in Italy · Style AU26-021",
    ],
  },
  {
    slug: "relaxed-wool-blazer",
    name: "Relaxed Wool Blazer",
    category: "women",
    collection: "soft-structure",
    kind: "Tailoring",
    price: 42000,
    colors: [COLORS.black, COLORS.ivory],
    sizes: WOMEN_SIZES,
    images: [`${P}p-blazer.jpg`],
    isNew: false,
    description:
      "A soft-shouldered blazer in crinkled wool crepe with a single button and a long, fluid line. Pairs as easily with denim as with the Wide-Leg Trouser.",
    details: [
      "Wool crepe, 290 g",
      "Relaxed fit — true to size",
      "Soft shoulder, half-lined",
      "Single-button front, flap pockets",
      "Made in Portugal · Style AU26-022",
    ],
  },

  /* ------------------------------ Men ------------------------------ */
  {
    slug: "tailored-wool-overcoat",
    name: "Tailored Wool Overcoat",
    category: "men",
    collection: "atelier-tailoring",
    kind: "Outerwear",
    price: 78000,
    colors: [COLORS.camel, COLORS.charcoal],
    sizes: MEN_SIZES,
    images: [`${P}m-overcoat-1.jpg`, `${P}m-overcoat-2.jpg`],
    isNew: true,
    description:
      "A single-breasted overcoat in double-faced Italian wool with a soft constructed shoulder and hand-finished lapel. Cut to fall just below the knee, it is the layer everything else disappears under.",
    details: [
      "Double-faced virgin wool, woven in Biella",
      "Regular fit — size up for a relaxed drape",
      "Half-lined body with a fully lined sleeve",
      "Horn buttons, two interior welt pockets",
      "Made in Portugal · Style AU26-101",
    ],
  },
  {
    slug: "double-breasted-overcoat",
    name: "Double-Breasted Overcoat",
    category: "men",
    collection: "atelier-tailoring",
    kind: "Outerwear",
    price: 82000,
    colors: [COLORS.taupe],
    sizes: MEN_SIZES,
    images: [`${P}m-double-coat.jpg`],
    isNew: false,
    description:
      "Six buttons, a broad lapel and a waist-suppressed silhouette in warm taupe wool. Worn open over tailoring or buttoned to the throat in cold weather.",
    details: [
      "Wool-cashmere blend, 640 g",
      "Tailored fit with a slight waist suppression",
      "Fully lined in cupro",
      "Double-breasted with a wide peak lapel",
      "Made in Italy · Style AU26-102",
    ],
  },
  {
    slug: "houndstooth-wool-coat",
    name: "Houndstooth Wool Coat",
    category: "men",
    collection: "soft-structure",
    kind: "Outerwear",
    price: 69000,
    colors: [COLORS.houndstooth],
    sizes: ["S", "M", "L"],
    images: [`${P}m-houndstooth.jpg`],
    isNew: false,
    description:
      "A generous, unstructured overcoat in charcoal houndstooth, cut with patch pockets and a collar that stands on its own.",
    details: [
      "Woven houndstooth wool, 580 g",
      "Oversized fit — take your usual size for a relaxed look",
      "Unlined body with bound internal seams",
      "Patch pockets, two-button front",
      "Made in Portugal · Style AU26-103",
    ],
  },
  {
    slug: "formal-wool-overcoat",
    name: "Formal Wool Overcoat",
    category: "men",
    collection: "night-archive",
    kind: "Outerwear",
    price: 86000,
    colors: [COLORS.black],
    sizes: MEN_SIZES,
    images: [`${P}m-formal-coat.jpg`],
    isNew: true,
    description:
      "A midnight-black overcoat with a closed-front placket and velvet-finish wool, designed to be worn over a dinner suit as naturally as over denim.",
    details: [
      "Virgin wool with a matte finish",
      "Slim fit — true to size",
      "Concealed button placket",
      "Silk-lined body and sleeves",
      "Made in Italy · Style AU26-104",
    ],
  },
  {
    slug: "naval-wool-coat",
    name: "Naval Wool Coat",
    category: "men",
    collection: "soft-structure",
    kind: "Outerwear",
    price: 54000,
    colors: [COLORS.navy],
    sizes: ["M", "L", "XL"],
    images: [`${P}m-naval-coat.jpg`],
    isNew: false,
    description:
      "A caban-style coat in dense navy melton with rope-and-toggle details and a high collar that turns up against the wind.",
    details: [
      "Melton wool, 720 g",
      "Relaxed fit with a drop shoulder",
      "Unlined for a soft, weighty drape",
      "Horn toggle and rope closure",
      "Made in Portugal · Style AU26-105",
    ],
  },
  {
    slug: "single-breasted-overcoat",
    name: "Single-Breasted Overcoat",
    category: "men",
    collection: "atelier-tailoring",
    kind: "Outerwear",
    price: 56000,
    colors: [COLORS.black],
    sizes: ["S", "M", "L"],
    images: [`${P}m-single-coat.jpg`],
    isNew: false,
    description:
      "Our essential overcoat: a notch lapel, two buttons and a clean back vent in black wool with a touch of cashmere.",
    details: [
      "Wool-cashmere blend, 520 g",
      "Regular fit — true to size",
      "Cupro lining, two interior pockets",
      "Back vent for movement",
      "Made in Portugal · Style AU26-106",
    ],
  },
  {
    slug: "camel-overcoat",
    name: "Camel Overcoat",
    category: "men",
    collection: "atelier-tailoring",
    kind: "Outerwear",
    price: 74000,
    colors: [COLORS.camel],
    sizes: MEN_SIZES,
    images: [`${P}m-camel-coat.jpg`],
    isNew: true,
    description:
      "A relaxed camel overcoat in brushed wool with a scarf collar that can be worn open or closed at the throat.",
    details: [
      "Brushed virgin wool",
      "Relaxed fit — true to size, or size down for a cleaner line",
      "Scarf collar with hidden hook closure",
      "Two front patch pockets",
      "Made in Italy · Style AU26-107",
    ],
  },

  /* --------------------------- Accessories ------------------------- */
  {
    slug: "structured-leather-tote",
    name: "Structured Leather Tote",
    category: "accessories",
    collection: "atelier-tailoring",
    kind: "Leather goods",
    price: 48000,
    colors: [COLORS.black, COLORS.tan],
    sizes: ONE_SIZE,
    images: [`${P}a-tote.jpg`],
    isNew: true,
    description:
      "A structured tote in full-grain leather with an architectural frame, a magnetic closure and a suede-lined interior that fits a 14-inch laptop.",
    details: [
      "Full-grain vegetable-tanned leather",
      "One size — 32 × 28 × 14 cm",
      "Magnetic closure, suede lining",
      "Interior zip pocket and card slots",
      "Made in Italy · Style AU26-201",
    ],
  },
  {
    slug: "mini-top-handle-bag",
    name: "Mini Top-Handle Bag",
    category: "accessories",
    collection: "atelier-tailoring",
    kind: "Leather goods",
    price: 39000,
    colors: [COLORS.black, COLORS.oxblood],
    sizes: ONE_SIZE,
    images: [`${P}a-mini-bag.jpg`],
    isNew: false,
    description:
      "A miniature top-handle bag in croc-embossed leather with a detachable cross-body strap. Small, sharp, and just big enough for the essentials.",
    details: [
      "Croc-embossed calf leather",
      "One size — 18 × 12 × 7 cm",
      "Detachable leather strap, 110 cm",
      "Gold-tone hardware, microsuede lining",
      "Made in Italy · Style AU26-202",
    ],
  },
  {
    slug: "sculptural-sunglasses",
    name: "Sculptural Sunglasses",
    category: "accessories",
    collection: "night-archive",
    kind: "Eyewear",
    price: 26000,
    colors: [COLORS.black, COLORS.horn],
    sizes: ONE_SIZE,
    images: [`${P}a-sunglasses.jpg`],
    isNew: false,
    description:
      "Oversized round frames in bio-acetate with a sculpted bridge and CR-39 lenses. Designed to be worn slightly too big.",
    details: [
      "Italian bio-acetate, plant-based",
      "One size — 52 □ 22 · 145",
      "CR-39 lenses, 100% UV protection",
      "Five-barrel hinges, gold-tone core",
      "Made in Italy · Style AU26-203",
    ],
  },
  {
    slug: "leather-monk-shoes",
    name: "Leather Monk Shoes",
    category: "accessories",
    collection: "night-archive",
    kind: "Footwear",
    price: 39000,
    colors: [COLORS.black],
    sizes: ["40", "41", "42", "43", "44", "45"],
    images: [`${P}a-shoes.jpg`],
    isNew: false,
    description:
      "A double-strap monk shoe in polished calf leather with a lightweight leather sole and a soft square toe.",
    details: [
      "Polished calf leather",
      "True to size — regular width",
      "Leather sole, cushioned footbed",
      "Goodyear welted — can be resoled",
      "Made in Portugal · Style AU26-204",
    ],
  },
];

export function categoryCount(category: Category): number {
  return catalog.filter((product) => product.category === category).length;
}

export function collectionCount(collection: string): number {
  return catalog.filter((product) => product.collection === collection).length;
}
