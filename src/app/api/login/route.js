import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS, createSessionToken } from "@/lib/session";

export async function POST(request) {
  const { password } = await request.json();

  if (!password || password !== process.env.SITE_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSessionToken(), SESSION_COOKIE_OPTIONS);
  return res;
}