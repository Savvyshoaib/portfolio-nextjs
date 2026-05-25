"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { resolveLogoDimensions } from "@/lib/cms/logo-size";
import { useTheme } from "./theme-provider";

const defaultFooter = {
  description:
    "A creative-tech studio building bold brands and immersive products for the future of the web.",
  startProjectLabel: "Start a project",
  startProjectLink: "/contact",
  exploreLinks: [
    { to: "/services", label: "Services" },
    { to: "/portfolio", label: "Work" },
    { to: "/blog", label: "Journal" },
    { to: "/contact", label: "Contact" },
  ],
  legalLinks: [
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms & Conditions" },
  ],
  socials: [],
  logoUrl: "",
  logoLightUrl: "",
  logoDarkUrl: "",
  logoOnly: false,
  logoSize: "medium",
  copyrightSuffix: "All rights reserved.",
  craftedLine: "Crafted with obsession - Available worldwide",
};

const fallbackSocialIcon =
  "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12";

function SocialIcon({ d }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d={d || fallbackSocialIcon} />
    </svg>
  );
}

function formatBrand(siteName) {
  const trimmed = String(siteName || "Nova Studio").trim();
  if (!trimmed) {
    return { main: "Nova", tail: "Studio" };
  }

  const [firstWord, ...rest] = trimmed.split(" ");
  return {
    main: firstWord || "Nova",
    tail: rest.join(" "),
  };
}

function getLogoSize(size) {
  const parsed = Number(size);
  if (Number.isFinite(parsed)) {
    return Math.min(200, Math.max(24, Math.round(parsed)));
  }

  const sizeMap = {
    small: 24,
    medium: 32,
    large: 40,
    xlarge: 48,
  };

  return sizeMap[size] || 32;
}

function resolveThemedLogo({ theme, lightUrl, darkUrl, fallbackUrl }) {
  const light = String(lightUrl || "").trim();
  const dark = String(darkUrl || "").trim();
  const fallback = String(fallbackUrl || "").trim();

  if (theme === "dark") {
    return dark || fallback || light;
  }

  return light || fallback || dark;
}

export function SiteFooter({
  siteName = "Nova Studio",
  brandMark = "N",
  email = "hello@nova.studio",
  logoUrl = "",
  logoLightUrl = "",
  logoDarkUrl = "",
  logoOnly = false,
  logoSize = "medium",
  logoWidth,
  logoHeight,
  footer = defaultFooter,
}) {
  const { theme, mounted } = useTheme();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const brand = formatBrand(siteName);
  const resolvedFooter = { ...defaultFooter, ...(footer || {}) };
  const exploreLinks = Array.isArray(resolvedFooter.exploreLinks) ? resolvedFooter.exploreLinks : defaultFooter.exploreLinks;
  const legalLinks = Array.isArray(resolvedFooter.legalLinks) ? resolvedFooter.legalLinks : defaultFooter.legalLinks;
  const socials = Array.isArray(resolvedFooter.socials) ? resolvedFooter.socials : [];
  const footerLogoFallbackUrl = String(resolvedFooter.logoUrl || logoUrl || "").trim();
  const footerLogoLightUrl = String(resolvedFooter.logoLightUrl || logoLightUrl || "").trim();
  const footerLogoDarkUrl = String(resolvedFooter.logoDarkUrl || logoDarkUrl || "").trim();
  const footerLogoOnly = Boolean(resolvedFooter.logoOnly ?? logoOnly);
  const footerLogoDimensions = resolveLogoDimensions({
    width: resolvedFooter.logoWidth ?? logoWidth,
    height: resolvedFooter.logoHeight ?? logoHeight,
    size: resolvedFooter.logoSize || logoSize || "medium",
  });
  const footerEmail = String(resolvedFooter.email || email || "").trim();
  const startProjectLabel = String(resolvedFooter.startProjectLabel || defaultFooter.startProjectLabel);
  const startProjectLink = String(resolvedFooter.startProjectLink || defaultFooter.startProjectLink || "/contact");
  const activeTheme = mounted ? theme : "dark";
  const footerLogoUrl = resolveThemedLogo({
    theme: activeTheme,
    lightUrl: footerLogoLightUrl,
    darkUrl: footerLogoDarkUrl,
    fallbackUrl: footerLogoFallbackUrl,
  });

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2 mb-6">
              {footerLogoUrl ? (
                <>
                  <Image
                    src={footerLogoUrl}
                    alt={siteName || "Site Logo"}
                    width={footerLogoDimensions.width}
                    height={footerLogoDimensions.height}
                    className="rounded-lg object-contain"
                    style={{ width: footerLogoDimensions.width, height: footerLogoDimensions.height }}
                    unoptimized
                  />
                  {!footerLogoOnly ? (
                    <span className="font-semibold tracking-tight text-lg">
                      {brand.main}
                      <span className="text-neon">.</span>
                      {brand.tail}
                    </span>
                  ) : null}
                </>
              ) : (
                <>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-neon text-primary-foreground font-bold">{brandMark}</span>
                  {!footerLogoOnly ? (
                    <span className="font-semibold tracking-tight text-lg">
                      {brand.main}
                      <span className="text-neon">.</span>
                      {brand.tail}
                    </span>
                  ) : null}
                </>
              )}
            </Link>
            <p className="text-muted-foreground max-w-sm">{resolvedFooter.description}</p>
            <Link
              href={startProjectLink}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-neon px-5 py-3 text-sm font-medium text-primary-foreground hover:glow-neon transition"
            >
              {startProjectLabel}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="text-xs uppercase tracking-widest text-neon mb-4">Explore</div>
              <ul className="space-y-3">
                {exploreLinks.map((item) => (
                  <li key={item.to}>
                    <Link href={item.to} className="text-muted-foreground hover:text-foreground transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-neon mb-4">Legal</div>
              <ul className="space-y-3">
                {legalLinks.map((item) => (
                  <li key={item.to}>
                    <Link href={item.to} className="text-muted-foreground hover:text-foreground transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-neon mb-4">Contact</div>
              {footerEmail ? (
                <a href={`mailto:${footerEmail}`} className="text-muted-foreground hover:text-foreground transition whitespace-nowrap">
                  {footerEmail}
                </a>
              ) : null}
              {socials.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.url || "#"}
                      aria-label={social.label}
                      target={social.url?.startsWith("http") ? "_blank" : undefined}
                      rel={social.url?.startsWith("http") ? "noreferrer" : undefined}
                      className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-neon transition"
                    >
                      <SocialIcon d={social.iconPath} />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <div>
            &copy; {new Date().getFullYear()} {siteName}. {resolvedFooter.copyrightSuffix}
          </div>
          <div>{resolvedFooter.craftedLine}</div>
        </div>
      </div>
    </footer>
  );
}
