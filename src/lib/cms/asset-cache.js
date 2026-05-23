/** Append a version query param so browsers/CDNs fetch updated assets (e.g. favicon). */
export function withAssetCacheBust(url, version) {
  const trimmed = String(url || "").trim();
  if (!trimmed) {
    return "";
  }

  if (!version) {
    return trimmed;
  }

  const cacheKey = String(version);

  try {
    const parsed = new URL(trimmed);
    parsed.searchParams.set("v", cacheKey);
    return parsed.toString();
  } catch {
    const separator = trimmed.includes("?") ? "&" : "?";
    return `${trimmed}${separator}v=${encodeURIComponent(cacheKey)}`;
  }
}

export function getFaviconHref(seo = {}) {
  return withAssetCacheBust(seo.faviconUrl, seo.faviconVersion);
}

/** Same-origin path served by /api/favicon (rewritten from /favicon.ico). */
export function getSiteFaviconPath(seo = {}) {
  if (!String(seo.faviconUrl || "").trim()) {
    return null;
  }

  const version = seo.faviconVersion;
  if (version) {
    return `/favicon.ico?v=${encodeURIComponent(version)}`;
  }

  return "/favicon.ico";
}
