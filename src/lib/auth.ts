import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/** Fallback secret keeps local sessions working when no secret is configured. */
const SECRET = process.env.AUREL_SESSION_SECRET ?? "aurel-local-development-secret";
const SESSION_DAYS = 30;

export const SESSION_COOKIE = "aurel_session";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  memberSince: string;
};

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

/** Creates a signed, stateless session token: `{userId}.{expires}.{hmac}`. */
export function createSessionToken(userId: string): string {
  const expires = Date.now() + SESSION_DAYS * 86_400_000;
  const payload = `${userId}.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, expires, signature] = parts;
  const expected = Buffer.from(sign(`${userId}.${expires}`), "hex");
  const provided = Buffer.from(signature, "hex");
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;
  if (Number(expires) < Date.now()) return null;
  return userId;
}
