import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);

  if (pathname.startsWith("/api/admin")) {
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    if (session) return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") && !session) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
