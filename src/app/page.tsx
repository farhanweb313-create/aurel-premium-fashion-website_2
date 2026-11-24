import { listProducts } from "@/lib/products";
import { BrandStory, Categories, CollectionBanner, Hero, NewArrivals, Newsletter, TrustStrip } from "@/components/home";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [newArrivals, all] = await Promise.all([listProducts({ isNew: true }), listProducts()]);

  return (
    <>
      <Hero />
      <TrustStrip />
      <Categories products={all} />
      <NewArrivals products={newArrivals.slice(0, 8)} />
      <BrandStory />
      <CollectionBanner />
      <Newsletter />
    </>
  );
}
