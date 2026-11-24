import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/icons";
import { ButtonLink, SectionHeading } from "@/components/primitives";
import { NewsletterForm } from "@/components/newsletter-form";
import { ProductGrid } from "@/components/product-grid";
import { Reveal } from "@/components/reveal";
import { SmartImage } from "@/components/smart-image";
import { CATEGORIES, type Product, categoryCount } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";

/* ------------------------------- Hero ------------------------------ */

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-900/10" aria-labelledby="hero-heading">
      <div className="container-x grid lg:grid-cols-12 lg:gap-x-10">
        <div className="order-2 flex flex-col justify-center py-12 lg:order-1 lg:col-span-5 lg:py-20 lg:pr-6">
          <p className="eyebrow animate-rise text-gold-600" style={{ animationDelay: "60ms" }}>
            Autumn / Winter 2026 · Collection 07
          </p>
          <h1
            id="hero-heading"
            className="mt-6 animate-rise font-display text-[clamp(3.25rem,7.2vw,7.75rem)] leading-[0.9] tracking-[-0.02em] text-ink-900"
            style={{ animationDelay: "140ms" }}
          >
            Wear the
            <br />
            <em className="font-normal italic text-gold-600">Future.</em>
          </h1>
          <p className="mt-7 max-w-md animate-rise text-base leading-relaxed text-ink-600 sm:text-lg" style={{ animationDelay: "240ms" }}>
            Sculpted outerwear, fluid tailoring and traceable fibres — designed in Paris, made to outlast the season.
          </p>
          <div className="mt-9 flex animate-rise flex-wrap items-center gap-x-7 gap-y-4" style={{ animationDelay: "320ms" }}>
            <ButtonLink href="/collections/new-arrivals" size="lg">
              Shop New Arrivals
            </ButtonLink>
            <Link href="/collections" className="nav-link text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-900">
              Explore collections
            </Link>
          </div>
          <dl
            className="mt-14 hidden animate-rise gap-10 border-t border-ink-900/10 pt-6 lg:flex"
            style={{ animationDelay: "420ms" }}
          >
            {[
              ["48", "pieces in Collection 07"],
              ["3", "ateliers in Portugal & Italy"],
              ["100%", "traceable natural fibres"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-3xl text-ink-900">{value}</dt>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.14em] text-ink-500">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative order-1 aspect-[4/5] sm:aspect-[16/11] lg:order-2 lg:col-span-7 lg:aspect-auto lg:min-h-[calc(100svh-7.25rem)] lg:max-h-[960px]">
          <SmartImage
            src="/images/hero.jpg"
            alt="Model wearing the Sculpted Trench Coat in sand with arms raised against a neutral studio backdrop"
            priority
            className="image-grade absolute inset-0 h-full w-full object-cover object-top"
          />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink-950/55 to-transparent" aria-hidden="true" />
          <Link
            href="/products/sculpted-trench-coat"
            className="group absolute bottom-6 left-5 flex items-center gap-4 text-ivory-100 sm:bottom-8 sm:left-8"
          >
            <span className="h-px w-8 shrink-0 bg-gold-400 transition-all duration-500 ease-out-expo group-hover:w-16 sm:w-10" aria-hidden="true" />
            <span className="max-w-[82%] sm:max-w-none">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-ivory-200/80 sm:text-[11px]">Look 01</span>
              <span className="mt-1 block font-display text-lg leading-snug sm:text-2xl sm:leading-normal">
                Sculpted Trench Coat — {formatPrice(69000)}
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Trust strip --------------------------- */

const SERVICES: [string, string][] = [
  ["Complimentary shipping", "On all orders over $300, worldwide"],
  ["Considered returns", "30 days on all full-price pieces"],
  ["Traceable making", "Woven, cut and sewn in certified ateliers"],
];

export function TrustStrip() {
  return (
    <section aria-label="Services" className="border-b border-ink-900/10 bg-ivory-50">
      <ul className="container-x grid sm:grid-cols-3 sm:divide-x sm:divide-ink-900/10" role="list">
        {SERVICES.map(([title, detail], index) => (
          <li key={title} className={`py-4 sm:px-6 ${index === 0 ? "sm:pl-0" : ""} ${index === 2 ? "sm:pr-0" : ""}`}>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-900">{title}</p>
            <p className="mt-1 text-[13px] text-ink-500">{detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ----------------------------- Categories --------------------------- */

export function Categories({ products }: { products: Product[] }) {
  const counts: Record<string, number> = {};
  for (const product of products) counts[product.category] = (counts[product.category] ?? 0) + 1;

  return (
    <section className="container-x py-20 lg:py-28" aria-label="Shop by category">
      <Reveal>
        <SectionHeading
          eyebrow="Categories"
          title={
            <>
              Shop by <em className="italic">category</em>
            </>
          }
          action={{ href: "/collections/all", label: "View all pieces" }}
        />
      </Reveal>
      <div className="mt-12 grid gap-4 md:grid-cols-12 md:gap-6 lg:mt-16">
        {CATEGORIES.map((category, index) => {
          const count = counts[category.slug] ?? categoryCount(category.slug);
          return (
            <Reveal key={category.slug} delay={index * 90} className={category.gridClass}>
              <Link
                href={`/collections/${category.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden bg-sand-100 md:aspect-auto md:h-[440px] lg:h-[600px]"
                aria-label={`Shop ${category.name} — ${count} pieces`}
              >
                <SmartImage
                  src={category.image}
                  alt={category.imageAlt}
                  className="image-grade absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/65 via-ink-950/5 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 lg:p-7">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-ivory-200/80">{count} pieces</p>
                    <p className="mt-1 font-display text-3xl text-ivory-100 md:text-2xl lg:text-4xl">{category.name}</p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ivory-100/50 text-ivory-100 transition-colors duration-500 ease-out-expo group-hover:bg-ivory-100 group-hover:text-ink-900 lg:h-11 lg:w-11">
                    <ArrowUpRightIcon className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* --------------------------- New arrivals --------------------------- */

export function NewArrivals({ products }: { products: Product[] }) {
  return (
    <section className="container-x py-20 lg:py-28" aria-label="New arrivals">
      <Reveal>
        <SectionHeading
          eyebrow="New in · Collection 07"
          title={
            <>
              New <em className="italic">arrivals</em>
            </>
          }
          description="First looks from Autumn/Winter 2026 — sculpted trenches, second-skin cashmere and leather cut for after dark."
          action={{ href: "/collections/new-arrivals", label: "View all new arrivals" }}
        />
      </Reveal>
      <Reveal delay={100} className="mt-12 lg:mt-16">
        <ProductGrid products={products} />
      </Reveal>
    </section>
  );
}

/* ---------------------------- Brand story --------------------------- */

const STATS: [string, string][] = [
  ["2019", "Founded in Paris"],
  ["3", "Family-run ateliers"],
  ["92%", "Natural fibres, fully traced"],
];

export function BrandStory() {
  return (
    <section id="story" className="grain overflow-hidden bg-ink-900 text-ivory-100" aria-label="Our story">
      <div className="container-x relative z-10 py-20 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow text-gold-400">Our story</p>
            <h2 className="mt-5 font-display text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">
              Cut for the <em className="italic">decade</em> ahead.
            </h2>
            <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-ivory-200/75 sm:text-base">
              AUREL began in 2019 with a single question: what would a wardrobe look like if nothing in it was designed
              to be replaced? Three collections a year, a handful of silhouettes, and a refusal to hurry.
            </p>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ivory-200/75 sm:text-base">
              Every piece is drafted in our Paris studio and realised by family-run ateliers in Porto and Florence using
              fully traceable wool, cashmere and vegetable-tanned leather.
            </p>
            <div className="mt-10">
              <ButtonLink href="/collections/atelier-tailoring" variant="outline-ivory">
                Discover Atelier Tailoring
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={120} className="relative lg:col-span-6">
            <div className="relative ml-auto w-full max-w-[460px] pb-16 lg:pb-20">
              <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/6]">
                <SmartImage
                  src="/images/story-1.jpg"
                  alt="Hands pinning a cream wool garment on a tailor's dress form"
                  className="image-grade absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-[48%] overflow-hidden border-[6px] border-ink-900 shadow-lift sm:-left-6 lg:-left-12">
                <SmartImage
                  src="/images/story-2.jpg"
                  alt="Dress form wearing a white vest with fashion sketches pinned to the wall behind"
                  className="image-grade aspect-[3/4] w-full object-cover"
                />
              </div>
              <p className="absolute bottom-0 right-0 max-w-[46%] text-right text-[11px] uppercase leading-relaxed tracking-[0.18em] text-ivory-200/60">
                Atelier Sousa, Porto — hand-finishing the Sculpted Trench Coat
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-20 grid grid-cols-1 gap-8 border-t border-ivory-100/15 pt-10 sm:grid-cols-3 lg:mt-28">
          {STATS.map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-4xl text-gold-300 lg:text-5xl">{value}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-ivory-200/70">{label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------- Collection banner ----------------------- */

export function CollectionBanner() {
  return (
    <section aria-label="Night Archive pre-collection">
      <Link
        href="/collections/night-archive"
        className="group relative block h-[72vh] max-h-[860px] min-h-[520px] overflow-hidden bg-ink-950"
      >
        <SmartImage
          src="/images/banner.jpg"
          alt="Model in a cropped black leather jacket and wide trousers casting a long shadow across a white studio"
          className="image-grade absolute inset-0 h-full w-full object-cover object-left transition-transform duration-[1600ms] ease-out-expo group-hover:scale-[1.03] lg:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-ink-950/80 via-ink-950/25 to-transparent" aria-hidden="true" />
        <div className="container-x relative flex h-full flex-col items-end justify-end pb-12 text-right lg:justify-center lg:pb-0">
          <p className="eyebrow text-gold-300">Pre-collection · Night Archive</p>
          <h2 className="mt-4 max-w-xl font-display text-5xl leading-[0.95] text-ivory-100 sm:text-6xl lg:text-7xl">
            After dark, <em className="italic">sharper.</em>
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ivory-200/80 sm:text-base">
            Leather, deep black wool and hard light. Twelve pieces built for the hours the city keeps.
          </p>
          <span className="mt-8 inline-flex h-12 items-center gap-2 self-end bg-ivory-100 px-7 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-900 transition-colors duration-300 group-hover:bg-gold-300">
            Explore Night Archive <ArrowRightIcon className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </section>
  );
}

/* ----------------------------- Newsletter --------------------------- */

export function Newsletter() {
  return (
    <section className="container-x py-20 lg:py-28" aria-label="Newsletter">
      <Reveal className="grid gap-10 border-t border-ink-900/10 pt-16 lg:grid-cols-12 lg:gap-10 lg:pt-20">
        <div className="lg:col-span-7">
          <p className="eyebrow text-gold-600">Newsletter</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">
            Join the <em className="italic">AUREL</em> circle.
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-600 sm:text-base">
            Early access to limited pieces, atelier stories and private fittings. One letter, twice a month — nothing
            more.
          </p>
        </div>
        <div className="lg:col-span-5 lg:pt-16">
          <NewsletterForm />
        </div>
      </Reveal>
    </section>
  );
}
