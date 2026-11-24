import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type Props = {
  products: Product[];
  /** Number of tiles that should eager-load their image (above the fold). */
  eagerCount?: number;
  className?: string;
  emptyMessage?: string;
};

/** Responsive product grid: 2 columns on phones, 4 from laptop up. */
export function ProductGrid({ products, eagerCount = 0, className, emptyMessage }: Props) {
  if (products.length === 0) {
    return (
      <p className="border border-dashed border-ink-900/20 px-6 py-16 text-center text-sm text-ink-500">
        {emptyMessage ?? "No pieces match this selection yet."}
      </p>
    );
  }
  return (
    <ul className={cn("grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4", className)} role="list">
      {products.map((product, index) => (
        <li key={product.slug} className="flex">
          <ProductCard product={product} priority={index < eagerCount} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
