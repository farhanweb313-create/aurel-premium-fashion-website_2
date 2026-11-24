import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { ensureStore } from "@/db/ensure";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { setSessionCookie, toSessionUser } from "@/lib/session";
import { isEmail } from "@/lib/utils";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!isEmail(email) || !password) {
    return Response.json({ error: "Enter your email and password to sign in." }, { status: 400 });
  }

  try {
    await ensureStore();
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const user = rows[0];
    // Always run a hash comparison so timing doesn't reveal whether the email exists.
    const ok = verifyPassword(password, user?.passwordHash ?? hashPassword("aurel-timing-equaliser"));
    if (!user || !ok) {
      return Response.json({ error: "Email or password is incorrect." }, { status: 401 });
    }
    await setSessionCookie(request, user.id);
    return Response.json({ user: toSessionUser(user) });
  } catch (error) {
    console.error("[aurel] login failed", error);
    return Response.json({ error: "We couldn't sign you in right now. Please try again." }, { status: 500 });
  }
}
