import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, SessionData } from "./auth-session";

/**
 * Read session data from incoming request cookies in Server Components or Route Handlers
 */
export async function getServerSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!cookie || !cookie.value) {
      return null;
    }

    const decoded = decodeURIComponent(cookie.value);
    const session: SessionData = JSON.parse(decoded);
    return session;
  } catch {
    return null;
  }
}
