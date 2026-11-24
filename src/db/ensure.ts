import { sql } from "drizzle-orm";
import { db } from "@/db";
import { products } from "./schema";
import { catalog } from "@/lib/catalog";

let pending: Promise<void> | null = null;

/**
 * Makes sure the storefront tables exist and the catalogue is populated.
 *
 * The statements are idempotent, so this is safe to call on every request
 * (the result is memoised for the lifetime of the server process). In a
 * production deployment the same shape would be applied through
 * `drizzle-kit push` / migrations and a dedicated seed script.
 */
export function ensureStore(): Promise<void> {
  if (!pending) {
    pending = bootstrap().catch((error) => {
      pending = null;
      throw error;
    });
  }
  return pending;
}

async function bootstrap(): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS products (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      slug text NOT NULL UNIQUE,
      name text NOT NULL,
      category text NOT NULL,
      collection text NOT NULL,
      kind text NOT NULL,
      price_cents integer NOT NULL,
      colors jsonb NOT NULL,
      sizes jsonb NOT NULL,
      images jsonb NOT NULL,
      description text NOT NULL,
      details jsonb NOT NULL,
      is_new boolean NOT NULL DEFAULT false,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text NOT NULL UNIQUE,
      source text NOT NULL DEFAULT 'storefront',
      created_at timestamp NOT NULL DEFAULT now()
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text NOT NULL UNIQUE,
      name text NOT NULL,
      password_hash text NOT NULL,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS orders (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      order_number text NOT NULL UNIQUE,
      email text NOT NULL,
      full_name text NOT NULL,
      address jsonb NOT NULL,
      items jsonb NOT NULL,
      subtotal_cents integer NOT NULL,
      shipping_cents integer NOT NULL,
      total_cents integer NOT NULL,
      status text NOT NULL DEFAULT 'confirmed',
      user_id uuid,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `);

  const existing = await db.select({ slug: products.slug }).from(products).limit(1);
  if (existing.length === 0) {
    await db
      .insert(products)
      .values(
        catalog.map((product) => ({
          slug: product.slug,
          name: product.name,
          category: product.category,
          collection: product.collection,
          kind: product.kind,
          priceCents: product.price,
          colors: product.colors,
          sizes: product.sizes,
          images: product.images,
          description: product.description,
          details: product.details,
          isNew: product.isNew,
        })),
      )
      .onConflictDoNothing({ target: products.slug });
  }
}
