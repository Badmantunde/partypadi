import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, SessionData } from "@/lib/auth-session";

export async function GET() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!cookie?.value) {
    return NextResponse.json({ authenticated: false, session: null });
  }

  try {
    const session: SessionData = JSON.parse(decodeURIComponent(cookie.value));
    return NextResponse.json({ authenticated: true, session });
  } catch {
    return NextResponse.json({ authenticated: false, session: null });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session: SessionData = body.session;

    if (!session || !session.username || !session.role) {
      return NextResponse.json({ error: "Invalid session payload" }, { status: 400 });
    }

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, encodeURIComponent(JSON.stringify(session)), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
      httpOnly: false,
    });

    return NextResponse.json({ success: true, session });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to set session" }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return NextResponse.json({ success: true });
}
