import { and, asc, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { ensureStore } from "@/db/ensure";
import { catalog, COLLECTION_LABEL, type Category, type Product } from "./catalog";

export type ProductFilter = {
  category?: Category;
  collection?: string;
  isNew?: boolean;
};

type ProductRow = typeof products.$inferSelect;

function toProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category as Category,
    collection: row.collection as Product["collection"],
    kind: row.kind,
    price: row.priceCents,
    colors: row.colors,
    sizes: row.sizes,
    images: row.images,
    description: row.description,
    details: row.details,
    isNew: row.isNew,
  };
}

function localFilter(filter: ProductFilter): Product[] {
  return catalog.filter(
    (product) =>
      (!filter.category || product.category === filter.category) &&
      (!filter.collection || product.collection === filter.collection) &&
      (!filter.isNew || product.isNew),
  );
}

/** Lists products from the database, falling back to the bundled catalogue if the DB is unavailable. */
export async function listProducts(filter: ProductFilter = {}): Promise<Product[]> {
  try {
    await ensureStore();
    const conditions = [
      filter.category ? eq(products.category, filter.category) : undefined,
      filter.collection ? eq(products.collection, filter.collection) : undefined,
      filter.isNew ? eq(products.isNew, true) : undefined,
    ].filter((condition): condition is SQL => Boolean(condition));

    const rows = await db
      .select()
      .from(products)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(products.isNew), asc(products.name));

    return rows.length ? rows.map(toProduct) : localFilter(filter);
  } catch (error) {
    console.error("[aurel] listProducts: database unavailable, using static catalogue", error);
    return localFilter(filter);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    await ensureStore();
    const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    return rows[0] ? toProduct(rows[0]) : null;
  } catch (error) {
    console.error("[aurel] getProductBySlug: database unavailable, using static catalogue", error);
    return catalog.find((product) => product.slug === slug) ?? null;
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  const term = query.trim();
  if (!term) return [];

  try {
    await ensureStore();
    const pattern = `%${term.replace(/[%_\\]/g, " ")}%`;
    const rows = await db
      .select()
      .from(products)
      .where(
        or(
          ilike(products.name, pattern),
          ilike(products.kind, pattern),
          ilike(products.category, pattern),
          ilike(products.description, pattern),
        ),
      )
      .orderBy(desc(products.isNew), asc(products.name));
    if (rows.length) return rows.map(toProduct);
  } catch (error) {
    console.error("[aurel] searchProducts: database unavailable, using static catalogue", error);
  }

  const needle = term.toLowerCase();
  return catalog.filter((product) =>
    [product.name, product.kind, product.category, product.description, COLLECTION_LABEL[product.collection]]
      .some((value) => value.toLowerCase().includes(needle)),
  );
}
