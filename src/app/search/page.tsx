import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { Reveal } from "@/components/reveal";
import { SearchIcon } from "@/components/icons";
import { CATEGORIES } from "@/lib/catalog";
import { searchProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the AUREL collection by piece, material or collection.",
};

type Props = { searchParams: Promise<{ q?: string | string[] }> };

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const raw = params.q;
  const query = (Array.isArray(raw) ? raw[0] : raw ?? "").trim().slice(0, 80);
  const results = query ? await searchProducts(query) : [];

  return (
    <>
      <section className="border-b border-ink-900/10 bg-ivory-50">
        <div className="container-x py-12 lg:py-16">
          <Reveal>
            <p className="eyebrow text-gold-600">Search</p>
            <h1 className="mt-3 font-display text-5xl leading-none text-ink-900 sm:text-6xl">
              {query ? (
                <>
                  Results for <em className="italic">“{query}”</em>
                </>
              ) : (
                "Search the collection"
              )}
            </h1>
            <p className="mt-4 text-ink-600">
              {query
                ? `${results.length} ${results.length === 1 ? "piece" : "pieces"} found`
                : "Try “trench”, “cashmere”, “leather” or “sunglasses”."}
            </p>
            <form action="/search" method="get" role="search" className="mt-7 flex max-w-xl items-center gap-3 border-b border-ink-900/40 transition-colors focus-within:border-ink-900">
              <SearchIcon className="h-5 w-5 shrink-0 text-ink-500" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search pieces, materials, collections…"
                aria-label="Search products"
                autoComplete="off"
                className="h-12 min-w-0 flex-1 bg-transparent text-[15px] text-ink-900 outline-none placeholder:text-ink-400"
              />
              <button type="submit" className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-900 transition-colors hover:text-gold-600">
                Search
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-10 lg:py-14" aria-label="Search results">
        {query && results.length > 0 ? (
          <ProductGrid products={results} eagerCount={4} />
        ) : query ? (
          <div className="mx-auto max-w-lg py-10 text-center">
            <p className="font-display text-3xl text-ink-900">Nothing matched “{query}”.</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              Try a broader term such as “coat”, “wool” or “leather”, or browse a category below.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={`/collections/${category.slug}`}
                  className="rounded-full border border-ink-900/15 px-5 py-2.5 text-[13px] text-ink-700 transition-colors hover:border-ink-900 hover:text-ink-900"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-3">
            {CATEGORIES.map((category) => (
              <Link key={category.slug} href={`/collections/${category.slug}`} className="group border border-ink-900/10 p-6 transition-colors hover:border-ink-900/40">
                <p className="eyebrow text-gold-600">Browse</p>
                <p className="mt-2 font-display text-3xl text-ink-900">{category.name}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{category.description}</p>
                <p className="nav-link mt-5 inline-block text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-900">Shop {category.name.toLowerCase()}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
