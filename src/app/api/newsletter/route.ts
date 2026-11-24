import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { ensureStore } from "@/db/ensure";
import { isEmail } from "@/lib/utils";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!isEmail(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    await ensureStore();
    const inserted = await db
      .insert(newsletterSubscribers)
      .values({ email, source: "storefront" })
      .onConflictDoNothing({ target: newsletterSubscribers.email })
      .returning({ id: newsletterSubscribers.id });
    return Response.json({ ok: true, already: inserted.length === 0 });
  } catch (error) {
    console.error("[aurel] newsletter subscribe failed", error);
    return Response.json({ error: "We couldn't subscribe you right now. Please try again later." }, { status: 500 });
  }
}
