import { getGlobalSeoSettings } from "@/lib/cms/public";

export default async function robots() {
  const { robots, general } = await getGlobalSeoSettings();
  const rules = {
    userAgent: "*",
    allow: robots.allowIndexing === false ? [] : "/",
    disallow: [],
  };

  if (robots.allowIndexing === false) {
    rules.disallow = ["/"];
  } else if (robots.adminDisallow !== false) {
    rules.disallow = ["/admin", "/admin/*"];
  }

  const siteUrl = String(general.siteUrl || "").trim().replace(/\/$/, "");
  const sitemap = siteUrl ? `${siteUrl}/sitemap.xml` : undefined;

  return { rules, sitemap };
}

