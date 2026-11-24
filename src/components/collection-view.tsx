"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/product-grid";
import { Reveal } from "@/components/reveal";
import { ChevronDownIcon } from "@/components/icons";
import type { Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  products: Product[];
  /** Hide the page header when the page renders its own hero. */
  hideHeader?: boolean;
  showBreadcrumb?: boolean;
};

/** Collection listing: editorial header, count + sort toolbar and the product grid. */
export function CollectionView({ eyebrow, title, description, products, hideHeader = false, showBreadcrumb = true }: Props) {
  const [sort, setSort] = useState<SortKey>("featured");

  const sorted = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "newest":
        return list.sort((a, b) => Number(b.isNew) - Number(a.isNew) || a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [products, sort]);

  return (
    <>
      {!hideHeader && (
        <section className="border-b border-ink-900/10 bg-ivory-50">
          <div className="container-x py-12 lg:py-20">
            <Reveal>
              {showBreadcrumb && (
                <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
                  <ol className="flex flex-wrap items-center gap-2" role="list">
                    <li><Link href="/" className="transition-colors hover:text-ink-900">Home</Link></li>
                    <li aria-hidden="true">/</li>
                    <li><Link href="/collections" className="transition-colors hover:text-ink-900">Collections</Link></li>
                    <li aria-hidden="true">/</li>
                    <li aria-current="page" className="text-ink-900">{title}</li>
                  </ol>
                </nav>
              )}
              <p className="eyebrow mt-6 text-gold-600">{eyebrow}</p>
              <h1 className="mt-3 font-display text-5xl leading-none text-ink-900 sm:text-6xl lg:text-7xl">{title}</h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-600">{description}</p>
            </Reveal>
          </div>
        </section>
      )}

      <section className="container-x py-10 lg:py-14" aria-label={`${title} products`}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-900/10 pb-4">
          <p className="text-[12px] uppercase tracking-[0.18em] text-ink-500" aria-live="polite">
            {sorted.length} {sorted.length === 1 ? "piece" : "pieces"}
          </p>
          <label className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
            <span>Sort</span>
            <span className="relative">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                aria-label="Sort products"
                className="h-10 cursor-pointer appearance-none border border-ink-900/20 bg-transparent pl-4 pr-10 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-900 outline-none transition-colors focus:border-ink-900"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
            </span>
          </label>
        </div>

        <div className={cn("mt-10", sorted.length === 0 && "animate-fade")}>
          <ProductGrid products={sorted} eagerCount={4} />
        </div>
      </section>
    </>
  );
}
