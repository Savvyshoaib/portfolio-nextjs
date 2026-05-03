"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { isTrackablePath, normalizeAnalyticsPath, normalizeShortText } from "@/lib/analytics/shared";

const VISITOR_STORAGE_KEY = "portfolio_analytics_visitor_id";
const SESSION_STORAGE_KEY = "portfolio_analytics_session_id";
const PAGE_DURATION_LIMIT_MS = 30 * 60 * 1000;

function getOrCreateId(storage, key) {
  try {
    const existing = storage.getItem(key);
    if (existing) {
      return existing;
    }

    const nextId = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    storage.setItem(key, nextId);
    return nextId;
  } catch {
    return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

function getPathWithQuery(pathname, searchParams) {
  const params = searchParams?.toString();
  if (params) {
    return normalizeAnalyticsPath(`${pathname || "/"}?${params}`);
  }
  return normalizeAnalyticsPath(pathname || "/");
}

function sendJson(url, payload, { beacon = false } = {}) {
  const body = JSON.stringify(payload);

  if (beacon && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(url, blob);
    return;
  }

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: beacon,
  }).catch(() => {
    // Tracking should never break user flow.
  });
}

function getTrafficContext() {
  if (typeof window === "undefined") {
    return {
      source: "",
      medium: "",
      campaign: "",
      referrer: "",
      landingUrl: "",
    };
  }

  const url = new URL(window.location.href);
  return {
    source: normalizeShortText(url.searchParams.get("utm_source") || "", 80),
    medium: normalizeShortText(url.searchParams.get("utm_medium") || "", 80),
    campaign: normalizeShortText(url.searchParams.get("utm_campaign") || "", 120),
    referrer: normalizeShortText(document.referrer || "", 255),
    landingUrl: normalizeShortText(url.toString(), 500),
  };
}

export function SiteAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = useMemo(() => searchParams?.toString() || "", [searchParams]);
  const [isReady, setIsReady] = useState(false);

  const visitorIdRef = useRef("");
  const sessionIdRef = useRef("");
  const pageVisitRef = useRef({
    pagePath: "",
    startedAt: 0,
    source: "",
    medium: "",
  });
  const currentPathRef = useRef("");
  const scrollMilestonesRef = useRef(new Set());
  const interactionThrottleRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    visitorIdRef.current = getOrCreateId(window.localStorage, VISITOR_STORAGE_KEY);
    sessionIdRef.current = getOrCreateId(window.sessionStorage, SESSION_STORAGE_KEY);
    setIsReady(true);
  }, []);

  useEffect(() => {
    const pathWithQuery = getPathWithQuery(pathname, searchParams);
    currentPathRef.current = pathWithQuery;
    scrollMilestonesRef.current = new Set();

    if (!isReady || !visitorIdRef.current || !sessionIdRef.current) {
      return;
    }

    const now = Date.now();
    const previousVisit = pageVisitRef.current;

    if (previousVisit.pagePath && previousVisit.startedAt && isTrackablePath(previousVisit.pagePath)) {
      const durationMs = Math.min(PAGE_DURATION_LIMIT_MS, Math.max(0, now - previousVisit.startedAt));
      sendJson(
        "/api/analytics/page-view",
        {
          visitorId: visitorIdRef.current,
          sessionId: sessionIdRef.current,
          pagePath: previousVisit.pagePath,
          startedAt: new Date(previousVisit.startedAt).toISOString(),
          endedAt: new Date(now).toISOString(),
          durationMs,
          source: previousVisit.source,
          medium: previousVisit.medium,
        },
        { beacon: false }
      );
    }

    if (!isTrackablePath(pathWithQuery)) {
      pageVisitRef.current = {
        pagePath: "",
        startedAt: 0,
        source: "",
        medium: "",
      };
      return;
    }

    const trafficContext = getTrafficContext();
    sendJson("/api/analytics/session", {
      visitorId: visitorIdRef.current,
      sessionId: sessionIdRef.current,
      pagePath: pathWithQuery,
      source: trafficContext.source,
      medium: trafficContext.medium,
      campaign: trafficContext.campaign,
      referrer: trafficContext.referrer,
      landingUrl: trafficContext.landingUrl,
    });

    pageVisitRef.current = {
      pagePath: pathWithQuery,
      startedAt: now,
      source: trafficContext.source,
      medium: trafficContext.medium,
    };
  }, [isReady, pathname, queryString, searchParams]);

  useEffect(() => {
    function flushCurrentPage({ beacon = true } = {}) {
      const activeVisit = pageVisitRef.current;
      if (!activeVisit.pagePath || !activeVisit.startedAt || !isTrackablePath(activeVisit.pagePath)) {
        return;
      }

      const endedAtMs = Date.now();
      const durationMs = Math.min(PAGE_DURATION_LIMIT_MS, Math.max(0, endedAtMs - activeVisit.startedAt));
      sendJson(
        "/api/analytics/page-view",
        {
          visitorId: visitorIdRef.current,
          sessionId: sessionIdRef.current,
          pagePath: activeVisit.pagePath,
          startedAt: new Date(activeVisit.startedAt).toISOString(),
          endedAt: new Date(endedAtMs).toISOString(),
          durationMs,
          source: activeVisit.source,
          medium: activeVisit.medium,
        },
        { beacon }
      );
    }

    function onPageHide() {
      flushCurrentPage({ beacon: true });
    }

    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("beforeunload", onPageHide);

    return () => {
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("beforeunload", onPageHide);
      flushCurrentPage({ beacon: true });
    };
  }, []);

  useEffect(() => {
    function trackEvent(eventType, eventData = {}, { beacon = false } = {}) {
      const path = currentPathRef.current;
      if (!visitorIdRef.current || !sessionIdRef.current || !path || !isTrackablePath(path)) {
        return;
      }

      sendJson(
        "/api/analytics/event",
        {
          visitorId: visitorIdRef.current,
          sessionId: sessionIdRef.current,
          pagePath: path,
          eventType,
          eventData,
        },
        { beacon }
      );
    }

    function onScroll() {
      const doc = document.documentElement;
      const scrollHeight = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const progress = Math.round((window.scrollY / scrollHeight) * 100);
      const milestones = [25, 50, 75, 100];

      for (const milestone of milestones) {
        if (progress >= milestone && !scrollMilestonesRef.current.has(milestone)) {
          scrollMilestonesRef.current.add(milestone);
          trackEvent("scroll_depth", { milestone });
        }
      }
    }

    function onClick(event) {
      const now = Date.now();
      if (now - interactionThrottleRef.current < 250) {
        return;
      }
      interactionThrottleRef.current = now;

      const element = event.target?.closest?.("a,button,[data-track-event]");
      if (!element) {
        return;
      }

      const text = normalizeShortText(element.textContent || "", 80);
      const href = element.tagName.toLowerCase() === "a" ? normalizeShortText(element.getAttribute("href") || "", 180) : "";
      const id = normalizeShortText(element.getAttribute("id") || "", 80);

      trackEvent("click", {
        tag: element.tagName.toLowerCase(),
        text,
        href,
        id,
      });
    }

    function onSubmit(event) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) {
        return;
      }

      const formId = normalizeShortText(form.getAttribute("id") || "", 80);
      const action = normalizeShortText(form.getAttribute("action") || "", 180);

      trackEvent("form_submit", {
        formId,
        action,
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  return null;
}
