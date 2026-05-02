const DEFAULT_BLOG_DETAIL = {
  featuredLabel: "Featured Article",
  heroDescription:
    "Explore cutting-edge insights and practical strategies for modern web development, design systems, and digital innovation.",
  author: "Studio Team",
  authorRole: "Editorial Team",
  publishedAt: "",
  readingTime: "6",
  tag: "Article",
  views: "",
  coverCaption: "Featured image",
};

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

function toDateString(value, fallback = "") {
  const input = toString(value, fallback);
  if (!input) {
    return fallback;
  }

  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  return parsed.toISOString().slice(0, 10);
}

export function normalizeBlogPayload(inputPayload, { excerpt = "", tags = [] } = {}) {
  const payload = toObject(inputPayload);
  const defaults = DEFAULT_BLOG_DETAIL;
  const firstTag = Array.isArray(tags) && tags.length ? toString(tags[0], defaults.tag) : defaults.tag;
  const fallbackExcerpt = toString(excerpt, defaults.heroDescription);
  const normalizedPublishedAt = toDateString(payload.publishedAt || payload.date, defaults.publishedAt);

  return {
    ...payload,
    featuredLabel: toString(payload.featuredLabel, defaults.featuredLabel),
    heroDescription: toString(payload.heroDescription, fallbackExcerpt),
    author: toString(payload.author, defaults.author),
    authorRole: toString(payload.authorRole, defaults.authorRole),
    publishedAt: normalizedPublishedAt,
    date: normalizedPublishedAt || toString(payload.date, ""),
    readingTime: toString(payload.readingTime, defaults.readingTime),
    tag: toString(payload.tag, firstTag),
    views: toString(payload.views, defaults.views),
    coverCaption: toString(payload.coverCaption, defaults.coverCaption),
  };
}
