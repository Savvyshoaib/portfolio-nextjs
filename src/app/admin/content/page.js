"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2, Upload } from "lucide-react";
import { adminApi } from "@/lib/cms/admin-client";
import { cn } from "@/lib/utils";
import {
  HOME_SECTION_DEFINITIONS,
  HOME_SECTION_TYPE_OPTIONS,
  createHomeLayoutItem,
  normalizeHomeLayout,
  normalizeHomeSectionContent,
  serializeHomeLayout,
} from "@/lib/cms/home-layout";

const INPUT_CLASSNAME =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all";
const TEXTAREA_CLASSNAME =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all resize-none";

function parseLineList(value) {
  return String(value || "")
    .split(/\r?\n/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function toLineList(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value.join("\n");
}

function parseHeroStats(value) {
  return String(value || "")
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [valuePart = "", ...labelParts] = line.split("|");
      return {
        value: valuePart.trim(),
        label: labelParts.join("|").trim(),
      };
    })
    .filter((item) => item.value || item.label);
}

function toHeroStats(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value.map((item) => `${item?.value || ""} | ${item?.label || ""}`).join("\n");
}

function parseTestimonialItems(value) {
  return String(value || "")
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [quotePart = "", namePart = "", ...roleParts] = line.split("|");
      return {
        quote: quotePart.trim(),
        name: namePart.trim(),
        role: roleParts.join("|").trim(),
      };
    })
    .filter((item) => item.quote || item.name || item.role);
}

function toTestimonialItems(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .map((item) => `${item?.quote || ""} | ${item?.name || ""} | ${item?.role || ""}`)
    .join("\n");
}

function Field({ label, hint, children }) {
  return (
    <label className="space-y-2 block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </label>
  );
}

export default function HomeSectionsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [layoutItems, setLayoutItems] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [addType, setAddType] = useState("hero");

  useEffect(() => {
    let cancelled = false;

    async function loadSections() {
      try {
        setError("");
        const response = await adminApi.getSections();
        if (cancelled) {
          return;
        }

        const sections = response.sections || {};
        const items = normalizeHomeLayout(sections.homeLayout, sections);
        setLayoutItems(items);
        setSelectedId(items[0]?.id || "");
      } catch (requestError) {
        if (cancelled) {
          return;
        }
        setError(requestError.message || "Failed to load homepage sections.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSections();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedItem = useMemo(
    () => layoutItems.find((item) => item.id === selectedId) || null,
    [layoutItems, selectedId]
  );

  function replaceLayoutItems(nextItems) {
    setLayoutItems(nextItems);
    if (!nextItems.some((item) => item.id === selectedId)) {
      setSelectedId(nextItems[0]?.id || "");
    }
  }

  function updateSelectedContent(nextContent) {
    if (!selectedItem) {
      return;
    }

    replaceLayoutItems(
      layoutItems.map((item) => {
        if (item.id !== selectedItem.id) {
          return item;
        }

        return {
          ...item,
          content: normalizeHomeSectionContent(item.type, nextContent),
        };
      })
    );
    setSuccess("");
  }

  function moveItem(itemId, direction) {
    const currentIndex = layoutItems.findIndex((item) => item.id === itemId);
    if (currentIndex < 0) {
      return;
    }

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= layoutItems.length) {
      return;
    }

    const nextItems = [...layoutItems];
    const [moved] = nextItems.splice(currentIndex, 1);
    nextItems.splice(targetIndex, 0, moved);
    replaceLayoutItems(nextItems);
    setSuccess("");
  }

  function removeItem(itemId) {
    const shouldDelete = window.confirm("Remove this section from homepage layout?");
    if (!shouldDelete) {
      return;
    }

    const nextItems = layoutItems.filter((item) => item.id !== itemId);
    replaceLayoutItems(nextItems);
    setSuccess("");
  }

  function addItem() {
    const nextItem = createHomeLayoutItem(addType);
    if (!nextItem) {
      return;
    }

    const nextItems = [...layoutItems, nextItem];
    replaceLayoutItems(nextItems);
    setSelectedId(nextItem.id);
    setSuccess("");
  }

  async function handleAboutImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file || !selectedItem || selectedItem.type !== "about") {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const result = await adminApi.uploadFile(file, "about_founder");
      updateSelectedContent({
        ...(selectedItem.content || {}),
        founderImageUrl: result?.url || "",
      });
      setSuccess("About image uploaded successfully.");
    } catch (requestError) {
      setError(requestError.message || "Failed to upload about image.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function saveLayout() {
    if (!layoutItems.length) {
      setError("At least one section is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = serializeHomeLayout(layoutItems);
      await adminApi.saveSection("homeLayout", payload);
      const normalized = normalizeHomeLayout(payload);
      setLayoutItems(normalized);
      setSelectedId((prev) => {
        if (normalized.some((item) => item.id === prev)) {
          return prev;
        }
        return normalized[0]?.id || "";
      });
      setSuccess("Homepage layout saved successfully.");
    } catch (requestError) {
      setError(requestError.message || "Failed to save homepage layout.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading homepage section builder...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Content</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Home Sections Builder</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add, remove, reorder, and edit homepage sections with structured fields. No JSON required.
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">{success}</p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl border border-border bg-background p-4 space-y-4 h-fit">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Add New Section</p>
            <div className="grid gap-2">
              <select
                value={addType}
                onChange={(event) => setAddType(event.target.value)}
                className={INPUT_CLASSNAME}
              >
                {HOME_SECTION_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {HOME_SECTION_DEFINITIONS[type].label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-secondary/70 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Section
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Section Order</p>
            <div className="space-y-2">
              {layoutItems.map((item, index) => {
                const definition = HOME_SECTION_DEFINITIONS[item.type];
                const isSelected = selectedId === item.id;

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "rounded-xl border p-3 transition-colors",
                      isSelected ? "border-accent/40 bg-accent/10" : "border-border bg-card"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className="w-full text-left"
                    >
                      <p className="text-sm font-medium">{definition?.label || item.type}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">#{index + 1}</p>
                    </button>
                    <div className="mt-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => moveItem(item.id, "up")}
                        disabled={index === 0}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-secondary/70 disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(item.id, "down")}
                        disabled={index === layoutItems.length - 1}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-secondary/70 disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/10"
                        title="Remove section"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={saveLayout}
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-4 py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Homepage Layout"}
          </button>
        </aside>

        <div className="rounded-2xl border border-border bg-background p-5 sm:p-6">
          {!selectedItem ? (
            <p className="text-sm text-muted-foreground">Select a section to edit its fields.</p>
          ) : (
            <SectionEditor
              item={selectedItem}
              uploading={uploading}
              onAboutUpload={handleAboutImageUpload}
              onContentChange={updateSelectedContent}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SectionEditor({ item, uploading, onAboutUpload, onContentChange }) {
  const definition = HOME_SECTION_DEFINITIONS[item.type];
  const editable = Boolean(definition?.editable);

  if (!editable) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Selected Section</p>
        <h2 className="mt-2 text-xl font-semibold">{definition?.label || item.type}</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          This section is powered by dedicated collection content (and list limits) instead of local form fields.
        </p>
      </div>
    );
  }

  const content = item.content || {};

  if (item.type === "hero") {
    return (
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">{definition.label}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Badge Text">
            <input
              type="text"
              value={content.badgeText || ""}
              onChange={(event) => onContentChange({ ...content, badgeText: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Heading Top">
            <input
              type="text"
              value={content.headingTop || ""}
              onChange={(event) => onContentChange({ ...content, headingTop: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Heading Emphasis">
            <input
              type="text"
              value={content.headingEmphasis || ""}
              onChange={(event) => onContentChange({ ...content, headingEmphasis: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Heading Bottom">
            <input
              type="text"
              value={content.headingBottom || ""}
              onChange={(event) => onContentChange({ ...content, headingBottom: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Primary CTA Label">
            <input
              type="text"
              value={content.primaryCtaLabel || ""}
              onChange={(event) => onContentChange({ ...content, primaryCtaLabel: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Primary CTA Link">
            <input
              type="text"
              value={content.primaryCtaLink || ""}
              onChange={(event) => onContentChange({ ...content, primaryCtaLink: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Secondary CTA Label">
            <input
              type="text"
              value={content.secondaryCtaLabel || ""}
              onChange={(event) => onContentChange({ ...content, secondaryCtaLabel: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Secondary CTA Link">
            <input
              type="text"
              value={content.secondaryCtaLink || ""}
              onChange={(event) => onContentChange({ ...content, secondaryCtaLink: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
        </div>
        <Field label="Description">
          <textarea
            rows={4}
            value={content.description || ""}
            onChange={(event) => onContentChange({ ...content, description: event.target.value })}
            className={TEXTAREA_CLASSNAME}
          />
        </Field>
        <Field label="Stats" hint="One line per stat: value | label">
          <textarea
            rows={6}
            value={toHeroStats(content.stats)}
            onChange={(event) => onContentChange({ ...content, stats: parseHeroStats(event.target.value) })}
            className={TEXTAREA_CLASSNAME}
          />
        </Field>
      </div>
    );
  }

  if (item.type === "clients") {
    return (
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">{definition.label}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow">
            <input
              type="text"
              value={content.eyebrow || ""}
              onChange={(event) => onContentChange({ ...content, eyebrow: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Slider Speed (seconds)" hint="Lower = faster. Recommended range: 12 to 40">
            <input
              type="number"
              min="8"
              max="120"
              step="1"
              value={content.marqueeDurationSeconds ?? 30}
              onChange={(event) =>
                onContentChange({ ...content, marqueeDurationSeconds: event.target.value })
              }
              className={INPUT_CLASSNAME}
            />
          </Field>
        </div>
        <Field label="Logo Labels" hint="One logo label per line">
          <textarea
            rows={8}
            value={toLineList(content.logos)}
            onChange={(event) => onContentChange({ ...content, logos: parseLineList(event.target.value) })}
            className={TEXTAREA_CLASSNAME}
          />
        </Field>
      </div>
    );
  }

  if (item.type === "about") {
    return (
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">{definition.label}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow">
            <input
              type="text"
              value={content.eyebrow || ""}
              onChange={(event) => onContentChange({ ...content, eyebrow: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Title Emphasis">
            <input
              type="text"
              value={content.titleEmphasis || ""}
              onChange={(event) => onContentChange({ ...content, titleEmphasis: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Founder Name">
            <input
              type="text"
              value={content.founderName || ""}
              onChange={(event) => onContentChange({ ...content, founderName: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Founder Role">
            <input
              type="text"
              value={content.founderRole || ""}
              onChange={(event) => onContentChange({ ...content, founderRole: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
        </div>
        <Field label="Title">
          <input
            type="text"
            value={content.title || ""}
            onChange={(event) => onContentChange({ ...content, title: event.target.value })}
            className={INPUT_CLASSNAME}
          />
        </Field>
        <Field label="Description">
          <textarea
            rows={5}
            value={content.description || ""}
            onChange={(event) => onContentChange({ ...content, description: event.target.value })}
            className={TEXTAREA_CLASSNAME}
          />
        </Field>
        <Field label="Bullet Points" hint="One bullet per line">
          <textarea
            rows={5}
            value={toLineList(content.bullets)}
            onChange={(event) => onContentChange({ ...content, bullets: parseLineList(event.target.value) })}
            className={TEXTAREA_CLASSNAME}
          />
        </Field>
        <Field label="About Button">
          <label className="flex items-center justify-between rounded-xl border border-border px-4 py-3 bg-card">
            <span className="text-sm">Show button in About section</span>
            <input
              type="checkbox"
              checked={Boolean(content.showButton)}
              onChange={(event) => onContentChange({ ...content, showButton: event.target.checked })}
              className="h-4 w-4 accent-(--color-accent)"
            />
          </label>
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Button Label">
            <input
              type="text"
              value={content.buttonLabel || ""}
              onChange={(event) => onContentChange({ ...content, buttonLabel: event.target.value })}
              className={INPUT_CLASSNAME}
              placeholder="Start a project"
            />
          </Field>
          <Field label="Button Link">
            <input
              type="text"
              value={content.buttonLink || ""}
              onChange={(event) => onContentChange({ ...content, buttonLink: event.target.value })}
              className={INPUT_CLASSNAME}
              placeholder="/contact"
            />
          </Field>
        </div>
        <Field label="Founder Image URL">
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="url"
                value={content.founderImageUrl || ""}
                onChange={(event) => onContentChange({ ...content, founderImageUrl: event.target.value })}
                className={INPUT_CLASSNAME}
                placeholder="https://example.com/founder.jpg"
              />
              <label className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-input bg-card px-3 py-2 text-sm cursor-pointer hover:bg-secondary/60 transition-colors">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  className="hidden"
                  onChange={onAboutUpload}
                  disabled={uploading}
                />
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? "Uploading" : "Upload"}
              </label>
            </div>
            {content.founderImageUrl ? (
              <div className="rounded-xl border border-border p-2">
                <img
                  src={content.founderImageUrl}
                  alt={content.founderName || "Founder"}
                  className="h-44 w-full rounded-lg object-cover"
                />
              </div>
            ) : null}
          </div>
        </Field>
      </div>
    );
  }

  if (item.type === "services") {
    return (
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">{definition.label}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow">
            <input
              type="text"
              value={content.eyebrow || ""}
              onChange={(event) => onContentChange({ ...content, eyebrow: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Title Emphasis">
            <input
              type="text"
              value={content.titleEmphasis || ""}
              onChange={(event) => onContentChange({ ...content, titleEmphasis: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Link Label">
            <input
              type="text"
              value={content.linkLabel || ""}
              onChange={(event) => onContentChange({ ...content, linkLabel: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Link URL">
            <input
              type="text"
              value={content.linkHref || ""}
              onChange={(event) => onContentChange({ ...content, linkHref: event.target.value })}
              className={INPUT_CLASSNAME}
              placeholder="/services"
            />
          </Field>
        </div>
        <Field label="Title">
          <input
            type="text"
            value={content.title || ""}
            onChange={(event) => onContentChange({ ...content, title: event.target.value })}
            className={INPUT_CLASSNAME}
          />
        </Field>
      </div>
    );
  }

  if (item.type === "portfolio") {
    return (
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">{definition.label}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow">
            <input
              type="text"
              value={content.eyebrow || ""}
              onChange={(event) => onContentChange({ ...content, eyebrow: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Title Emphasis">
            <input
              type="text"
              value={content.titleEmphasis || ""}
              onChange={(event) => onContentChange({ ...content, titleEmphasis: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Link Label">
            <input
              type="text"
              value={content.linkLabel || ""}
              onChange={(event) => onContentChange({ ...content, linkLabel: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Link URL">
            <input
              type="text"
              value={content.linkHref || ""}
              onChange={(event) => onContentChange({ ...content, linkHref: event.target.value })}
              className={INPUT_CLASSNAME}
              placeholder="/portfolio"
            />
          </Field>
        </div>
        <Field label="Title">
          <input
            type="text"
            value={content.title || ""}
            onChange={(event) => onContentChange({ ...content, title: event.target.value })}
            className={INPUT_CLASSNAME}
          />
        </Field>
      </div>
    );
  }

  if (item.type === "cta") {
    return (
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">{definition.label}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow">
            <input
              type="text"
              value={content.eyebrow || ""}
              onChange={(event) => onContentChange({ ...content, eyebrow: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="CTA Label">
            <input
              type="text"
              value={content.ctaLabel || ""}
              onChange={(event) => onContentChange({ ...content, ctaLabel: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="CTA Link">
            <input
              type="text"
              value={content.ctaLink || ""}
              onChange={(event) => onContentChange({ ...content, ctaLink: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
        </div>
        <Field label="Title">
          <textarea
            rows={3}
            value={content.title || ""}
            onChange={(event) => onContentChange({ ...content, title: event.target.value })}
            className={TEXTAREA_CLASSNAME}
          />
        </Field>
        <Field label="Subtitle">
          <textarea
            rows={3}
            value={content.subtitle || ""}
            onChange={(event) => onContentChange({ ...content, subtitle: event.target.value })}
            className={TEXTAREA_CLASSNAME}
          />
        </Field>
      </div>
    );
  }

  if (item.type === "blog") {
    return (
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">{definition.label}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow">
            <input
              type="text"
              value={content.eyebrow || ""}
              onChange={(event) => onContentChange({ ...content, eyebrow: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Title Emphasis">
            <input
              type="text"
              value={content.titleEmphasis || ""}
              onChange={(event) => onContentChange({ ...content, titleEmphasis: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Link Label">
            <input
              type="text"
              value={content.linkLabel || ""}
              onChange={(event) => onContentChange({ ...content, linkLabel: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Link URL">
            <input
              type="text"
              value={content.linkHref || ""}
              onChange={(event) => onContentChange({ ...content, linkHref: event.target.value })}
              className={INPUT_CLASSNAME}
              placeholder="/blog"
            />
          </Field>
        </div>
        <Field label="Title">
          <input
            type="text"
            value={content.title || ""}
            onChange={(event) => onContentChange({ ...content, title: event.target.value })}
            className={INPUT_CLASSNAME}
          />
        </Field>
      </div>
    );
  }

  if (item.type === "techStack") {
    return (
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">{definition.label}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow">
            <input
              type="text"
              value={content.eyebrow || ""}
              onChange={(event) => onContentChange({ ...content, eyebrow: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Title Emphasis">
            <input
              type="text"
              value={content.titleEmphasis || ""}
              onChange={(event) => onContentChange({ ...content, titleEmphasis: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
        </div>
        <Field label="Title">
          <input
            type="text"
            value={content.title || ""}
            onChange={(event) => onContentChange({ ...content, title: event.target.value })}
            className={INPUT_CLASSNAME}
          />
        </Field>
        <Field label="Stack Items" hint="One stack item per line">
          <textarea
            rows={10}
            value={toLineList(content.items)}
            onChange={(event) => onContentChange({ ...content, items: parseLineList(event.target.value) })}
            className={TEXTAREA_CLASSNAME}
          />
        </Field>
      </div>
    );
  }

  if (item.type === "testimonials") {
    return (
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">{definition.label}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow">
            <input
              type="text"
              value={content.eyebrow || ""}
              onChange={(event) => onContentChange({ ...content, eyebrow: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
          <Field label="Title Emphasis">
            <input
              type="text"
              value={content.titleEmphasis || ""}
              onChange={(event) => onContentChange({ ...content, titleEmphasis: event.target.value })}
              className={INPUT_CLASSNAME}
            />
          </Field>
        </div>
        <Field label="Title">
          <input
            type="text"
            value={content.title || ""}
            onChange={(event) => onContentChange({ ...content, title: event.target.value })}
            className={INPUT_CLASSNAME}
          />
        </Field>
        <Field
          label="Testimonials"
          hint="One testimonial per line: quote | name | role"
        >
          <textarea
            rows={10}
            value={toTestimonialItems(content.items)}
            onChange={(event) =>
              onContentChange({
                ...content,
                items: parseTestimonialItems(event.target.value),
              })
            }
            className={TEXTAREA_CLASSNAME}
          />
        </Field>
      </div>
    );
  }

  return <p className="text-sm text-muted-foreground">No editable fields for this section type.</p>;
}

