"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Blocks, ChevronDown, ChevronRight, FileText, ImageIcon, LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import { adminApi } from "@/lib/cms/admin-client";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { 
    href: "/admin/content", 
    label: "Content", 
    icon: Blocks,
    children: [
      { href: "/admin/content", label: "Home Sections" },
      { href: "/admin/content/portfolio", label: "Portfolio" },
      { href: "/admin/content/services", label: "Services" },
      { href: "/admin/content/blog", label: "Blog" },
    ]
  },
  {
    href: "/admin/contact",
    label: "Contact Me",
    icon: FileText,
    children: [
      { href: "/admin/contact", label: "Contact" },
      { href: "/admin/contact/services-inquiry", label: "Services inquiry" },
    ],
  },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/profile", label: "Profile", icon: User },
];

export function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleExpanded = (href) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const onLogout = async () => {
    try {
      await adminApi.logout();
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  };

  const isItemActive = (item) => {
    if (pathname === item.href) return true;
    if (item.children) {
      return item.children.some(child => pathname === child.href);
    }
    return false;
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col grow pt-5 pb-4 overflow-y-auto bg-card border-r border-border">
          <div className="flex items-center shrink-0 px-4">
            <Link href="/admin" className="text-xl font-bold">
              Admin<span className="text-accent">Panel</span>
            </Link>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isExpanded = item.children
                ? expandedItems.includes(item.href) || isItemActive(item)
                : false;

              return (
                <div key={item.href}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleExpanded(item.href)}
                        className={cn(
                          "group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                          isItemActive(item)
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.label}
                        {isExpanded ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </button>

                      {isExpanded ? (
                        <div className="mt-1 ml-6 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                                pathname === child.href
                                  ? "bg-accent text-accent-foreground"
                                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                        pathname === item.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="shrink-0 flex border-t border-border p-4">
            <button
              onClick={onLogout}
              className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 md:pl-0">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">{children}</section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

