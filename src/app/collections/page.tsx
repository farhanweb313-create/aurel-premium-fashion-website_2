import type { Metadata } from "next";
import Link from "next/link";
import { CollectionView } from "@/components/collection-view";
import { Reveal } from "@/components/reveal";
import { SmartImage } from "@/components/smart-image";
import { ArrowUpRightIcon } from "@/components/icons";
import { CATEGORIES, COLLECTIONS } from "@/lib/catalog";
import { listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore AUREL collections — Atelier Tailoring, Soft Structure and Night Archive — alongside every piece in the current season.",
};

export default async function CollectionsPage() {
  const all = await listProducts();
  const counts: Record<string, number> = {};
  for (const product of all) counts[product.collection] = (counts[product.collection] ?? 0) + 1;
  const categoryCounts: Record<string, number> = {};
  for (const product of all) categoryCounts[product.category] = (categoryCounts[product.category] ?? 0) + 1;

  return (
    <>
      <section className="border-b border-ink-900/10 bg-ivory-50">
        <div className="container-x py-12 lg:py-20">
          <Reveal>
            <p className="eyebrow text-gold-600">Collections · Autumn/Winter 2026</p>
            <h1 className="mt-3 font-display text-5xl leading-none text-ink-900 sm:text-6xl lg:text-7xl">
              Three stories, <em className="italic">one</em> wardrobe.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-600">
              Collection 07 is organised into three chapters. Start with a story, or browse every piece in the season.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-14 lg:py-20" aria-label="Collections">
        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {COLLECTIONS.map((collection, index) => (
            <Reveal key={collection.slug} delay={index * 90}>
              <Link href={`/collections/${collection.slug}`} className="group relative block aspect-[3/4] overflow-hidden bg-ink-900">
                <SmartImage
                  src={collection.image}
                  alt={collection.imageAlt}
                  className="image-grade absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 p-6 lg:p-7">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-ivory-200/80">{counts[collection.slug] ?? 0} pieces</p>
                  <p className="mt-1 font-display text-3xl text-ivory-100">{collection.name}</p>
                  <p className="mt-2 text-sm text-ivory-200/80">{collection.tagline}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300">
                    Explore <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <nav aria-label="Shop by category" className="mt-10 flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/collections/${category.slug}`}
              className="rounded-full border border-ink-900/15 px-5 py-2.5 text-[13px] text-ink-700 transition-colors duration-300 hover:border-ink-900 hover:text-ink-900"
            >
              {category.name} <span className="tabular text-ink-400">({categoryCounts[category.slug] ?? 0})</span>
            </Link>
          ))}
          <Link
            href="/collections/new-arrivals"
            className="rounded-full border border-gold-500/50 bg-gold-500/10 px-5 py-2.5 text-[13px] text-ink-900 transition-colors duration-300 hover:border-gold-500"
          >
            New arrivals
          </Link>
        </nav>
      </section>

      <section className="border-t border-ink-900/10 bg-ivory-50/60">
        <div className="container-x pt-10 lg:pt-14">
          <CollectionView eyebrow="The complete season" title="All pieces" description="" products={all} hideHeader />
        </div>
      </section>
    </>
  );
}
