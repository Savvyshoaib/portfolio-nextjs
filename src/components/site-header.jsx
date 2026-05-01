"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X, ArrowUpRight } from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Work" },
  { to: "/blog", label: "Journal" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const { theme, toggle, mounted } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted]);

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
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-accent text-accent-foreground font-black text-sm shadow-glow">
              N
            </span>
            <span className="font-semibold tracking-tight">
              Nova<span className="text-accent">.</span>studio
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                href={n.to}
                className={cn(
                  "relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
                  isActive(n.to) && "text-foreground"
                )}
              >
                {n.label}
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
              Hire me
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-full border border-border"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Overlay */}
        <div 
          className={cn(
            "md:hidden fixed inset-0 z-40 transition-all duration-300",
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>

        {/* Right Side Drawer */}
        <div 
          className={cn(
            "md:hidden fixed top-0 right-0 h-full w-screen z-50 transform transition-all duration-500 ease-in-out",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="h-full border-l border-border shadow-2xl backdrop-blur-sm">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-accent text-accent-foreground font-black text-sm shadow-glow">
                  N
                </span>
                <span className="font-semibold tracking-tight">
                  Nova<span className="text-accent">.</span>studio
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-border hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Drawer Navigation */}
            <nav className="p-6">
              <div className="space-y-2">
                {nav.map((n, index) => (
                  <Link
                    key={n.to}
                    href={n.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:bg-accent/10",
                      "border border-transparent hover:border-accent/20",
                      isActive(n.to) && "bg-accent/10 border-accent/30",
                      open && "animate-slideInRight"
                    )}
                    style={{
                      animationDelay: open ? `${index * 100}ms` : '0ms',
                      animationFillMode: 'both'
                    }}
                  >
                    <span className={cn(
                      "text-sm font-medium transition-colors",
                      isActive(n.to) ? "text-accent" : "text-foreground/80 group-hover:text-foreground"
                    )}>
                      {n.label}
                    </span>
                    <ArrowUpRight className={cn(
                      "h-4 w-4 transition-all duration-300",
                      isActive(n.to) ? "text-accent opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                    )} />
                  </Link>
                ))}
              </div>

              {/* Drawer Footer */}
              <div className={cn(
                "mt-8 pt-6 border-t border-border",
                open && "animate-fadeInUp"
              )}
              style={{
                animationDelay: open ? '500ms' : '0ms',
                animationFillMode: 'both'
              }}>
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
