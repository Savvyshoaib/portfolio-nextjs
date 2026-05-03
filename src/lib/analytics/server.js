import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { clampNumber, isTrackablePath, normalizeAnalyticsPath, normalizeShortText } from "./shared";

const TABLES = {
  visitors: "analytics_visitors",
  sessions: "analytics_sessions",
  pageViews: "analytics_page_views",
  events: "analytics_events",
  contact: "contact_submissions",
  serviceInquiries: "service_inquiries",
};

const DEFAULT_RANGE_DAYS = 30;
const MIN_RANGE_DAYS = 7;
const MAX_RANGE_DAYS = 120;
const PAGE_SIZE = 1000;
const MAX_FETCH_PAGES = 40;

function getServiceClient() {
  return createSupabaseServerClient({ useServiceRole: true });
}

function normalizeIdentifier(value) {
  const text = String(value || "").trim();
  return text.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 120);
}

function normalizeSourceValue(value, fallback = "") {
  const text = String(value || "").trim().toLowerCase();
  return text ? text.slice(0, 80) : fallback;
}

function splitFirstIp(value) {
  const text = String(value || "").trim();
  if (!text) {
    return "unknown";
  }
  return text.split(",")[0].trim() || "unknown";
}

function getRequestMeta(request) {
  const headers = request.headers;
  const ipAddress = splitFirstIp(headers.get("x-forwarded-for") || headers.get("x-real-ip"));
  const userAgent = normalizeShortText(headers.get("user-agent") || "unknown", 255);
  const country = normalizeShortText(
    headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry") || headers.get("x-country") || "",
    80
  );
  const city = normalizeShortText(headers.get("x-vercel-ip-city") || headers.get("cf-ipcity") || headers.get("x-city") || "", 120);
  const region = normalizeShortText(
    headers.get("x-vercel-ip-country-region") || headers.get("cf-region") || headers.get("x-region") || "",
    120
  );

  return {
    ipAddress,
    userAgent,
    country,
    city,
    region,
  };
}

function resolveSourceContext({ source, medium, campaign, referrer, landingUrl }) {
  let resolvedSource = normalizeSourceValue(source, "");
  let resolvedMedium = normalizeSourceValue(medium, "");
  let resolvedCampaign = normalizeShortText(campaign || "", 120);
  const resolvedReferrer = normalizeShortText(referrer || "", 255);

  if (landingUrl) {
    try {
      const url = new URL(landingUrl, "https://portfolio.local");
      const utmSource = normalizeSourceValue(url.searchParams.get("utm_source"), "");
      const utmMedium = normalizeSourceValue(url.searchParams.get("utm_medium"), "");
      const utmCampaign = normalizeShortText(url.searchParams.get("utm_campaign") || "", 120);

      if (!resolvedSource && utmSource) {
        resolvedSource = utmSource;
      }
      if (!resolvedMedium && utmMedium) {
        resolvedMedium = utmMedium;
      }
      if (!resolvedCampaign && utmCampaign) {
        resolvedCampaign = utmCampaign;
      }
    } catch {
      // Ignore malformed URL.
    }
  }

  if (!resolvedSource && resolvedReferrer) {
    try {
      const referrerUrl = new URL(resolvedReferrer);
      resolvedSource = normalizeSourceValue(referrerUrl.hostname.replace(/^www\./, ""), "referral");
      if (!resolvedMedium) {
        resolvedMedium = "referral";
      }
    } catch {
      resolvedSource = "referral";
      if (!resolvedMedium) {
        resolvedMedium = "referral";
      }
    }
  }

  if (!resolvedSource) {
    resolvedSource = "direct";
  }
  if (!resolvedMedium) {
    resolvedMedium = resolvedSource === "direct" ? "none" : "referral";
  }

  return {
    source: resolvedSource,
    medium: resolvedMedium,
    campaign: resolvedCampaign,
    referrer: resolvedReferrer,
  };
}

async function fetchRowsPaged(queryFactory, { pageSize = PAGE_SIZE, maxPages = MAX_FETCH_PAGES } = {}) {
  const rows = [];

  for (let page = 0; page < maxPages; page += 1) {
    const start = page * pageSize;
    const end = start + pageSize - 1;
    const { data, error } = await queryFactory().range(start, end);

    if (error) {
      throw error;
    }

    if (!data || !data.length) {
      break;
    }

    rows.push(...data);

    if (data.length < pageSize) {
      break;
    }
  }

  return rows;
}

function toDateKey(timestamp) {
  const value = String(timestamp || "");
  return value.length >= 10 ? value.slice(0, 10) : "";
}

function toIsoOrNull(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function formatTrendLabel(dateKey) {
  if (!dateKey) {
    return "";
  }

  const date = new Date(`${dateKey}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return dateKey;
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function buildTrendBuckets(days) {
  const normalizedDays = clampNumber(days, {
    min: MIN_RANGE_DAYS,
    max: MAX_RANGE_DAYS,
    fallback: DEFAULT_RANGE_DAYS,
  });

  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - (normalizedDays - 1));

  const buckets = [];
  const index = new Map();

  for (let offset = 0; offset < normalizedDays; offset += 1) {
    const cursor = new Date(start);
    cursor.setUTCDate(start.getUTCDate() + offset);
    const dateKey = cursor.toISOString().slice(0, 10);
    const bucket = {
      date: dateKey,
      label: formatTrendLabel(dateKey),
      visitors: 0,
      sessions: 0,
      pageViews: 0,
      contactSubmissions: 0,
      serviceInquiries: 0,
      events: 0,
    };
    buckets.push(bucket);
    index.set(dateKey, bucket);
  }

  return {
    days: normalizedDays,
    startIso: `${start.toISOString().slice(0, 10)}T00:00:00.000Z`,
    buckets,
    index,
  };
}

function summarizeTopPages(pageStats, { by = "views", limit = 8 } = {}) {
  const rows = Array.from(pageStats.entries()).map(([pagePath, stats]) => {
    const views = stats.views || 0;
    const totalDurationMs = stats.totalDurationMs || 0;
    const avgDurationMs = views > 0 ? Math.round(totalDurationMs / views) : 0;
    return {
      pagePath,
      views,
      totalDurationMs,
      avgDurationMs,
      totalDurationSeconds: Number((totalDurationMs / 1000).toFixed(1)),
      avgDurationSeconds: Number((avgDurationMs / 1000).toFixed(1)),
    };
  });

  const sorted = rows.sort((a, b) => (b[by] || 0) - (a[by] || 0));
  return sorted.slice(0, limit);
}

function buildEmptyAnalytics(days = DEFAULT_RANGE_DAYS) {
  const resolvedDays = clampNumber(days, {
    min: MIN_RANGE_DAYS,
    max: MAX_RANGE_DAYS,
    fallback: DEFAULT_RANGE_DAYS,
  });

  return {
    rangeDays: resolvedDays,
    generatedAt: new Date().toISOString(),
    totals: {
      contactSubmissions: 0,
      serviceInquiries: 0,
      contactSubmitters: 0,
      serviceSubmitters: 0,
      visitors: 0,
      activeVisitors24h: 0,
      sessions: 0,
      pageViews: 0,
      events: 0,
    },
    rangeTotals: {
      visitors: 0,
      sessions: 0,
      pageViews: 0,
      contactSubmissions: 0,
      serviceInquiries: 0,
      events: 0,
    },
    trends: [],
    visitors: {
      topCountries: [],
      topCities: [],
      sources: [],
    },
    pages: {
      mostVisited: [],
      longestEngagement: [],
    },
    interactions: {
      eventTypes: [],
      topPages: [],
    },
  };
}

export async function recordAnalyticsSession(request, body = {}) {
  const visitorId = normalizeIdentifier(body.visitorId);
  const sessionId = normalizeIdentifier(body.sessionId);
  const pagePath = normalizeAnalyticsPath(body.pagePath || "/");

  if (!visitorId || !sessionId || !isTrackablePath(pagePath)) {
    return { ok: false, error: "Invalid analytics session payload." };
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return { ok: false, error: "Supabase configuration error." };
  }

  const requestMeta = getRequestMeta(request);
  const sourceContext = resolveSourceContext({
    source: body.source,
    medium: body.medium,
    campaign: body.campaign,
    referrer: body.referrer,
    landingUrl: body.landingUrl,
  });

  const nowIso = new Date().toISOString();

  const { data: existingVisitor, error: visitorReadError } = await supabase
    .from(TABLES.visitors)
    .select("visitor_id")
    .eq("visitor_id", visitorId)
    .maybeSingle();

  if (visitorReadError) {
    return { ok: false, error: visitorReadError.message };
  }

  if (existingVisitor?.visitor_id) {
    const { error: visitorUpdateError } = await supabase
      .from(TABLES.visitors)
      .update({
        last_seen_at: nowIso,
        last_country: requestMeta.country || null,
        last_city: requestMeta.city || null,
        last_page: pagePath,
        user_agent: requestMeta.userAgent,
      })
      .eq("visitor_id", visitorId);

    if (visitorUpdateError) {
      return { ok: false, error: visitorUpdateError.message };
    }
  } else {
    const { error: visitorInsertError } = await supabase.from(TABLES.visitors).insert({
      visitor_id: visitorId,
      first_seen_at: nowIso,
      last_seen_at: nowIso,
      first_source: sourceContext.source,
      first_medium: sourceContext.medium,
      first_referrer: sourceContext.referrer || null,
      first_country: requestMeta.country || null,
      first_city: requestMeta.city || null,
      last_country: requestMeta.country || null,
      last_city: requestMeta.city || null,
      last_page: pagePath,
      user_agent: requestMeta.userAgent,
    });

    if (visitorInsertError) {
      return { ok: false, error: visitorInsertError.message };
    }
  }

  const { data: existingSession, error: sessionReadError } = await supabase
    .from(TABLES.sessions)
    .select("session_id")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (sessionReadError) {
    return { ok: false, error: sessionReadError.message };
  }

  if (existingSession?.session_id) {
    const { error: sessionUpdateError } = await supabase
      .from(TABLES.sessions)
      .update({
        last_seen_at: nowIso,
        last_page: pagePath,
        country: requestMeta.country || null,
        city: requestMeta.city || null,
        region: requestMeta.region || null,
        ip_address: requestMeta.ipAddress,
        user_agent: requestMeta.userAgent,
      })
      .eq("session_id", sessionId);

    if (sessionUpdateError) {
      return { ok: false, error: sessionUpdateError.message };
    }
  } else {
    const { error: sessionInsertError } = await supabase.from(TABLES.sessions).insert({
      session_id: sessionId,
      visitor_id: visitorId,
      started_at: nowIso,
      last_seen_at: nowIso,
      first_page: pagePath,
      last_page: pagePath,
      source: sourceContext.source,
      medium: sourceContext.medium,
      campaign: sourceContext.campaign || null,
      referrer: sourceContext.referrer || null,
      country: requestMeta.country || null,
      city: requestMeta.city || null,
      region: requestMeta.region || null,
      ip_address: requestMeta.ipAddress,
      user_agent: requestMeta.userAgent,
    });

    if (sessionInsertError) {
      return { ok: false, error: sessionInsertError.message };
    }
  }

  return {
    ok: true,
    data: {
      visitorId,
      sessionId,
      pagePath,
      source: sourceContext.source,
      medium: sourceContext.medium,
      country: requestMeta.country || null,
      city: requestMeta.city || null,
    },
  };
}

export async function recordAnalyticsPageView(request, body = {}) {
  const visitorId = normalizeIdentifier(body.visitorId);
  const sessionId = normalizeIdentifier(body.sessionId);
  const pagePath = normalizeAnalyticsPath(body.pagePath || "/");

  if (!visitorId || !sessionId || !isTrackablePath(pagePath)) {
    return { ok: false, error: "Invalid page view payload." };
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return { ok: false, error: "Supabase configuration error." };
  }

  const requestMeta = getRequestMeta(request);
  const startedAt = toIsoOrNull(body.startedAt);
  const endedAt = toIsoOrNull(body.endedAt);
  const durationMs = clampNumber(body.durationMs, {
    min: 0,
    max: 30 * 60 * 1000,
    fallback: 0,
  });

  const { error } = await supabase.from(TABLES.pageViews).insert({
    visitor_id: visitorId,
    session_id: sessionId,
    page_path: pagePath,
    duration_ms: durationMs,
    started_at: startedAt,
    ended_at: endedAt,
    source: normalizeSourceValue(body.source, ""),
    medium: normalizeSourceValue(body.medium, ""),
    country: requestMeta.country || null,
    city: requestMeta.city || null,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function recordAnalyticsEvent(_request, body = {}) {
  const visitorId = normalizeIdentifier(body.visitorId);
  const sessionId = normalizeIdentifier(body.sessionId);
  const pagePath = normalizeAnalyticsPath(body.pagePath || "/");
  const eventType = normalizeSourceValue(body.eventType, "");

  if (!visitorId || !sessionId || !eventType || !isTrackablePath(pagePath)) {
    return { ok: false, error: "Invalid analytics event payload." };
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return { ok: false, error: "Supabase configuration error." };
  }

  const eventData =
    body.eventData && typeof body.eventData === "object" && !Array.isArray(body.eventData)
      ? body.eventData
      : {};

  const { error } = await supabase.from(TABLES.events).insert({
    visitor_id: visitorId,
    session_id: sessionId,
    page_path: pagePath,
    event_type: eventType,
    event_data: eventData,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function getDashboardAnalytics({ days = DEFAULT_RANGE_DAYS } = {}) {
  const fallback = buildEmptyAnalytics(days);
  const supabase = getServiceClient();

  if (!supabase) {
    return fallback;
  }

  try {
    const trendState = buildTrendBuckets(days);
    const now = Date.now();
    const activeSinceIso = new Date(now - 24 * 60 * 60 * 1000).toISOString();

    const [
      contactCountResult,
      serviceCountResult,
      visitorCountResult,
      activeVisitorCountResult,
      sessionCountResult,
      pageViewCountResult,
      eventCountResult,
    ] = await Promise.all([
      supabase.from(TABLES.contact).select("*", { count: "exact", head: true }),
      supabase.from(TABLES.serviceInquiries).select("*", { count: "exact", head: true }),
      supabase.from(TABLES.visitors).select("*", { count: "exact", head: true }),
      supabase.from(TABLES.visitors).select("*", { count: "exact", head: true }).gte("last_seen_at", activeSinceIso),
      supabase.from(TABLES.sessions).select("*", { count: "exact", head: true }),
      supabase.from(TABLES.pageViews).select("*", { count: "exact", head: true }),
      supabase.from(TABLES.events).select("*", { count: "exact", head: true }),
    ]);

    const [contactEmails, serviceEmails, contactRows, serviceRows, sessionRows, pageViewRows, eventRows] =
      await Promise.all([
        fetchRowsPaged(() =>
          supabase
            .from(TABLES.contact)
            .select("email, created_at")
            .not("email", "is", null)
            .order("created_at", { ascending: false })
        ),
        fetchRowsPaged(() =>
          supabase
            .from(TABLES.serviceInquiries)
            .select("email, created_at")
            .not("email", "is", null)
            .order("created_at", { ascending: false })
        ),
        fetchRowsPaged(() =>
          supabase
            .from(TABLES.contact)
            .select("created_at")
            .gte("created_at", trendState.startIso)
            .order("created_at", { ascending: true })
        ),
        fetchRowsPaged(() =>
          supabase
            .from(TABLES.serviceInquiries)
            .select("created_at")
            .gte("created_at", trendState.startIso)
            .order("created_at", { ascending: true })
        ),
        fetchRowsPaged(() =>
          supabase
            .from(TABLES.sessions)
            .select("created_at, visitor_id, source, medium, country, city")
            .gte("created_at", trendState.startIso)
            .order("created_at", { ascending: true })
        ),
        fetchRowsPaged(() =>
          supabase
            .from(TABLES.pageViews)
            .select("created_at, page_path, duration_ms")
            .gte("created_at", trendState.startIso)
            .order("created_at", { ascending: true })
        ),
        fetchRowsPaged(() =>
          supabase
            .from(TABLES.events)
            .select("created_at, event_type, page_path")
            .gte("created_at", trendState.startIso)
            .order("created_at", { ascending: true })
        ),
      ]);

    const uniqueContactSubmitters = new Set(
      contactEmails.map((row) => String(row.email || "").trim().toLowerCase()).filter(Boolean)
    );
    const uniqueServiceSubmitters = new Set(
      serviceEmails.map((row) => String(row.email || "").trim().toLowerCase()).filter(Boolean)
    );

    for (const row of contactRows) {
      const key = toDateKey(row.created_at);
      const bucket = trendState.index.get(key);
      if (bucket) {
        bucket.contactSubmissions += 1;
      }
    }

    for (const row of serviceRows) {
      const key = toDateKey(row.created_at);
      const bucket = trendState.index.get(key);
      if (bucket) {
        bucket.serviceInquiries += 1;
      }
    }

    const visitorsByDay = new Map();
    const countries = new Map();
    const cities = new Map();
    const sources = new Map();

    for (const row of sessionRows) {
      const key = toDateKey(row.created_at);
      const bucket = trendState.index.get(key);
      if (bucket) {
        bucket.sessions += 1;
      }

      if (key) {
        const visitorsForDay = visitorsByDay.get(key) || new Set();
        visitorsForDay.add(String(row.visitor_id || ""));
        visitorsByDay.set(key, visitorsForDay);
      }

      const countryName = normalizeShortText(row.country || "Unknown", 80) || "Unknown";
      const cityName = normalizeShortText(row.city || "Unknown", 120) || "Unknown";
      const sourceName = normalizeSourceValue(row.source || "direct", "direct");
      const mediumName = normalizeSourceValue(row.medium || "none", "none");

      const countryItem = countries.get(countryName) || { country: countryName, sessions: 0, visitors: new Set() };
      countryItem.sessions += 1;
      countryItem.visitors.add(String(row.visitor_id || ""));
      countries.set(countryName, countryItem);

      const cityKey = `${cityName}|||${countryName}`;
      const cityItem = cities.get(cityKey) || {
        city: cityName,
        country: countryName,
        sessions: 0,
        visitors: new Set(),
      };
      cityItem.sessions += 1;
      cityItem.visitors.add(String(row.visitor_id || ""));
      cities.set(cityKey, cityItem);

      const sourceKey = `${sourceName}|||${mediumName}`;
      const sourceItem = sources.get(sourceKey) || { source: sourceName, medium: mediumName, sessions: 0 };
      sourceItem.sessions += 1;
      sources.set(sourceKey, sourceItem);
    }

    for (const [day, visitorsSet] of visitorsByDay.entries()) {
      const bucket = trendState.index.get(day);
      if (bucket) {
        bucket.visitors = visitorsSet.size;
      }
    }

    const pageStats = new Map();
    for (const row of pageViewRows) {
      const key = toDateKey(row.created_at);
      const bucket = trendState.index.get(key);
      if (bucket) {
        bucket.pageViews += 1;
      }

      const pagePath = normalizeAnalyticsPath(row.page_path || "/");
      const duration = clampNumber(row.duration_ms, { min: 0, max: 30 * 60 * 1000, fallback: 0 });

      const pageItem = pageStats.get(pagePath) || { views: 0, totalDurationMs: 0 };
      pageItem.views += 1;
      pageItem.totalDurationMs += duration;
      pageStats.set(pagePath, pageItem);
    }

    const eventsByType = new Map();
    const eventsByPage = new Map();
    for (const row of eventRows) {
      const key = toDateKey(row.created_at);
      const bucket = trendState.index.get(key);
      if (bucket) {
        bucket.events += 1;
      }

      const eventType = normalizeSourceValue(row.event_type, "unknown");
      const pagePath = normalizeAnalyticsPath(row.page_path || "/");

      eventsByType.set(eventType, (eventsByType.get(eventType) || 0) + 1);
      eventsByPage.set(pagePath, (eventsByPage.get(pagePath) || 0) + 1);
    }

    const topCountries = Array.from(countries.values())
      .map((item) => ({
        country: item.country,
        sessions: item.sessions,
        visitors: item.visitors.size,
      }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 8);

    const topCities = Array.from(cities.values())
      .map((item) => ({
        city: item.city,
        country: item.country,
        sessions: item.sessions,
        visitors: item.visitors.size,
      }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 8);

    const topSources = Array.from(sources.values())
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 8);

    const topEventTypes = Array.from(eventsByType.entries())
      .map(([eventType, count]) => ({ eventType, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const topEventPages = Array.from(eventsByPage.entries())
      .map(([pagePath, count]) => ({ pagePath, events: count }))
      .sort((a, b) => b.events - a.events)
      .slice(0, 8);

    const mostVisitedPages = summarizeTopPages(pageStats, { by: "views", limit: 8 });
    const longestEngagementPages = summarizeTopPages(pageStats, { by: "avgDurationMs", limit: 8 });

    const rangeTotals = trendState.buckets.reduce(
      (accumulator, bucket) => ({
        visitors: accumulator.visitors + bucket.visitors,
        sessions: accumulator.sessions + bucket.sessions,
        pageViews: accumulator.pageViews + bucket.pageViews,
        contactSubmissions: accumulator.contactSubmissions + bucket.contactSubmissions,
        serviceInquiries: accumulator.serviceInquiries + bucket.serviceInquiries,
        events: accumulator.events + bucket.events,
      }),
      {
        visitors: 0,
        sessions: 0,
        pageViews: 0,
        contactSubmissions: 0,
        serviceInquiries: 0,
        events: 0,
      }
    );

    return {
      rangeDays: trendState.days,
      generatedAt: new Date().toISOString(),
      totals: {
        contactSubmissions: contactCountResult.count || 0,
        serviceInquiries: serviceCountResult.count || 0,
        contactSubmitters: uniqueContactSubmitters.size,
        serviceSubmitters: uniqueServiceSubmitters.size,
        visitors: visitorCountResult.count || 0,
        activeVisitors24h: activeVisitorCountResult.count || 0,
        sessions: sessionCountResult.count || 0,
        pageViews: pageViewCountResult.count || 0,
        events: eventCountResult.count || 0,
      },
      rangeTotals,
      trends: trendState.buckets,
      visitors: {
        topCountries,
        topCities,
        sources: topSources,
      },
      pages: {
        mostVisited: mostVisitedPages,
        longestEngagement: longestEngagementPages,
      },
      interactions: {
        eventTypes: topEventTypes,
        topPages: topEventPages,
      },
    };
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    return {
      ...fallback,
      error: error instanceof Error ? error.message : "Failed to load analytics data.",
    };
  }
}
