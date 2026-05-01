"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";

const defaultFooter = {
  description:
    "A digital studio crafting bold brands, premium interfaces, and award-winning web experiences.",
  exploreLinks: [
    { to: "/services", label: "Services" },
    { to: "/portfolio", label: "Work" },
    { to: "/blog", label: "Journal" },
    { to: "/contact", label: "Contact" },
  ],
  socials: [],
  copyrightSuffix: "All rights reserved.",
  craftedLine: "Crafted with care - Available worldwide",
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
  const trimmed = String(siteName || "Nova studio").trim();
  const [firstWord, ...rest] = trimmed.split(" ");
  return {
    main: firstWord || "Nova",
    tail: rest.join(" ") || "studio",
  };
}

export function SiteFooter({
  siteName = "Nova studio",
  brandMark = "N",
  email = "hello@nova.studio",
  footer = defaultFooter,
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const brand = formatBrand(siteName);
  const resolvedFooter = { ...defaultFooter, ...(footer || {}) };
  const exploreLinks = Array.isArray(resolvedFooter.exploreLinks)
    ? resolvedFooter.exploreLinks
    : defaultFooter.exploreLinks;
  const socials = Array.isArray(resolvedFooter.socials) ? resolvedFooter.socials : [];

  return (
    <footer className="relative mt-32 border-t border-border" suppressHydrationWarning>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16" suppressHydrationWarning>
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-accent text-accent-foreground font-black">
                {brandMark}
              </span>
              <span className="font-semibold tracking-tight text-lg">
                {brand.main}
                <span className="text-accent">.</span>
                {brand.tail}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-muted-foreground text-sm leading-relaxed">{resolvedFooter.description}</p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Start a project <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              {exploreLinks.map((item) => (
                <li key={item.to}>
                  <Link href={item.to} className="hover:text-accent transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Social</h4>
            <div className="flex gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url || "#"}
                  aria-label={social.label}
                  target={social.url?.startsWith("http") ? "_blank" : undefined}
                  rel={social.url?.startsWith("http") ? "noreferrer" : undefined}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all"
                >
                  <SocialIcon d={social.iconPath} />
                </a>
              ))}
            </div>
            <p className="mt-6 text-xs text-muted-foreground">{email}</p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {siteName}. {resolvedFooter.copyrightSuffix}
          </p>
          <p>{resolvedFooter.craftedLine}</p>
        </div>
      </div>
    </footer>
  );
}

