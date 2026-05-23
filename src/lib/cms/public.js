import "server-only";
import { cache } from "react";
import { getSiteFaviconPath } from "./asset-cache";
import { getCmsSnapshot } from "./server";
import { normalizeBlogPayload } from "./blog-detail";

function toMetadataBase(siteUrl) {
  try {
    return new URL(siteUrl);
  } catch {
    return undefined;
  }
}

function toKeywords(rawKeywords) {
  if (Array.isArray(rawKeywords)) {
    return rawKeywords;
  }

  return String(rawKeywords || "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

export const getPublicSiteData = cache(async function getPublicSiteData() {
  const snapshot = await getCmsSnapshot();
  const { settings, sections, content } = snapshot;

  return {
    settings,
    sections,
    services: content.services.map((item) => ({
      ...item,
      title: item.title,
      desc: item.excerpt,
      icon: item.payload?.icon || "Sparkles",
    })),
    portfolio: content.portfolio.map((item) => ({
      ...item,
      title: item.title,
      tag: item.excerpt,
      year: item.payload?.year || "",
      color: item.payload?.color || "from-accent/40 to-accent",
      size: item.payload?.size || "sm",
    })),
    blogPosts: content.blog.map((item) => {
      const payload = normalizeBlogPayload(item.payload || {}, {
        excerpt: item.excerpt || "",
        tags: item.tags || [],
      });

      return {
        ...item,
        payload,
        title: item.title,
        excerpt: item.excerpt,
        tag: payload.tag || "Article",
        date: payload.publishedAt || payload.date || "",
      };
    }),
    testimonials: content.testimonials.map((item) => ({
      ...item,
      quote: item.title,
      name: item.payload?.name || "Anonymous",
      role: item.payload?.role || item.excerpt || "",
    })),
    techStack: content.techStack.map((item) => item.title).filter(Boolean),
  };
});

export const getGlobalSeoSettings = cache(async function getGlobalSeoSettings() {
  const data = await getPublicSiteData();
  return {
    seo: data.settings.seo || {},
    pageSeo: data.settings.pageSeo || {},
    robots: data.settings.robots || {},
    general: data.settings.general || {},
  };
});

export async function buildPageMetadata(pageKey = "home") {
  const { seo, pageSeo, robots, general } = await getGlobalSeoSettings();
  const selectedSeo = pageSeo[pageKey] || {};
  const title = selectedSeo.title || seo.title;
  const description = selectedSeo.description || seo.description;
  const keywords = toKeywords(selectedSeo.keywords || seo.keywords);
  const ogTitle = selectedSeo.ogTitle || seo.ogTitle || title;
  const ogDescription = selectedSeo.ogDescription || seo.ogDescription || description;
  const ogImageUrl = selectedSeo.ogImageUrl || seo.ogImageUrl || undefined;

  const metadata = {
    title,
    description,
    keywords,
    authors: [{ name: general.siteName || "Website" }],
    twitter: {
      card: seo.twitterCard || "summary_large_image",
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    robots: {
      index: robots.allowIndexing ?? true,
      follow: robots.allowFollow ?? true,
    },
  };

  const metadataBase = toMetadataBase(general.siteUrl);
  if (metadataBase) {
    metadata.metadataBase = metadataBase;
  }

  const faviconPath = getSiteFaviconPath(seo);
  if (faviconPath) {
    metadata.icons = {
      icon: faviconPath,
      shortcut: faviconPath,
      apple: faviconPath,
    };
  }

  return metadata;
}

export function getAdminNoIndexMetadata() {
  return {
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}
