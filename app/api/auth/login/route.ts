import { NextResponse } from "next/server";
import { ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_COOKIE, createSessionToken, sessionCookieOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  if (email?.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSessionToken(ADMIN_EMAIL), sessionCookieOptions);
  return res;
}
