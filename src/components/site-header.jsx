"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
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
    return { main: "Nova", dot: ".", tail: "studio" };
  }

  const [firstWord, ...rest] = trimmed.split(" ");
  const remainder = rest.join(" ");
  return {
    main: firstWord || "Nova",
    dot: ".",
    tail: remainder || "studio",
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

export function SiteHeader({
  navigation = defaultNav,
  brandMark = "N",
  siteName = "Nova studio",
  logoUrl,
  logoLightUrl,
  logoDarkUrl,
  logoOnly = false,
  logoSize = "medium",
  hireLabel = "Hire me",
}) {
  const { theme, toggle, mounted } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const brand = formatBrand(siteName);
  const resolvedLogoSize = getLogoSize(logoSize);
  const activeTheme = mounted ? theme : "dark";
  const resolvedLogoUrl = resolveThemedLogo({
    theme: activeTheme,
    lightUrl: logoLightUrl,
    darkUrl: logoDarkUrl,
    fallbackUrl: logoUrl,
  });

  useEffect(() => {
    if (!mounted) {
      return undefined;
    }

    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted]);

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
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5"
      )}
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6" suppressHydrationWarning>
        <div
          className={cn(
            "flex items-center justify-between rounded-full px-4 sm:px-6 py-2.5 transition-all duration-300",
            scrolled ? "glass shadow-elegant" : "bg-transparent"
          )}
          suppressHydrationWarning
        >
          <Link href="/" className="flex items-center gap-2 group">
            {logoOnly && resolvedLogoUrl ? (
              <Image
                src={resolvedLogoUrl}
                alt={siteName || "Site Logo"}
                width={resolvedLogoSize}
                height={resolvedLogoSize}
                className="rounded-lg object-contain"
                style={{ width: resolvedLogoSize, height: resolvedLogoSize }}
                unoptimized
              />
            ) : resolvedLogoUrl ? (
              <>
                <Image
                  src={resolvedLogoUrl}
                  alt={siteName || "Site Logo"}
                  width={resolvedLogoSize}
                  height={resolvedLogoSize}
                  className="rounded-lg object-contain"
                  style={{ width: resolvedLogoSize, height: resolvedLogoSize }}
                  unoptimized
                />
                <span className="font-semibold tracking-tight">
                  {brand.main}
                  <span className="text-accent">{brand.dot}</span>
                  {brand.tail}
                </span>
              </>
            ) : (
              <>
                <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-accent text-accent-foreground font-black text-sm shadow-glow">
                  {brandMark}
                </span>
                <span className="font-semibold tracking-tight">
                  {brand.main}
                  <span className="text-accent">{brand.dot}</span>
                  {brand.tail}
                </span>
              </>
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                className={cn(
                  "relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
                  isActive(item.to) && "text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2" suppressHydrationWarning>
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border hover:bg-secondary transition-colors"
              suppressHydrationWarning
            >
              {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {hireLabel}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={() => setOpen((value) => !value)}
              aria-label="Toggle menu"
              className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-full border border-border"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "md:hidden fixed inset-0 z-40 transition-all duration-300",
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>

        <div
          className={cn(
            "md:hidden fixed top-0 right-0 h-full w-screen z-50 transform transition-all duration-500 ease-in-out",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="h-full border-l border-border shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                {logoOnly && resolvedLogoUrl ? (
                  <Image
                    src={resolvedLogoUrl}
                    alt={siteName || "Site Logo"}
                    width={resolvedLogoSize}
                    height={resolvedLogoSize}
                    className="rounded-lg object-contain"
                    style={{ width: resolvedLogoSize, height: resolvedLogoSize }}
                    unoptimized
                  />
                ) : resolvedLogoUrl ? (
                  <>
                    <Image
                      src={resolvedLogoUrl}
                      alt={siteName || "Site Logo"}
                      width={resolvedLogoSize}
                      height={resolvedLogoSize}
                      className="rounded-lg object-contain"
                      style={{ width: resolvedLogoSize, height: resolvedLogoSize }}
                      unoptimized
                    />
                    <span className="font-semibold tracking-tight">
                      {brand.main}
                      <span className="text-accent">{brand.dot}</span>
                      {brand.tail}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-accent text-accent-foreground font-black text-sm shadow-glow">
                      {brandMark}
                    </span>
                    <span className="font-semibold tracking-tight">
                      {brand.main}
                      <span className="text-accent">{brand.dot}</span>
                      {brand.tail}
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-border hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="p-6">
              <div className="space-y-2">
                {navigation.map((item, index) => (
                  <Link
                    key={item.to}
                    href={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:bg-accent/10",
                      "border border-transparent hover:border-accent/20",
                      isActive(item.to) && "bg-accent/10 border-accent/30",
                      open && "animate-slideInRight"
                    )}
                    style={{
                      animationDelay: open ? `${index * 100}ms` : "0ms",
                      animationFillMode: "both",
                    }}
                  >
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors",
                        isActive(item.to) ? "text-accent" : "text-foreground/80 group-hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </span>
                    <ArrowUpRight
                      className={cn(
                        "h-4 w-4 transition-all duration-300",
                        isActive(item.to)
                          ? "text-accent opacity-100"
                          : "text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                      )}
                    />
                  </Link>
                ))}
              </div>

              <div
                className={cn("mt-8 pt-6 border-t border-border", open && "animate-fadeInUp")}
                style={{
                  animationDelay: open ? "500ms" : "0ms",
                  animationFillMode: "both",
                }}
              >
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-6 py-3.5 text-sm font-medium hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  Start a project
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
