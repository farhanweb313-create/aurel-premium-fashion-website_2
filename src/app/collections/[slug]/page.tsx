import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/collection-view";
import { COLLECTIONS } from "@/lib/catalog";
import { listProducts, type ProductFilter } from "@/lib/products";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

type PageDefinition = { eyebrow: string; title: string; description: string; filter: ProductFilter };

const PAGES: Record<string, PageDefinition> = {
  "new-arrivals": {
    eyebrow: "New in · Collection 07",
    title: "New Arrivals",
    description:
      "The first pieces of Autumn/Winter 2026 — sculpted trenches, second-skin cashmere and leather cut for after dark.",
    filter: { isNew: true },
  },
  women: {
    eyebrow: "Women · Collection 07",
    title: "Women",
    description:
      "Sculpted outerwear, fluid tailoring and second-skin cashmere. Cut to move with you from the first meeting to the last train.",
    filter: { category: "women" },
  },
  men: {
    eyebrow: "Men · Collection 07",
    title: "Men",
    description:
      "Double-faced overcoats, relaxed tailoring and knitwear with weight. Considered menswear made to be kept for decades.",
    filter: { category: "men" },
  },
  accessories: {
    eyebrow: "Accessories · Collection 07",
    title: "Accessories",
    description:
      "Vegetable-tanned leather goods, sculptural eyewear and the small pieces that finish a look.",
    filter: { category: "accessories" },
  },
  all: {
    eyebrow: "The complete season",
    title: "All Pieces",
    description: "Every piece in Collection 07, from atelier tailoring to the finishing accessories.",
    filter: {},
  },
  ...Object.fromEntries(
    COLLECTIONS.map((collection) => [
      collection.slug,
      {
        eyebrow: `Collection · ${collection.name}`,
        title: collection.name,
        description: collection.description,
        filter: { collection: collection.slug },
      } satisfies PageDefinition,
    ]),
  ),
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return { title: "Collection" };
  return { title: page.title, description: page.description };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();

  const products = await listProducts(page.filter);

  return <CollectionView eyebrow={page.eyebrow} title={page.title} description={page.description} products={products} />;
}
