import { CATEGORY_LABEL } from "@/lib/catalog";
import { searchProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

/** Live search used by the header search overlay. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (query.length < 2) {
    return Response.json({ results: [] });
  }
  const results = await searchProducts(query);
  return Response.json({
    results: results.slice(0, 6).map((product) => ({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: CATEGORY_LABEL[product.category],
    })),
  });
}
