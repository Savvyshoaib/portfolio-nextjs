"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { adminApi } from "@/lib/cms/admin-client";
import { CMS_CONTENT_TYPES } from "@/lib/cms/constants";
import { cn } from "@/lib/utils";

const typeLabels = {
  services: "Services",
  portfolio: "Portfolio",
  blog: "Blog Posts",
  testimonials: "Testimonials",
  tech_stack: "Tech Stack",
};

function defaultItem(type) {
  return {
    id: "",
    title: "",
    slug: "",
    excerpt: "",
    cover_image_url: "",
    tagsCsv: "",
    display_order: 0,
    published: true,
    featured: type !== "tech_stack",
    payloadText: "{}",
  };
}

function normalizeItemForEditor(type, item) {
  return {
    id: item?.id || "",
    title: item?.title || "",
    slug: item?.slug || "",
    excerpt: item?.excerpt || "",
    cover_image_url: item?.cover_image_url || "",
    tagsCsv: Array.isArray(item?.tags) ? item.tags.join(", ") : "",
    display_order: Number(item?.display_order ?? 0),
    published: item?.published ?? true,
    featured: type !== "tech_stack" ? item?.featured ?? true : false,
    payloadText: JSON.stringify(item?.payload || {}, null, 2),
  };
}

function parseJson(text, fallback = {}) {
  try {
    return JSON.parse(text || "{}");
  } catch {
    return fallback;
  }
}

export default function ContentManagementPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("sections");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sections, setSections] = useState({});
  const [selectedSectionKey, setSelectedSectionKey] = useState("");
  const [sectionEditor, setSectionEditor] = useState("{}");
  const [content, setContent] = useState({
    services: [],
    portfolio: [],
    blog: [],
    testimonials: [],
    tech_stack: [],
  });
  const [editor, setEditor] = useState(defaultItem("services"));

  useEffect(() => {
    const run = async () => {
      try {
        const [sectionsResponse, ...contentResponses] = await Promise.all([
          adminApi.getSections(),
          ...CMS_CONTENT_TYPES.map((type) => adminApi.getContent(type)),
        ]);

        const nextSections = sectionsResponse.sections || {};
        setSections(nextSections);
        const keys = Object.keys(nextSections);
        const firstKey = keys[0] || "hero";
        setSelectedSectionKey(firstKey);
        setSectionEditor(JSON.stringify(nextSections[firstKey] || {}, null, 2));

        const nextContent = {};
        contentResponses.forEach((response, index) => {
          nextContent[CMS_CONTENT_TYPES[index]] = response.items || [];
        });
        setContent(nextContent);
      } catch (requestError) {
        setError(requestError.message || "Failed to load content.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const activeType = activeTab === "sections" ? null : activeTab;
  const activeItems = useMemo(() => (activeType ? content[activeType] || [] : []), [activeType, content]);

  const onSelectSection = (key) => {
    setSelectedSectionKey(key);
    setSectionEditor(JSON.stringify(sections[key] || {}, null, 2));
    setSuccess("");
    setError("");
  };

  const onSaveSection = async () => {
    if (!selectedSectionKey) return;

    const parsed = parseJson(sectionEditor, null);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      setError("Section JSON must be a valid object.");
      return;
    }

    setError("");
    setSuccess("");
    try {
      const response = await adminApi.saveSection(selectedSectionKey, parsed);
      setSections((prev) => ({ ...prev, [selectedSectionKey]: response.value }));
      setSectionEditor(JSON.stringify(response.value, null, 2));
      setSuccess(`Saved section: ${selectedSectionKey}`);
    } catch (saveError) {
      setError(saveError.message || "Failed to save section.");
    }
  };

  const onSelectItem = (type, item) => {
    setActiveTab(type);
    setEditor(normalizeItemForEditor(type, item));
    setSuccess("");
    setError("");
  };

  const onCreateNew = (type) => {
    setActiveTab(type);
    setEditor(defaultItem(type));
    setSuccess("");
    setError("");
  };

  const onSaveItem = async () => {
    if (!activeType) return;
    if (!editor.title.trim()) {
      setError("Title is required.");
      return;
    }

    const payload = parseJson(editor.payloadText, null);
    if (payload === null || Array.isArray(payload) || typeof payload !== "object") {
      setError("Payload JSON must be a valid object.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const itemPayload = {
        id: editor.id || undefined,
        title: editor.title.trim(),
        slug: editor.slug.trim(),
        excerpt: editor.excerpt,
        cover_image_url: editor.cover_image_url,
        tags: editor.tagsCsv
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        display_order: Number(editor.display_order || 0),
        published: Boolean(editor.published),
        featured: activeType === "tech_stack" ? false : Boolean(editor.featured),
        payload,
      };

      const response = await adminApi.saveContent(activeType, itemPayload);
      const updatedItem = response.item;

      setContent((prev) => {
        const items = [...(prev[activeType] || [])];
        const index = items.findIndex((item) => item.id === updatedItem.id);
        if (index >= 0) {
          items[index] = updatedItem;
        } else {
          items.push(updatedItem);
        }

        items.sort((a, b) => {
          const orderA = Number(a.display_order ?? 0);
          const orderB = Number(b.display_order ?? 0);
          return orderA - orderB;
        });

        return { ...prev, [activeType]: items };
      });

      setEditor(normalizeItemForEditor(activeType, updatedItem));
      setSuccess(`${typeLabels[activeType]} item saved.`);
    } catch (saveError) {
      setError(saveError.message || "Failed to save item.");
    }
  };

  const onDeleteItem = async () => {
    if (!activeType || !editor.id) return;
    const shouldDelete = window.confirm("Delete this item?");
    if (!shouldDelete) return;

    setError("");
    setSuccess("");
    try {
      await adminApi.deleteContent(activeType, editor.id);
      setContent((prev) => ({
        ...prev,
        [activeType]: (prev[activeType] || []).filter((item) => item.id !== editor.id),
      }));
      setEditor(defaultItem(activeType));
      setSuccess("Item deleted.");
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete item.");
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading content management...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Content Management</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Dynamic Sections and Collections</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update homepage sections and manage all structured content collections that power your frontend.
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
      ) : null}
      {success ? (
        <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">{success}</p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("sections")}
          className={cn(
            "rounded-lg px-3 py-2 text-sm transition-colors",
            activeTab === "sections" ? "bg-accent/15 text-accent border border-accent/30" : "border border-border hover:bg-secondary/70"
          )}
        >
          Website Sections
        </button>
        {CMS_CONTENT_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              setActiveTab(type);
              setEditor(defaultItem(type));
            }}
            className={cn(
              "rounded-lg px-3 py-2 text-sm transition-colors",
              activeTab === type ? "bg-accent/15 text-accent border border-accent/30" : "border border-border hover:bg-secondary/70"
            )}
          >
            {typeLabels[type]}
          </button>
        ))}
      </div>

      {activeTab === "sections" ? (
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <aside className="rounded-2xl border border-border p-3 bg-background h-fit">
            <p className="px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground">Section Keys</p>
            <div className="space-y-1">
              {Object.keys(sections).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelectSection(key)}
                  className={cn(
                    "w-full text-left rounded-lg px-3 py-2 text-sm transition-colors",
                    selectedSectionKey === key
                      ? "bg-accent/15 text-accent border border-accent/30"
                      : "hover:bg-secondary/70 border border-transparent"
                  )}
                >
                  {key}
                </button>
              ))}
            </div>
          </aside>

          <div className="rounded-2xl border border-border p-5 bg-background space-y-4">
            <p className="text-sm font-semibold">{selectedSectionKey}</p>
            <textarea
              rows={18}
              value={sectionEditor}
              onChange={(event) => setSectionEditor(event.target.value)}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm font-mono focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
            />
            <button
              type="button"
              onClick={onSaveSection}
              className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Save className="h-4 w-4" />
              Save section JSON
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-2xl border border-border p-3 bg-background h-fit">
            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{typeLabels[activeType]}</p>
              <button
                type="button"
                onClick={() => onCreateNew(activeType)}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs hover:bg-secondary/70 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                New
              </button>
            </div>
            <div className="space-y-1 max-h-[460px] overflow-auto">
              {activeItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectItem(activeType, item)}
                  className={cn(
                    "w-full text-left rounded-lg px-3 py-2 text-sm transition-colors border",
                    editor.id === item.id
                      ? "bg-accent/15 text-accent border-accent/30"
                      : "border-transparent hover:bg-secondary/70"
                  )}
                >
                  <p className="font-medium line-clamp-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground">Order: {item.display_order ?? 0}</p>
                </button>
              ))}
            </div>
          </aside>

          <div className="rounded-2xl border border-border p-5 bg-background space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title" value={editor.title} onChange={(value) => setEditor((prev) => ({ ...prev, title: value }))} />
              <Field label="Slug" value={editor.slug} onChange={(value) => setEditor((prev) => ({ ...prev, slug: value }))} />
              <Field label="Display Order" type="number" value={editor.display_order} onChange={(value) => setEditor((prev) => ({ ...prev, display_order: Number(value || 0) }))} />
              <Field label="Cover Image URL" value={editor.cover_image_url} onChange={(value) => setEditor((prev) => ({ ...prev, cover_image_url: value }))} />
            </div>

            <Textarea
              label="Excerpt / Summary"
              rows={3}
              value={editor.excerpt}
              onChange={(value) => setEditor((prev) => ({ ...prev, excerpt: value }))}
            />

            <Field
              label="Tags (comma separated)"
              value={editor.tagsCsv}
              onChange={(value) => setEditor((prev) => ({ ...prev, tagsCsv: value }))}
            />

            <div className="grid gap-3 md:grid-cols-2">
              <Toggle
                label="Published"
                checked={Boolean(editor.published)}
                onChange={(checked) => setEditor((prev) => ({ ...prev, published: checked }))}
              />
              {activeType !== "tech_stack" ? (
                <Toggle
                  label="Featured"
                  checked={Boolean(editor.featured)}
                  onChange={(checked) => setEditor((prev) => ({ ...prev, featured: checked }))}
                />
              ) : null}
            </div>

            <Textarea
              label="Payload JSON (type-specific fields)"
              rows={10}
              value={editor.payloadText}
              onChange={(value) => setEditor((prev) => ({ ...prev, payloadText: value }))}
              mono
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onSaveItem}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Save className="h-4 w-4" />
                Save item
              </button>
              {editor.id ? (
                <button
                  type="button"
                  onClick={onDeleteItem}
                  className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive px-5 py-3 text-sm font-medium hover:bg-destructive/15 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete item
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 4, mono = false }) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <textarea
        rows={rows}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all",
          mono && "font-mono"
        )}
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
        className="h-4 w-4 accent-[var(--color-accent)]"
      />
    </label>
  );
}
