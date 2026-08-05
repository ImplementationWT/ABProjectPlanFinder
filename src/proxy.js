import { NextResponse } from "next/server";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/session";

const PUBLIC_PATHS = new Set(["/login", "/api/login"]);

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const authed = isValidSessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (PUBLIC_PATHS.has(pathname)) {
    if (authed && pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!authed) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
