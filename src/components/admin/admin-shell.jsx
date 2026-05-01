"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Blocks, FileText, LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import { adminApi } from "@/lib/cms/admin-client";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "Content", icon: Blocks },
  { href: "/admin/contact", label: "Contact Me", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/profile", label: "Profile", icon: User },
];

export function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const onLogout = async () => {
    try {
      await adminApi.logout();
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-3xl border border-border bg-card p-5 h-fit lg:sticky lg:top-24">
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 mb-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-accent text-accent-foreground font-black">
                N
              </span>
              <span className="font-semibold tracking-tight">Nova CMS</span>
            </Link>

            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                      active
                        ? "bg-accent/15 text-accent border border-accent/30"
                        : "text-muted-foreground border border-transparent hover:bg-secondary/70 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 pt-6 border-t border-border space-y-2">
              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm border border-transparent text-muted-foreground hover:bg-secondary/70 hover:text-foreground transition-colors"
              >
                View Live Site
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </aside>

          <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">{children}</section>
        </div>
      </div>
    </div>
  );
}

