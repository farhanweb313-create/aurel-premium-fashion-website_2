import { db } from "@/db";
import { users } from "@/db/schema";
import { ensureStore } from "@/db/ensure";
import { hashPassword } from "@/lib/auth";
import { setSessionCookie, toSessionUser } from "@/lib/session";
import { isEmail } from "@/lib/utils";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (name.length < 2) return Response.json({ error: "Please enter your full name." }, { status: 400 });
  if (!isEmail(email)) return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (password.length < 8) return Response.json({ error: "Choose a password of at least 8 characters." }, { status: 400 });

  try {
    await ensureStore();
    const inserted = await db
      .insert(users)
      .values({ email, name, passwordHash: hashPassword(password) })
      .onConflictDoNothing({ target: users.email })
      .returning({ id: users.id, name: users.name, email: users.email, createdAt: users.createdAt });

    const user = inserted[0];
    if (!user) {
      return Response.json({ error: "An account with this email already exists. Try signing in instead." }, { status: 409 });
    }
    await setSessionCookie(request, user.id);
    return Response.json({ user: toSessionUser(user) });
  } catch (error) {
    console.error("[aurel] register failed", error);
    return Response.json({ error: "We couldn't create your account right now. Please try again." }, { status: 500 });
  }
}
