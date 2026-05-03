"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Plus, Save, Trash2, Upload } from "lucide-react";
import { adminApi } from "@/lib/cms/admin-client";

const pageSeoKeys = ["home", "services", "portfolio", "blog", "contact"];
const LOGO_SIZE_MIN = 24;
const LOGO_SIZE_MAX = 200;
const LEGACY_LOGO_SIZE_MAP = {
  small: 24,
  medium: 32,
  large: 40,
  xlarge: 48,
};

function clampLogoSize(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return LEGACY_LOGO_SIZE_MAP.medium;
  }

  return Math.min(LOGO_SIZE_MAX, Math.max(LOGO_SIZE_MIN, Math.round(parsed)));
}

function normalizeLogoSizeValue(value) {
  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    if (LEGACY_LOGO_SIZE_MAP[trimmed]) {
      return LEGACY_LOGO_SIZE_MAP[trimmed];
    }
  }

  return clampLogoSize(value);
}

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

function normalizeFooterLinks(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => ({
    label: String(item?.label || ""),
    to: String(item?.to || ""),
  }));
}

function normalizeFooterSocials(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => ({
    label: String(item?.label || ""),
    url: String(item?.url || ""),
    iconPath: String(item?.iconPath || ""),
  }));
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
  const logoFallbackPreview = useMemo(() => getNestedValue(settings, "general.logoUrl", ""), [settings]);
  const logoLightPreview = useMemo(() => getNestedValue(settings, "general.logoLightUrl", ""), [settings]);
  const logoDarkPreview = useMemo(() => getNestedValue(settings, "general.logoDarkUrl", ""), [settings]);
  const headerLogoSizePx = useMemo(
    () => normalizeLogoSizeValue(getNestedValue(settings, "general.logoSize", LEGACY_LOGO_SIZE_MAP.medium)),
    [settings]
  );
  const footerLogoFallbackPreview = useMemo(() => getNestedValue(settings, "footer.logoUrl", ""), [settings]);
  const footerLogoLightPreview = useMemo(() => getNestedValue(settings, "footer.logoLightUrl", ""), [settings]);
  const footerLogoDarkPreview = useMemo(() => getNestedValue(settings, "footer.logoDarkUrl", ""), [settings]);
  const footerLogoSizePx = useMemo(
    () => normalizeLogoSizeValue(getNestedValue(settings, "footer.logoSize", LEGACY_LOGO_SIZE_MAP.medium)),
    [settings]
  );
  const footerLinks = useMemo(() => normalizeFooterLinks(getNestedValue(settings, "footer.exploreLinks", [])), [settings]);
  const footerSocials = useMemo(() => normalizeFooterSocials(getNestedValue(settings, "footer.socials", [])), [settings]);

  const updateField = (path, value) => {
    setSettings((prev) => setNestedValue(prev, path, value));
    setSuccess("");
  };

  const updateLogoSize = (path, value) => {
    updateField(path, normalizeLogoSizeValue(value));
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

  const onLightLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await adminApi.uploadFile(file, "logo");
      updateField("general.logoLightUrl", result.url);
    } catch (error) {
      setError(error.message || "Failed to upload light mode logo.");
    }
  };

  const onDarkLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await adminApi.uploadFile(file, "logo");
      updateField("general.logoDarkUrl", result.url);
    } catch (error) {
      setError(error.message || "Failed to upload dark mode logo.");
    }
  };

  const onFooterLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await adminApi.uploadFile(file, "logo");
      updateField("footer.logoUrl", result.url);
    } catch (error) {
      setError(error.message || "Failed to upload footer logo.");
    }
  };

  const onFooterLightLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await adminApi.uploadFile(file, "logo");
      updateField("footer.logoLightUrl", result.url);
    } catch (error) {
      setError(error.message || "Failed to upload footer light logo.");
    }
  };

  const onFooterDarkLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await adminApi.uploadFile(file, "logo");
      updateField("footer.logoDarkUrl", result.url);
    } catch (error) {
      setError(error.message || "Failed to upload footer dark logo.");
    }
  };

  const updateFooterLink = (index, field, value) => {
    const nextLinks = footerLinks.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            [field]: value,
          }
        : item
    );
    updateField("footer.exploreLinks", nextLinks);
  };

  const addFooterLink = () => {
    updateField("footer.exploreLinks", [...footerLinks, { label: "", to: "" }]);
  };

  const removeFooterLink = (index) => {
    updateField(
      "footer.exploreLinks",
      footerLinks.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const updateFooterSocial = (index, field, value) => {
    const nextSocials = footerSocials.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            [field]: value,
          }
        : item
    );
    updateField("footer.socials", nextSocials);
  };

  const addFooterSocial = () => {
    updateField("footer.socials", [...footerSocials, { label: "", url: "", iconPath: "" }]);
  };

  const removeFooterSocial = (index) => {
    updateField(
      "footer.socials",
      footerSocials.filter((_, itemIndex) => itemIndex !== index)
    );
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

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">
              Header Logo Size ({headerLogoSizePx}px)
            </label>
            <div className="grid gap-3 md:grid-cols-[1fr_120px]">
              <input
                type="range"
                min={LOGO_SIZE_MIN}
                max={LOGO_SIZE_MAX}
                step={1}
                value={headerLogoSizePx}
                onChange={(event) => updateLogoSize("general.logoSize", event.target.value)}
                className="w-full accent-(--color-accent)"
              />
              <input
                type="number"
                min={LOGO_SIZE_MIN}
                max={LOGO_SIZE_MAX}
                value={headerLogoSizePx}
                onChange={(event) => updateLogoSize("general.logoSize", event.target.value)}
                className="w-full rounded-xl border border-input bg-card px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              You can increase header logo size up to {LOGO_SIZE_MAX}px.
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Header Logo Light Mode</label>
              <input
                value={getNestedValue(settings, "general.logoLightUrl")}
                onChange={(event) => updateField("general.logoLightUrl", event.target.value)}
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                placeholder="https://example.com/logo-light.png"
              />
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm cursor-pointer hover:bg-secondary/60 transition-colors">
                  <Upload className="h-4 w-4" />
                  Upload Light Logo
                  <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={onLightLogoUpload} />
                </label>
                {logoLightPreview ? (
                  <Image
                    src={logoLightPreview}
                    alt="Header light logo preview"
                    width={40}
                    height={40}
                    unoptimized
                    className="h-10 w-10 rounded border border-border object-contain"
                  />
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Header Logo Dark Mode</label>
              <input
                value={getNestedValue(settings, "general.logoDarkUrl")}
                onChange={(event) => updateField("general.logoDarkUrl", event.target.value)}
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                placeholder="https://example.com/logo-dark.png"
              />
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm cursor-pointer hover:bg-secondary/60 transition-colors">
                  <Upload className="h-4 w-4" />
                  Upload Dark Logo
                  <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={onDarkLogoUpload} />
                </label>
                {logoDarkPreview ? (
                  <Image
                    src={logoDarkPreview}
                    alt="Header dark logo preview"
                    width={40}
                    height={40}
                    unoptimized
                    className="h-10 w-10 rounded border border-border object-contain"
                  />
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Header Logo Fallback URL (optional)</label>
            <input
              value={getNestedValue(settings, "general.logoUrl")}
              onChange={(event) => updateField("general.logoUrl", event.target.value)}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
              placeholder="https://example.com/logo-default.png"
            />
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm cursor-pointer hover:bg-secondary/60 transition-colors">
                <Upload className="h-4 w-4" />
                Upload Fallback Logo
                <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={onLogoUpload} />
              </label>
              {logoFallbackPreview ? (
                <Image
                  src={logoFallbackPreview}
                  alt="Header fallback logo preview"
                  width={40}
                  height={40}
                  unoptimized
                  className="h-10 w-10 rounded border border-border object-contain"
                />
              ) : null}
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
        <h2 className="text-lg font-semibold">Footer Settings</h2>
        <p className="text-sm text-muted-foreground">
          Footer content, footer logo, button text, and link groups can be managed from here.
        </p>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Footer Logo</label>

          <Toggle
            label="Show Footer Logo Only (hide footer brand text)"
            checked={Boolean(getNestedValue(settings, "footer.logoOnly", false))}
            onChange={(checked) => updateField("footer.logoOnly", checked)}
          />

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">
              Footer Logo Size ({footerLogoSizePx}px)
            </label>
            <div className="grid gap-3 md:grid-cols-[1fr_120px]">
              <input
                type="range"
                min={LOGO_SIZE_MIN}
                max={LOGO_SIZE_MAX}
                step={1}
                value={footerLogoSizePx}
                onChange={(event) => updateLogoSize("footer.logoSize", event.target.value)}
                className="w-full accent-(--color-accent)"
              />
              <input
                type="number"
                min={LOGO_SIZE_MIN}
                max={LOGO_SIZE_MAX}
                value={footerLogoSizePx}
                onChange={(event) => updateLogoSize("footer.logoSize", event.target.value)}
                className="w-full rounded-xl border border-input bg-card px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              You can increase footer logo size up to {LOGO_SIZE_MAX}px.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Footer Logo Light Mode</label>
              <input
                value={getNestedValue(settings, "footer.logoLightUrl")}
                onChange={(event) => updateField("footer.logoLightUrl", event.target.value)}
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                placeholder="https://example.com/footer-light.png"
              />
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm cursor-pointer hover:bg-secondary/60 transition-colors">
                  <Upload className="h-4 w-4" />
                  Upload Footer Light
                  <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={onFooterLightLogoUpload} />
                </label>
                {footerLogoLightPreview ? (
                  <Image
                    src={footerLogoLightPreview}
                    alt="Footer light logo preview"
                    width={40}
                    height={40}
                    unoptimized
                    className="h-10 w-10 rounded border border-border object-contain"
                  />
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Footer Logo Dark Mode</label>
              <input
                value={getNestedValue(settings, "footer.logoDarkUrl")}
                onChange={(event) => updateField("footer.logoDarkUrl", event.target.value)}
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                placeholder="https://example.com/footer-dark.png"
              />
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm cursor-pointer hover:bg-secondary/60 transition-colors">
                  <Upload className="h-4 w-4" />
                  Upload Footer Dark
                  <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={onFooterDarkLogoUpload} />
                </label>
                {footerLogoDarkPreview ? (
                  <Image
                    src={footerLogoDarkPreview}
                    alt="Footer dark logo preview"
                    width={40}
                    height={40}
                    unoptimized
                    className="h-10 w-10 rounded border border-border object-contain"
                  />
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Footer Logo Fallback URL (optional)</label>
            <input
              value={getNestedValue(settings, "footer.logoUrl")}
              onChange={(event) => updateField("footer.logoUrl", event.target.value)}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
              placeholder="https://example.com/footer-logo-default.png"
            />
            <div className="flex items-center gap-3 mt-2">
              <label className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm cursor-pointer hover:bg-secondary/60 transition-colors">
                <Upload className="h-4 w-4" />
                Upload Footer Fallback
                <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={onFooterLogoUpload} />
              </label>
              {footerLogoFallbackPreview ? (
                <Image
                  src={footerLogoFallbackPreview}
                  alt="Footer fallback logo preview"
                  width={40}
                  height={40}
                  unoptimized
                  className="h-10 w-10 rounded border border-border object-contain"
                />
              ) : null}
            </div>
          </div>
        </div>

        <Textarea
          label="Footer Description"
          value={getNestedValue(settings, "footer.description")}
          onChange={(value) => updateField("footer.description", value)}
          rows={3}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Footer Contact Email (optional)" value={getNestedValue(settings, "footer.email")} onChange={(value) => updateField("footer.email", value)} />
          <Field label="Copyright Suffix" value={getNestedValue(settings, "footer.copyrightSuffix")} onChange={(value) => updateField("footer.copyrightSuffix", value)} />
          <Field label="Footer Bottom Line" value={getNestedValue(settings, "footer.craftedLine")} onChange={(value) => updateField("footer.craftedLine", value)} />
          <Field label="Start Project Button Label" value={getNestedValue(settings, "footer.startProjectLabel")} onChange={(value) => updateField("footer.startProjectLabel", value)} />
          <Field label="Start Project Button Link" value={getNestedValue(settings, "footer.startProjectLink")} onChange={(value) => updateField("footer.startProjectLink", value)} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Explore Links</h3>
            <button
              type="button"
              onClick={addFooterLink}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-secondary/60 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Link
            </button>
          </div>

          {footerLinks.length ? (
            <div className="space-y-3">
              {footerLinks.map((link, index) => (
                <div key={`footer-link-${index}`} className="rounded-xl border border-border p-3 bg-card">
                  <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] items-end">
                    <Field label="Label" value={link.label} onChange={(value) => updateFooterLink(index, "label", value)} />
                    <Field label="Link URL" value={link.to} onChange={(value) => updateFooterLink(index, "to", value)} />
                    <button
                      type="button"
                      onClick={() => removeFooterLink(index)}
                      className="inline-flex items-center justify-center h-11 w-11 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
                      aria-label="Remove footer link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No footer links added yet.</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Social Links</h3>
            <button
              type="button"
              onClick={addFooterSocial}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-secondary/60 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Social
            </button>
          </div>

          {footerSocials.length ? (
            <div className="space-y-3">
              {footerSocials.map((social, index) => (
                <div key={`footer-social-${index}`} className="rounded-xl border border-border p-3 bg-card space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Platform Name" value={social.label} onChange={(value) => updateFooterSocial(index, "label", value)} />
                    <Field label="Profile URL" value={social.url} onChange={(value) => updateFooterSocial(index, "url", value)} />
                  </div>
                  <Field label="Icon SVG Path (optional)" value={social.iconPath} onChange={(value) => updateFooterSocial(index, "iconPath", value)} />
                  <button
                    type="button"
                    onClick={() => removeFooterSocial(index)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove Social
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No social links added yet.</p>
          )}
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
