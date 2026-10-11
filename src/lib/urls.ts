/**
 * URL helpers for Party Padi multi-domain / multi-product architecture.
 * - Marketing Site: partypadi.vercel.app (or root domain)
 * - App / Dashboard: app.partypadi.vercel.app
 */

export function getAppUrl(
  path: string = "/onboarding",
  params?: Record<string, string>
): string {
  const isBrowser = typeof window !== "undefined";
  const hostname = isBrowser ? window.location.hostname : "";
  const isVercel = hostname.includes("partypadi.vercel.app");

  // In production on Vercel, route to app.partypadi.vercel.app
  // If NEXT_PUBLIC_APP_URL is explicitly set, honor that
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  const baseUrl =
    configuredAppUrl ||
    (isVercel && !hostname.startsWith("app.")
      ? "https://app.partypadi.vercel.app"
      : "");

  const query = params && Object.keys(params).length > 0
    ? `?${new URLSearchParams(params).toString()}`
    : "";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (baseUrl) {
    return `${baseUrl.replace(/\/$/, "")}${cleanPath}${query}`;
  }
  return `${cleanPath}${query}`;
}

export function getPublicUrl(path: string = "/"): string {
  const isBrowser = typeof window !== "undefined";
  const hostname = isBrowser ? window.location.hostname : "";
  const isVercelApp = hostname.startsWith("app.");

  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const baseUrl =
    configuredSiteUrl ||
    (isVercelApp ? "https://partypadi.vercel.app" : "");

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (baseUrl) {
    return `${baseUrl.replace(/\/$/, "")}${cleanPath}`;
  }
  return cleanPath;
}
