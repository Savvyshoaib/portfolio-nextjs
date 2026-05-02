function toObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value;
}

function toString(value, fallback = "") {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || fallback;
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  const normalized = String(value).trim();
  return normalized || fallback;
}

function splitKeywords(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => toString(entry)).filter(Boolean);
  }

  return String(value || "")
    .split(/[\n,]/g)
    .map((entry) => toString(entry))
    .filter(Boolean);
}

function withFallback(value, fallback = "") {
  const normalized = toString(value);
  if (normalized) {
    return normalized;
  }

  return toString(fallback);
}

export function keywordsToCsv(value) {
  return splitKeywords(value).join(", ");
}

export function normalizeItemSeo(inputSeo, fallbackSeo = {}) {
  const seo = toObject(inputSeo);
  const fallback = toObject(fallbackSeo);

  const metaKeywords = splitKeywords(
    seo.metaKeywords ??
      seo.keywords ??
      fallback.metaKeywords ??
      fallback.keywords
  );

  return {
    metaTitle: withFallback(seo.metaTitle ?? seo.title, fallback.metaTitle ?? fallback.title),
    metaDescription: withFallback(
      seo.metaDescription ?? seo.description,
      fallback.metaDescription ?? fallback.description
    ),
    metaKeywords,
    ogTitle: withFallback(seo.ogTitle, fallback.ogTitle),
    ogDescription: withFallback(seo.ogDescription, fallback.ogDescription),
    ogImageUrl: withFallback(seo.ogImageUrl, fallback.ogImageUrl),
  };
}

export function buildItemMetadata(seo, { title, description, keywords = [] } = {}, ogType = "article") {
  const resolved = normalizeItemSeo(seo, {
    metaTitle: title,
    metaDescription: description,
    metaKeywords: keywords,
  });

  const resolvedTitle = resolved.metaTitle || title || "";
  const resolvedDescription = resolved.metaDescription || description || "";
  const resolvedKeywords = resolved.metaKeywords.length ? resolved.metaKeywords : splitKeywords(keywords);
  const openGraphTitle = resolved.ogTitle || resolvedTitle;
  const openGraphDescription = resolved.ogDescription || resolvedDescription;
  const openGraphImages = resolved.ogImageUrl ? [{ url: resolved.ogImageUrl }] : undefined;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: resolvedKeywords.length ? resolvedKeywords : undefined,
    openGraph: {
      title: openGraphTitle,
      description: openGraphDescription,
      type: ogType,
      images: openGraphImages,
    },
    twitter: {
      card: resolved.ogImageUrl ? "summary_large_image" : "summary",
      title: openGraphTitle,
      description: openGraphDescription,
      images: resolved.ogImageUrl ? [resolved.ogImageUrl] : undefined,
    },
  };
}
