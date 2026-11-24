import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { orders, products, type OrderItem } from "@/db/schema";
import { ensureStore } from "@/db/ensure";
import { readSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { FREE_SHIPPING_CENTS, STANDARD_SHIPPING_CENTS, isEmail } from "@/lib/utils";

type IncomingItem = { slug?: unknown; name?: unknown; size?: unknown; color?: unknown; qty?: unknown };

/** Places an order from the client bag. Prices are always recomputed from the catalogue server-side. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
  const address = (body?.address ?? null) as Record<string, unknown> | null;
  const items = (body?.items ?? null) as IncomingItem[] | null;

  if (!isEmail(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (fullName.length < 2) {
    return Response.json({ error: "Please enter your full name." }, { status: 400 });
  }
  if (!address || typeof address.line1 !== "string" || !address.line1.trim() || typeof address.city !== "string" || typeof address.postalCode !== "string" || typeof address.country !== "string") {
    return Response.json({ error: "Please complete your shipping address." }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return Response.json({ error: "Your bag is empty." }, { status: 400 });
  }

  try {
    await ensureStore();

    const slugs = [...new Set(items.map((item) => item.slug).filter((slug): slug is string => typeof slug === "string"))];
    if (slugs.length === 0) {
      return Response.json({ error: "Your bag is empty." }, { status: 400 });
    }
    const rows = await db
      .select({ slug: products.slug, name: products.name, priceCents: products.priceCents })
      .from(products)
      .where(inArray(products.slug, slugs));
    const catalogue = new Map(rows.map((row) => [row.slug, row]));

    const lineItems: OrderItem[] = [];
    let subtotal = 0;
    for (const item of items) {
      const slug = String(item.slug ?? "");
      const product = catalogue.get(slug);
      if (!product) continue;
      const qty = Math.max(1, Math.min(9, Number(item.qty) || 1));
      lineItems.push({
        slug,
        name: product.name,
        size: String(item.size ?? ""),
        color: String(item.color ?? ""),
        qty,
        priceCents: product.priceCents,
      });
      subtotal += product.priceCents * qty;
    }
    if (lineItems.length === 0) {
      return Response.json({ error: "Your bag is empty." }, { status: 400 });
    }

    const shippingCents = subtotal >= FREE_SHIPPING_CENTS ? 0 : STANDARD_SHIPPING_CENTS;
    const totalCents = subtotal + shippingCents;
    const orderNumber = `AU-${Date.now().toString(36).toUpperCase()}${randomBytes(2).toString("hex").toUpperCase()}`;

    const jar = await cookies();
    const userId = readSessionToken(jar.get(SESSION_COOKIE)?.value) ?? null;

    await db.insert(orders).values({
      orderNumber,
      email,
      fullName,
      address: {
        line1: address.line1.trim(),
        line2: typeof address.line2 === "string" && address.line2.trim() ? address.line2.trim() : undefined,
        city: address.city,
        postalCode: address.postalCode,
        country: address.country,
      },
      items: lineItems,
      subtotalCents: subtotal,
      shippingCents,
      totalCents,
      userId,
    });

    return Response.json({ ok: true, orderNumber, subtotalCents: subtotal, shippingCents, totalCents });
  } catch (error) {
    console.error("[aurel] order creation failed", error);
    return Response.json({ error: "We couldn't place your order. Please try again." }, { status: 500 });
  }
}
