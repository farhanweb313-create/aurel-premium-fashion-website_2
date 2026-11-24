import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export type ProductColorRecord = { name: string; hex: string };

/** Store catalogue. Prices are stored in cents. */
export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    collection: text("collection").notNull(),
    kind: text("kind").notNull(),
    priceCents: integer("price_cents").notNull(),
    colors: jsonb("colors").$type<ProductColorRecord[]>().notNull(),
    sizes: jsonb("sizes").$type<string[]>().notNull(),
    images: jsonb("images").$type<string[]>().notNull(),
    description: text("description").notNull(),
    details: jsonb("details").$type<string[]>().notNull(),
    isNew: boolean("is_new").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("products_category_idx").on(table.category),
    index("products_collection_idx").on(table.collection),
  ],
);

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  source: text("source").notNull().default("storefront"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type OrderAddress = {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
};

export type OrderItem = {
  slug: string;
  name: string;
  size: string;
  color: string;
  qty: number;
  priceCents: number;
};

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  address: jsonb("address").$type<OrderAddress>().notNull(),
  items: jsonb("items").$type<OrderItem[]>().notNull(),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
  status: text("status").notNull().default("confirmed"),
  userId: uuid("user_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
