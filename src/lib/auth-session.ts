import { UserProfile } from "@/types";

export interface SessionData {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: "partygoer" | "organizer";
  roles?: ("partygoer" | "organizer")[];
  campus: string;
}

export const SESSION_COOKIE_NAME = "pp_session";

/**
 * Set session cookie in the browser (client-side)
 */
export function setClientSession(user: UserProfile | null) {
  if (typeof document === "undefined") return;

  if (!user) {
    document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    return;
  }

  const sessionData: SessionData = {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    roles: user.roles || [user.role],
    campus: user.campus || "Main Campus",
  };

  const serialized = encodeURIComponent(JSON.stringify(sessionData));
  document.cookie = `${SESSION_COOKIE_NAME}=${serialized}; path=/; max-age=2592000; SameSite=Lax`;
}

/**
 * Read session cookie in the browser (client-side)
 */
export function getClientSession(): SessionData | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${SESSION_COOKIE_NAME}=`));

  if (!match) return null;

  try {
    const value = decodeURIComponent(match.split("=")[1]);
    return JSON.parse(value);
  } catch {
    return null;
  }
}
