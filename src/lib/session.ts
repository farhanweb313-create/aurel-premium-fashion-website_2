import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSessionToken, readSessionToken, SESSION_COOKIE, type SessionUser } from "@/lib/auth";

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function cookieOptions(request: Request) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: new URL(request.url).protocol === "https:",
    path: "/",
    maxAge: MAX_AGE,
  };
}

export type UserRecord = { id: string; name: string; email: string; createdAt: Date };

export function toSessionUser(row: UserRecord): SessionUser {
  return { id: row.id, name: row.name, email: row.email, memberSince: row.createdAt.toISOString() };
}

export async function setSessionCookie(request: Request, userId: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionToken(userId), cookieOptions(request));
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

/** Resolves the signed session cookie to a user, or null when signed out. */
export async function currentUser(): Promise<SessionUser | null> {
  try {
    const jar = await cookies();
    const userId = readSessionToken(jar.get(SESSION_COOKIE)?.value);
    if (!userId) return null;
    const rows = await db
      .select({ id: users.id, name: users.name, email: users.email, createdAt: users.createdAt })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    return rows[0] ? toSessionUser(rows[0]) : null;
  } catch (error) {
    console.error("[aurel] currentUser:", error);
    return null;
  }
}
