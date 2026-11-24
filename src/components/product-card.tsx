"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/components/store-provider";
import { SmartImage } from "@/components/smart-image";
import { PlusIcon } from "@/components/icons";
import { CATEGORY_LABEL, type Product } from "@/lib/catalog";
import { cn, formatPrice } from "@/lib/utils";

/**
 * Product tile: image, name, price, selectable colour swatches and a quick-add
 * button that reveals a size picker for multi-size pieces.
 */
export function ProductCard({ product, priority, className }: { product: Product; priority?: boolean; className?: string }) {
  const { addItem } = useStore();
  const [colorIndex, setColorIndex] = useState(0);
  const [sizesOpen, setSizesOpen] = useState(false);

  const color = product.colors[colorIndex] ?? product.colors[0];
  const image = product.images[0];
  const href = `/products/${product.slug}`;
  const singleSize = product.sizes.length === 1;

  function quickAdd(size?: string) {
    if (singleSize) {
      addItem({ slug: product.slug, name: product.name, price: product.price, image }, product.sizes[0], color.name);
      return;
    }
    if (!size) {
      setSizesOpen((open) => !open);
      return;
    }
    addItem({ slug: product.slug, name: product.name, price: product.price, image }, size, color.name);
    setSizesOpen(false);
  }

  return (
    <article className={cn("group relative flex h-full flex-col", className)}>
      <div className="relative aspect-[3/4] overflow-hidden bg-sand-100">
        {product.isNew && (
          <span className="absolute left-3 top-3 z-10 bg-ivory-100/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-900">
            New
          </span>
        )}
        <Link href={href} aria-label={`View ${product.name}`} className="block h-full w-full">
          <SmartImage
            src={image}
            alt={`${product.name} in ${color.name}`}
            priority={priority}
            className="image-grade h-full w-full object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
          />
        </Link>

        <div
          className={cn(
            "absolute inset-x-3 bottom-3 z-10 flex flex-col items-end gap-1 transition-all duration-500 ease-out-expo",
            sizesOpen
              ? "md:translate-y-0 md:opacity-100"
              : "md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100",
          )}
        >
          {!singleSize && sizesOpen && (
            <div
              key="sizes"
              className="animate-fade flex w-full flex-wrap gap-1 bg-ivory-100/95 p-2 backdrop-blur"
              aria-label={`Sizes for ${product.name}`}
            >
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => quickAdd(size)}
                  className="h-10 flex-1 px-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-900 transition-colors duration-200 hover:bg-ink-900 hover:text-ivory-100"
                >
                  {size}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => quickAdd()}
            aria-expanded={!singleSize ? sizesOpen : undefined}
            aria-label={singleSize ? `Add ${product.name} to bag` : `Choose a size for ${product.name}`}
            className="flex h-11 w-11 items-center justify-center bg-ivory-100/95 text-ink-900 backdrop-blur transition-colors duration-300 hover:bg-ink-900 hover:text-ivory-100 md:h-12 md:w-full md:gap-2 md:text-[12px] md:font-semibold md:uppercase md:tracking-[0.18em]"
          >
            <span className="hidden md:inline">{singleSize ? "Quick add" : sizesOpen ? "Select size" : "Quick add"}</span>
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
          {CATEGORY_LABEL[product.category]} · {product.kind}
        </p>
        <Link href={href} className="nav-link mt-1.5 self-start text-[15px] font-medium text-ink-900">
          {product.name}
        </Link>
        <p className="tabular mt-1 text-[15px] text-ink-700">{formatPrice(product.price)}</p>
        <div className="mt-3 flex items-center gap-2" role="group" aria-label={`${product.name} colours`}>
          {product.colors.map((option, index) => (
            <button
              key={option.name}
              type="button"
              aria-label={`Colour ${option.name}`}
              aria-pressed={index === colorIndex}
              title={option.name}
              onClick={() => setColorIndex(index)}
              className={cn(
                "h-4 w-4 rounded-full border transition-all duration-200",
                index === colorIndex
                  ? "border-ink-900 ring-1 ring-ink-900 ring-offset-2 ring-offset-ivory-100"
                  : "border-ink-900/20 hover:scale-110",
              )}
              style={{ backgroundColor: option.hex }}
            />
          ))}
          <span className="ml-1 text-xs text-ink-500">{color?.name}</span>
        </div>
      </div>
    </article>
  );
}
