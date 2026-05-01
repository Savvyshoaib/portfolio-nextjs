"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Blocks, FileText, Settings, Wrench } from "lucide-react";
import { adminApi } from "@/lib/cms/admin-client";

const statCards = [
  { key: "sections", label: "Sections", icon: Blocks },
  { key: "services", label: "Services", icon: Wrench },
  { key: "portfolio", label: "Portfolio", icon: BarChart3 },
  { key: "blog", label: "Blog Posts", icon: FileText },
  { key: "testimonials", label: "Testimonials", icon: FileText },
  { key: "techStack", label: "Tech Stack", icon: Settings },
];

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        const response = await adminApi.getDashboard();
        setStats(response.stats);
      } catch (requestError) {
        setError(requestError.message || "Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Dashboard</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">CMS Control Center</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage all frontend content, portfolio data, blog posts, and SEO settings from one place.
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.key} className="rounded-2xl border border-border bg-background p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight">
                {loading ? "-" : stats?.totals?.[card.key] ?? 0}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/content" className="rounded-2xl border border-border bg-background p-5 hover:border-accent/40 transition-colors">
          <p className="text-sm font-semibold">Content Management</p>
          <p className="mt-2 text-sm text-muted-foreground">Update sections, services, projects, blog posts and more.</p>
        </Link>
        <Link href="/admin/settings" className="rounded-2xl border border-border bg-background p-5 hover:border-accent/40 transition-colors">
          <p className="text-sm font-semibold">SEO and Site Settings</p>
          <p className="mt-2 text-sm text-muted-foreground">Control favicon, metadata, Open Graph, scripts and robots settings.</p>
        </Link>
        <Link href="/admin/profile" className="rounded-2xl border border-border bg-background p-5 hover:border-accent/40 transition-colors">
          <p className="text-sm font-semibold">Admin Profile</p>
          <p className="mt-2 text-sm text-muted-foreground">Manage admin account details and credentials.</p>
        </Link>
      </div>
    </div>
  );
}
