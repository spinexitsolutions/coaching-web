/** Edge + Node compatible session helpers (Web Crypto HMAC-signed cookie). */
export const SESSION_COOKIE = "lumina_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@lumina.academy";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "lumina@2026";
const SECRET = process.env.AUTH_SECRET || "lumina-dev-secret-change-me";

const enc = new TextEncoder();

function b64url(input: string) {
  return btoa(unescape(encodeURIComponent(input))).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function fromB64url(input: string) {
  const s = input.replace(/-/g, "+").replace(/_/g, "/");
  return decodeURIComponent(escape(atob(s + "===".slice((s.length + 3) % 4))));
}

async function hmac(data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(email: string) {
  const payload = b64url(JSON.stringify({ e: email, exp: Date.now() + MAX_AGE * 1000 }));
  return `${payload}.${await hmac(payload)}`;
}

export async function verifySessionToken(token?: string | null): Promise<{ email: string } | null> {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = await hmac(payload);
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff !== 0) return null;
  try {
    const data = JSON.parse(fromB64url(payload)) as { e: string; exp: number };
    if (data.exp < Date.now()) return null;
    return { email: data.e };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};
