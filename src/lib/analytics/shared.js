export const ANALYTICS_EXCLUDED_PREFIXES = [
  "/admin",
  "/api",
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
];

function safeString(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

export function normalizeAnalyticsPath(input) {
  const value = safeString(input);
  if (!value) {
    return "/";
  }

  let normalized = value;

  // Accept full URLs sent from the browser and reduce to pathname + query.
  if (/^https?:\/\//i.test(normalized)) {
    try {
      const url = new URL(normalized);
      normalized = `${url.pathname}${url.search || ""}`;
    } catch {
      normalized = "/";
    }
  }

  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  const [pathOnly] = normalized.split("#");
  const path = pathOnly || "/";

  // Keep query string as part of route analytics, but normalize trailing slash on pathname.
  const queryIndex = path.indexOf("?");
  const pathname = queryIndex >= 0 ? path.slice(0, queryIndex) : path;
  const query = queryIndex >= 0 ? path.slice(queryIndex) : "";

  const trimmedPathname =
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  return `${trimmedPathname || "/"}${query}`;
}

export function isTrackablePath(input) {
  const normalized = normalizeAnalyticsPath(input);
  const pathname = normalized.split("?")[0] || "/";
  return !ANALYTICS_EXCLUDED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function clampNumber(value, { min = 0, max = Number.MAX_SAFE_INTEGER, fallback = 0 } = {}) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

export function normalizeShortText(value, maxLength = 140) {
  const text = safeString(value).replace(/\s+/g, " ");
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}
