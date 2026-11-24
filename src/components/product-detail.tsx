"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useStore } from "@/components/store-provider";
import { ProductGrid } from "@/components/product-grid";
import { QuantityStepper } from "@/components/quantity-stepper";
import { SmartImage } from "@/components/smart-image";
import { Button, SectionHeading } from "@/components/primitives";
import { CheckIcon, ChevronDownIcon } from "@/components/icons";
import { CATEGORY_LABEL, COLLECTION_LABEL, type Product } from "@/lib/catalog";
import { cn, formatPrice } from "@/lib/utils";

const PLACEHOLDER = "/images/placeholder.svg";

/** Product detail: gallery, colour, size, quantity, add-to-bag and details accordions. */
export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const { addItem } = useStore();
  const [colorIndex, setColorIndex] = useState(0);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const sizeGroupRef = useRef<HTMLDivElement>(null);

  const color = product.colors[colorIndex] ?? product.colors[0];
  const images = product.images.length ? product.images : [PLACEHOLDER];
  const safeIndex = Math.min(imageIndex, images.length - 1);

  function addToBag() {
    if (!size) {
      setError("Please select a size to continue.");
      sizeGroupRef.current?.focus();
      return;
    }
    addItem({ slug: product.slug, name: product.name, price: product.price, image: images[0] }, size, color.name, qty);
    setError(null);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  }

  const accordions = [
    { title: "Details & Fit", content: <ul className="space-y-2" role="list">{product.details.map((line) => <li key={line} className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />{line}</li>)}</ul> },
    { title: "Materials & Care", content: <p>Composition is listed on every garment tag. We recommend airing after wear, cold hand wash or specialist dry clean, and storing on wide wooden hangers away from direct light. Repairs are complimentary for the first two years.</p> },
    { title: "Shipping & Returns", content: <p>Ships in 1–2 business days with complimentary shipping over $300. Returns are free within 30 days on unworn full-price pieces — see <Link href="/client-care#shipping" className="nav-link text-ink-900">Client Care</Link> for details.</p> },
  ];

  return (
    <>
      <div className="container-x py-8 lg:py-14">
        <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
          <ol className="flex flex-wrap items-center gap-2" role="list">
            <li><Link href="/" className="transition-colors hover:text-ink-900">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/collections/${product.category}`} className="transition-colors hover:text-ink-900">{CATEGORY_LABEL[product.category]}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink-900">{product.name}</li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden bg-sand-100">
              {product.isNew && (
                <span className="absolute left-4 top-4 z-10 bg-ivory-100/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-900">New</span>
              )}
              <SmartImage
                key={images[safeIndex]}
                src={images[safeIndex]}
                alt={`${product.name} in ${color.name}, view ${safeIndex + 1} of ${images.length}`}
                priority
                className="image-grade absolute inset-0 h-full w-full animate-fade object-cover object-top"
              />
            </div>
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-3" role="group" aria-label="Product images">
                {images.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setImageIndex(index)}
                    aria-label={`Show image ${index + 1}`}
                    aria-pressed={index === safeIndex}
                    className={cn(
                      "aspect-[3/4] overflow-hidden bg-sand-100 transition-all duration-300",
                      index === safeIndex ? "ring-1 ring-ink-900 ring-offset-2 ring-offset-ivory-100" : "opacity-60 hover:opacity-100",
                    )}
                  >
                    <SmartImage src={src} alt="" className="image-grade h-full w-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-5">
            <p className="eyebrow text-gold-600">
              {CATEGORY_LABEL[product.category]} · {COLLECTION_LABEL[product.collection]}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-[1.02] text-ink-900 sm:text-5xl">{product.name}</h1>
            <p className="tabular mt-3 text-lg text-ink-700">{formatPrice(product.price)}</p>
            <p className="mt-6 text-[15px] leading-relaxed text-ink-600">{product.description}</p>

            {/* Colour */}
            <div className="mt-8">
              <p className="field-label">
                Colour <span className="ml-1 font-medium normal-case tracking-normal text-ink-900">{color.name}</span>
              </p>
              <div className="mt-3 flex gap-2.5" role="radiogroup" aria-label="Colour">
                {product.colors.map((option, index) => (
                  <button
                    key={option.name}
                    type="button"
                    role="radio"
                    aria-checked={index === colorIndex}
                    aria-label={option.name}
                    title={option.name}
                    onClick={() => setColorIndex(index)}
                    className={cn(
                      "h-8 w-8 rounded-full border transition-all duration-200",
                      index === colorIndex ? "border-ink-900 ring-1 ring-ink-900 ring-offset-2 ring-offset-ivory-100" : "border-ink-900/20 hover:scale-105",
                    )}
                    style={{ backgroundColor: option.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div ref={sizeGroupRef} tabIndex={-1} className="mt-7 min-w-0 outline-none" aria-describedby={error ? "size-error" : undefined}>
              <div className="flex w-full items-center justify-between">
                <p className="field-label">
                  Size {size && <span className="ml-1 font-medium normal-case tracking-normal text-ink-900">{size}</span>}
                </p>
                <Link href="/client-care#size-guide" className="nav-link text-[12px] font-medium text-ink-500 hover:text-ink-900">
                  Size guide
                </Link>
              </div>
              <div className="mt-3 grid grid-cols-5 gap-2" role="radiogroup" aria-label="Size">
                {product.sizes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={size === option}
                    onClick={() => {
                      setSize(option);
                      setError(null);
                    }}
                    className={cn(
                      "h-12 border text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200",
                      size === option ? "border-ink-900 bg-ink-900 text-ivory-100" : "border-ink-900/25 text-ink-900 hover:border-ink-900",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {error && (
                <p id="size-error" role="alert" className="mt-3 text-[13px] text-error">
                  {error}
                </p>
              )}
            </div>

            {/* Quantity + add */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <QuantityStepper value={qty} onChange={setQty} min={1} />
              <Button onClick={addToBag} size="lg" className="flex-1" variant={justAdded ? "gold" : "solid"}>
                {justAdded ? (
                  <>
                    <CheckIcon className="h-4 w-4" /> Added to bag
                  </>
                ) : (
                  <>Add to Bag · {formatPrice(product.price * qty)}</>
                )}
              </Button>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-ink-500">
              Ships in 1–2 business days · Complimentary shipping over $300 · 30-day returns
            </p>

            {/* Accordions */}
            <div className="mt-10 divide-y divide-ink-900/10 border-y border-ink-900/10">
              {accordions.map(({ title, content }) => (
                <details key={title} className="group">
                  <summary className="flex list-none items-center justify-between py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-900 [&::-webkit-details-marker]:hidden">
                    {title}
                    <ChevronDownIcon className="h-4 w-4 transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <div className="animate-fade pb-5 text-[14px] leading-relaxed text-ink-600">{content}</div>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20 lg:mt-28" aria-label="You may also like">
            <SectionHeading
              eyebrow="Complete the look"
              title={
                <>
                  You may also <em className="italic">like</em>
                </>
              }
              action={{ href: `/collections/${product.category}`, label: `Shop ${CATEGORY_LABEL[product.category]}` }}
            />
            <div className="mt-10 lg:mt-12">
              <ProductGrid products={related} />
            </div>
          </section>
        )}
      </div>
    </>
  );
}
