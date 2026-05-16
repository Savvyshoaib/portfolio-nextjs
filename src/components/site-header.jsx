"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { resolveLogoDimensions } from "@/lib/cms/logo-size";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";

const defaultNav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Work" },
  { to: "/blog", label: "Journal" },
  { to: "/contact", label: "Contact" },
];

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

function resolveThemedLogo({ theme, lightUrl, darkUrl, fallbackUrl }) {
  const light = String(lightUrl || "").trim();
  const dark = String(darkUrl || "").trim();
  const fallback = String(fallbackUrl || "").trim();

  if (theme === "dark") {
    return dark || fallback || light;
  }

  return light || fallback || dark;
}

export function SiteHeader({
  navigation = defaultNav,
  brandMark = "N",
  siteName = "Nova Studio",
  logoUrl,
  logoLightUrl,
  logoDarkUrl,
  logoOnly = false,
  logoSize = "medium",
  logoWidth,
  logoHeight,
  hireLabel = "Let's Talk",
}) {
  const pathname = usePathname();
  const { theme, mounted } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const brand = formatBrand(siteName);
  const logoDimensions = resolveLogoDimensions({ width: logoWidth, height: logoHeight, size: logoSize });
  const activeTheme = mounted ? theme : "dark";
  const resolvedLogoUrl = resolveThemedLogo({
    theme: activeTheme,
    lightUrl: logoLightUrl,
    darkUrl: logoDarkUrl,
    fallbackUrl: logoUrl,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isActive = (to) => {
    if (!pathname) return false;
    if (to === "/") return pathname === "/";
    return pathname.startsWith(to);
  };

  return (
    <header
      className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-500", scrolled ? "py-3" : "py-5")}
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className={cn("flex items-center justify-between rounded-full px-5 py-3 transition-all duration-500", scrolled ? "glass" : "bg-transparent")}>
          <Link href="/" className="flex items-center gap-2">
            {resolvedLogoUrl ? (
              <>
                <Image
                  src={resolvedLogoUrl}
                  alt={siteName || "Site Logo"}
                  width={logoDimensions.width}
                  height={logoDimensions.height}
                  className="rounded-lg object-contain"
                  style={{ width: logoDimensions.width, height: logoDimensions.height }}
                  unoptimized
                />
                {!logoOnly ? (
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
                {!logoOnly ? (
                  <span className="font-semibold tracking-tight text-lg">
                    {brand.main}
                    <span className="text-neon">.</span>
                    {brand.tail}
                  </span>
                ) : null}
              </>
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {navigation.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className={cn(
                    "relative transition-colors group",
                    active ? "text-foreground" : "hover:text-foreground"
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-px bg-neon transition-all duration-300",
                      active ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-neon px-5 py-2.5 text-sm font-medium text-primary-foreground hover:glow-neon transition-all"
            >
              {hireLabel}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </Link>
          </div>

          <button className="text-foreground md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open ? (
          <div className="mt-2 rounded-3xl glass p-6 flex flex-col gap-4 md:hidden">
            {navigation.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                onClick={() => setOpen(false)}
                className={cn("text-muted-foreground hover:text-foreground transition-colors", isActive(item.to) && "text-foreground")}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="rounded-full bg-neon px-5 py-2.5 text-sm font-medium text-primary-foreground text-center"
            >
              {hireLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
