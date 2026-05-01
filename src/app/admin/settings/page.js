"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Save, Upload } from "lucide-react";
import { adminApi } from "@/lib/cms/admin-client";

const pageSeoKeys = ["home", "services", "portfolio", "blog", "contact"];

function setNestedValue(source, path, value) {
  const keys = path.split(".");
  const next = { ...(source || {}) };
  let cursor = next;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value;
      return;
    }

    cursor[key] = { ...(cursor[key] || {}) };
    cursor = cursor[key];
  });

  return next;
}

function getNestedValue(source, path, fallback = "") {
  const value = path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), source);
  return value ?? fallback;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const response = await adminApi.getSettings();
        setSettings(response.settings || {});
      } catch (requestError) {
        setError(requestError.message || "Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const faviconPreview = useMemo(() => getNestedValue(settings, "seo.faviconUrl", ""), [settings]);
  const logoPreview = useMemo(() => getNestedValue(settings, "general.logoUrl", ""), [settings]);

  const updateField = (path, value) => {
    setSettings((prev) => setNestedValue(prev, path, value));
    setSuccess("");
  };

  const onSave = async (event) => {
    event.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await adminApi.saveSettings(settings);
      setSuccess("Settings saved successfully.");
    } catch (saveError) {
      setError(saveError.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const onFaviconUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await adminApi.uploadFile(file, "favicon");
      updateField("seo.faviconUrl", result.url);
    } catch (error) {
      setError(error.message || "Failed to upload favicon.");
    }
  };

  const onLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await adminApi.uploadFile(file, "logo");
      updateField("general.logoUrl", result.url);
    } catch (error) {
      setError(error.message || "Failed to upload logo.");
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading settings...</p>;
  }

  if (!settings) {
    return <p className="text-sm text-destructive">{error || "Unable to load settings."}</p>;
  }

  return (
    <form className="space-y-8" onSubmit={onSave}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Settings</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">General, SEO, and Script Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          These settings control metadata, robots, favicon, and custom scripts that are rendered on the frontend.
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
      ) : null}
      {success ? (
        <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">{success}</p>
      ) : null}

      <section className="rounded-2xl border border-border bg-background p-5 space-y-4">
        <h2 className="text-lg font-semibold">General Site Settings</h2>
        
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Site Logo</label>
          
          <Toggle
            label="Show Logo Only (hide site name text)"
            checked={Boolean(getNestedValue(settings, "general.logoOnly", false))}
            onChange={(checked) => updateField("general.logoOnly", checked)}
          />
          
          {getNestedValue(settings, "general.logoOnly", false) && (
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Logo Size</label>
              <select
                value={getNestedValue(settings, "general.logoSize", "medium")}
                onChange={(event) => updateField("general.logoSize", event.target.value)}
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
              >
                <option value="small">Small (24px)</option>
                <option value="medium">Medium (32px)</option>
                <option value="large">Large (40px)</option>
                <option value="xlarge">Extra Large (48px)</option>
              </select>
            </div>
          )}
          
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <input
                value={getNestedValue(settings, "general.logoUrl")}
                onChange={(event) => updateField("general.logoUrl", event.target.value)}
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                placeholder="https://example.com/logo.png"
              />
              <div className="flex items-center gap-3 mt-2">
                <label className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm cursor-pointer hover:bg-secondary/60 transition-colors">
                  <Upload className="h-4 w-4" />
                  Upload Logo
                  <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={onLogoUpload} />
                </label>
                {logoPreview ? (
                  <div className="flex items-center gap-2">
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      width={40}
                      height={40}
                      unoptimized
                      className="h-10 w-10 rounded border border-border object-contain"
                    />
                    <span className="text-xs text-muted-foreground">Logo preview</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Site Name" value={getNestedValue(settings, "general.siteName")} onChange={(value) => updateField("general.siteName", value)} />
          <Field label="Site URL" value={getNestedValue(settings, "general.siteUrl")} onChange={(value) => updateField("general.siteUrl", value)} />
          <Field label="Brand Mark" value={getNestedValue(settings, "general.brandMark")} onChange={(value) => updateField("general.brandMark", value)} />
          <Field label="Contact Email" value={getNestedValue(settings, "general.email")} onChange={(value) => updateField("general.email", value)} />
          <Field label="Phone" value={getNestedValue(settings, "general.phone")} onChange={(value) => updateField("general.phone", value)} />
          <Field label="Location" value={getNestedValue(settings, "general.location")} onChange={(value) => updateField("general.location", value)} />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-background p-5 space-y-4">
        <h2 className="text-lg font-semibold">SEO and Meta Controls</h2>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Favicon URL</label>
          <input
            value={getNestedValue(settings, "seo.faviconUrl")}
            onChange={(event) => updateField("seo.faviconUrl", event.target.value)}
            className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
            placeholder="https://example.com/favicon.ico"
          />
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm cursor-pointer hover:bg-secondary/60 transition-colors">
              <Upload className="h-4 w-4" />
              Upload Favicon
              <input type="file" accept=".ico,image/png,image/jpeg,image/svg+xml" className="hidden" onChange={onFaviconUpload} />
            </label>
            {faviconPreview ? (
              <Image
                src={faviconPreview}
                alt="Favicon preview"
                width={32}
                height={32}
                unoptimized
                className="h-8 w-8 rounded border border-border"
              />
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Meta Title" value={getNestedValue(settings, "seo.title")} onChange={(value) => updateField("seo.title", value)} />
          <Field label="Open Graph Title" value={getNestedValue(settings, "seo.ogTitle")} onChange={(value) => updateField("seo.ogTitle", value)} />
        </div>

        <Textarea
          label="Meta Description"
          value={getNestedValue(settings, "seo.description")}
          onChange={(value) => updateField("seo.description", value)}
        />

        <Textarea
          label="Keywords (comma separated)"
          value={getNestedValue(settings, "seo.keywords")}
          onChange={(value) => updateField("seo.keywords", value)}
        />

        <Textarea
          label="Open Graph Description"
          value={getNestedValue(settings, "seo.ogDescription")}
          onChange={(value) => updateField("seo.ogDescription", value)}
        />

        <Field label="Open Graph Image URL" value={getNestedValue(settings, "seo.ogImageUrl")} onChange={(value) => updateField("seo.ogImageUrl", value)} />
      </section>

      <section className="rounded-2xl border border-border bg-background p-5 space-y-4">
        <h2 className="text-lg font-semibold">Per-Page SEO</h2>
        <div className="space-y-5">
          {pageSeoKeys.map((key) => (
            <div key={key} className="rounded-xl border border-border p-4 space-y-3">
              <p className="text-sm font-semibold capitalize">{key}</p>
              <Field
                label="Title"
                value={getNestedValue(settings, `pageSeo.${key}.title`)}
                onChange={(value) => updateField(`pageSeo.${key}.title`, value)}
              />
              <Textarea
                label="Description"
                rows={3}
                value={getNestedValue(settings, `pageSeo.${key}.description`)}
                onChange={(value) => updateField(`pageSeo.${key}.description`, value)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-background p-5 space-y-4">
        <h2 className="text-lg font-semibold">Script and Custom Code Injection</h2>
        <Textarea
          label="Header Scripts (injected before interactive load)"
          value={getNestedValue(settings, "seo.headerScripts")}
          onChange={(value) => updateField("seo.headerScripts", value)}
          rows={5}
        />
        <Textarea
          label="Footer Scripts"
          value={getNestedValue(settings, "seo.footerScripts")}
          onChange={(value) => updateField("seo.footerScripts", value)}
          rows={5}
        />
        <Textarea
          label="Custom Head HTML"
          value={getNestedValue(settings, "seo.customHeadHtml")}
          onChange={(value) => updateField("seo.customHeadHtml", value)}
          rows={5}
        />
        <Textarea
          label="Custom Footer HTML"
          value={getNestedValue(settings, "seo.customFooterHtml")}
          onChange={(value) => updateField("seo.customFooterHtml", value)}
          rows={5}
        />
      </section>

      <section className="rounded-2xl border border-border bg-background p-5 space-y-4">
        <h2 className="text-lg font-semibold">Robots and Indexing</h2>
        <Toggle
          label="Allow indexing for public pages"
          checked={Boolean(getNestedValue(settings, "robots.allowIndexing", true))}
          onChange={(checked) => updateField("robots.allowIndexing", checked)}
        />
        <Toggle
          label="Allow follow links for crawlers"
          checked={Boolean(getNestedValue(settings, "robots.allowFollow", true))}
          onChange={(checked) => updateField("robots.allowFollow", checked)}
        />
        <Toggle
          label="Disallow /admin from robots"
          checked={Boolean(getNestedValue(settings, "robots.adminDisallow", true))}
          onChange={(checked) => updateField("robots.adminDisallow", checked)}
        />
      </section>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 4 }) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <textarea
        rows={rows}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
      />
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-border px-4 py-3 bg-card">
      <span className="text-sm">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-(--color-accent)"
      />
    </label>
  );
}
