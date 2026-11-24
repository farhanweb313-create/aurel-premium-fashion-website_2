import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { getProductBySlug, listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Piece not found" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const all = await listProducts();
  const related = all
    .filter((candidate) => candidate.slug !== product.slug && candidate.category === product.category)
    .slice(0, 4);
  const fillers = all
    .filter((candidate) => candidate.slug !== product.slug && !related.includes(candidate))
    .slice(0, Math.max(0, 4 - related.length));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((src) => src),
    brand: { "@type": "Brand", name: "AUREL" },
    offers: { "@type": "Offer", price: (product.price / 100).toFixed(2), priceCurrency: "USD", availability: "https://schema.org/InStock" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={product} related={[...related, ...fillers]} />
    </>
  );
}
