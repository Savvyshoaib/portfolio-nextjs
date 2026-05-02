"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, Eye, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { adminApi } from "@/lib/cms/admin-client";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { normalizePortfolioPayload } from "@/lib/cms/portfolio-detail";
import { keywordsToCsv, normalizeItemSeo } from "@/lib/cms/item-seo";

function toListInput(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value.join(", ");
}

function toLineInput(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value.join("\n");
}

function toParagraphInput(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value.join("\n\n");
}

function parseList(value) {
  return String(value || "")
    .split(/[\n,]/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function parseParagraphs(value) {
  return String(value || "")
    .split(/\r?\n\s*\r?\n/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function formatMetricsInput(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .map((metric) => {
      const tone = metric?.tone ? ` | ${metric.tone}` : "";
      return `${metric?.value || ""} | ${metric?.label || ""}${tone}`.trim();
    })
    .join("\n");
}

function parseMetricsInput(value) {
  return String(value || "")
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [valuePart = "", labelPart = "", tonePart = ""] = line.split("|").map((entry) => entry.trim());
      return {
        value: valuePart,
        label: labelPart,
        tone: tonePart || "info",
      };
    })
    .filter((metric) => metric.value || metric.label);
}

function createPayloadForm() {
  const payload = normalizePortfolioPayload({});

  return {
    year: payload.year,
    color: payload.color,
    size: payload.size,
    client: payload.client,
    timeline: payload.timeline,
    technologies: toListInput(payload.technologies),
    liveUrl: payload.liveUrl,
    githubUrl: payload.githubUrl,
    heroFeaturedLabel: payload.hero.featuredLabel,
    heroTypeLabel: payload.hero.typeLabel,
    heroDescription: payload.hero.description,
    heroCategories: toListInput(payload.hero.categories),
    heroAwardLabel: payload.hero.awardLabel,
    deepDiveTitle: payload.deepDive.title,
    deepDiveDescription: payload.deepDive.description,
    challengeTitle: payload.deepDive.challengeTitle,
    challengeParagraphs: toParagraphInput(payload.deepDive.challengeParagraphs),
    challengeCardLabel: payload.deepDive.challengeCardLabel,
    approachTitle: payload.deepDive.approachTitle,
    approachParagraphs: toParagraphInput(payload.deepDive.approachParagraphs),
    approachCardLabel: payload.deepDive.approachCardLabel,
    techStackTitle: payload.techStackSection.title,
    techStackSubtitle: payload.techStackSection.subtitle,
    techRowOne: toLineInput(payload.techStackSection.rowOne),
    techRowTwo: toLineInput(payload.techStackSection.rowTwo),
    resultsTitle: payload.results.title,
    resultsSummary: payload.results.summary,
    metrics: formatMetricsInput(payload.results.metrics),
    relatedTitle: payload.related.title,
    relatedDescription: payload.related.description,
    relatedViewProjectLabel: payload.related.viewProjectLabel,
    relatedViewAllLabel: payload.related.viewAllLabel,
    seoMetaTitle: "",
    seoMetaDescription: "",
    seoMetaKeywords: "",
    seoOgTitle: "",
    seoOgDescription: "",
    seoOgImageUrl: "",
  };
}

function createEmptyForm() {
  return {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image_url: "",
    tags: "",
    display_order: "0",
    published: true,
    featured: false,
    payload: createPayloadForm(),
  };
}

function formFromItem(item) {
  const payload = normalizePortfolioPayload(item?.payload || {});
  const seo = normalizeItemSeo(payload?.seo, {
    metaTitle: item?.title || "",
    metaDescription: item?.excerpt || payload.hero.description,
  });

  return {
    title: item?.title || "",
    slug: item?.slug || "",
    excerpt: item?.excerpt || "",
    content: item?.content || "",
    cover_image_url: item?.cover_image_url || "",
    tags: (item?.tags || []).join(", "),
    display_order: String(item?.display_order ?? 0),
    published: item?.published ?? true,
    featured: item?.featured ?? false,
    payload: {
      year: payload.year,
      color: payload.color,
      size: payload.size,
      client: payload.client,
      timeline: payload.timeline,
      technologies: toListInput(payload.technologies),
      liveUrl: payload.liveUrl,
      githubUrl: payload.githubUrl,
      heroFeaturedLabel: payload.hero.featuredLabel,
      heroTypeLabel: payload.hero.typeLabel,
      heroDescription: payload.hero.description,
      heroCategories: toListInput(payload.hero.categories),
      heroAwardLabel: payload.hero.awardLabel,
      deepDiveTitle: payload.deepDive.title,
      deepDiveDescription: payload.deepDive.description,
      challengeTitle: payload.deepDive.challengeTitle,
      challengeParagraphs: toParagraphInput(payload.deepDive.challengeParagraphs),
      challengeCardLabel: payload.deepDive.challengeCardLabel,
      approachTitle: payload.deepDive.approachTitle,
      approachParagraphs: toParagraphInput(payload.deepDive.approachParagraphs),
      approachCardLabel: payload.deepDive.approachCardLabel,
      techStackTitle: payload.techStackSection.title,
      techStackSubtitle: payload.techStackSection.subtitle,
      techRowOne: toLineInput(payload.techStackSection.rowOne),
      techRowTwo: toLineInput(payload.techStackSection.rowTwo),
      resultsTitle: payload.results.title,
      resultsSummary: payload.results.summary,
      metrics: formatMetricsInput(payload.results.metrics),
      relatedTitle: payload.related.title,
      relatedDescription: payload.related.description,
      relatedViewProjectLabel: payload.related.viewProjectLabel,
      relatedViewAllLabel: payload.related.viewAllLabel,
      seoMetaTitle: seo.metaTitle,
      seoMetaDescription: seo.metaDescription,
      seoMetaKeywords: keywordsToCsv(seo.metaKeywords),
      seoOgTitle: seo.ogTitle,
      seoOgDescription: seo.ogDescription,
      seoOgImageUrl: seo.ogImageUrl,
    },
  };
}

function buildSubmitItem(formData, itemId) {
  const payload = normalizePortfolioPayload({
    year: formData.payload.year,
    color: formData.payload.color,
    size: formData.payload.size,
    client: formData.payload.client,
    timeline: formData.payload.timeline,
    technologies: parseList(formData.payload.technologies),
    liveUrl: formData.payload.liveUrl,
    githubUrl: formData.payload.githubUrl,
    hero: {
      featuredLabel: formData.payload.heroFeaturedLabel,
      typeLabel: formData.payload.heroTypeLabel,
      description: formData.payload.heroDescription,
      categories: parseList(formData.payload.heroCategories),
      awardLabel: formData.payload.heroAwardLabel,
    },
    deepDive: {
      title: formData.payload.deepDiveTitle,
      description: formData.payload.deepDiveDescription,
      challengeTitle: formData.payload.challengeTitle,
      challengeParagraphs: parseParagraphs(formData.payload.challengeParagraphs),
      challengeCardLabel: formData.payload.challengeCardLabel,
      approachTitle: formData.payload.approachTitle,
      approachParagraphs: parseParagraphs(formData.payload.approachParagraphs),
      approachCardLabel: formData.payload.approachCardLabel,
    },
    techStackSection: {
      title: formData.payload.techStackTitle,
      subtitle: formData.payload.techStackSubtitle,
      rowOne: parseList(formData.payload.techRowOne),
      rowTwo: parseList(formData.payload.techRowTwo),
    },
    results: {
      title: formData.payload.resultsTitle,
      summary: formData.payload.resultsSummary,
      metrics: parseMetricsInput(formData.payload.metrics),
    },
    related: {
      title: formData.payload.relatedTitle,
      description: formData.payload.relatedDescription,
      viewProjectLabel: formData.payload.relatedViewProjectLabel,
      viewAllLabel: formData.payload.relatedViewAllLabel,
    },
    seo: {
      metaTitle: formData.payload.seoMetaTitle,
      metaDescription: formData.payload.seoMetaDescription,
      metaKeywords: formData.payload.seoMetaKeywords,
      ogTitle: formData.payload.seoOgTitle,
      ogDescription: formData.payload.seoOgDescription,
      ogImageUrl: formData.payload.seoOgImageUrl,
    },
  });

  return {
    id: itemId,
    title: formData.title.trim(),
    slug: formData.slug.trim(),
    excerpt: formData.excerpt.trim(),
    content: formData.content || "",
    cover_image_url: formData.cover_image_url.trim(),
    tags: parseList(formData.tags),
    display_order: Number(formData.display_order || 0),
    published: Boolean(formData.published),
    featured: Boolean(formData.featured),
    payload,
  };
}

function Field({ label, children, hint }) {
  return (
    <label className="space-y-2 block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </label>
  );
}

const INPUT_CLASSNAME =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all";

const TEXTAREA_CLASSNAME =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all resize-none";

export default function PortfolioManagementPage() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [formData, setFormData] = useState(createEmptyForm());

  const sortedPortfolio = useMemo(() => {
    return [...portfolio].sort((left, right) => (left.display_order ?? 0) - (right.display_order ?? 0));
  }, [portfolio]);

  async function fetchPortfolio({ showSpinner = true } = {}) {
    try {
      if (showSpinner) {
        setLoading(true);
      }
      setError("");
      const response = await adminApi.getContent("portfolio");
      setPortfolio(response.items || []);
    } catch (requestError) {
      setError(requestError.message || "Failed to fetch portfolio items.");
    } finally {
      if (showSpinner) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialPortfolio() {
      try {
        setError("");
        const response = await adminApi.getContent("portfolio");
        if (cancelled) {
          return;
        }
        setPortfolio(response.items || []);
      } catch (requestError) {
        if (cancelled) {
          return;
        }
        setError(requestError.message || "Failed to fetch portfolio items.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialPortfolio();

    return () => {
      cancelled = true;
    };
  }, []);

  function resetForm() {
    setFormData(createEmptyForm());
    setEditingItem(null);
  }

  function startCreate() {
    resetForm();
    setShowForm(true);
  }

  function startEdit(item) {
    setEditingItem(item);
    setFormData(formFromItem(item));
    setShowForm(true);
  }

  function updateFormData(path, value) {
    if (path.startsWith("payload.")) {
      const key = path.replace("payload.", "");
      setFormData((previous) => ({
        ...previous,
        payload: {
          ...previous.payload,
          [key]: value,
        },
      }));
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [path]: value,
    }));
  }

  async function handleCoverImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setCoverUploading(true);
    setError("");

    try {
      const result = await adminApi.uploadFile(file, "portfolio_cover");
      updateFormData("cover_image_url", result?.url || "");
      setSuccess("Cover image uploaded successfully.");
    } catch (requestError) {
      setError(requestError.message || "Failed to upload cover image.");
    } finally {
      setCoverUploading(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const submitItem = buildSubmitItem(formData, editingItem?.id);
      await adminApi.saveContent("portfolio", submitItem);
      setSuccess(editingItem ? "Portfolio item updated successfully!" : "Portfolio item created successfully!");
      setShowForm(false);
      resetForm();
      await fetchPortfolio({ showSpinner: false });
    } catch (requestError) {
      setError(requestError.message || "Failed to save portfolio item.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this portfolio item?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await adminApi.deleteContent("portfolio", id);
      setSuccess("Portfolio item deleted successfully!");
      await fetchPortfolio({ showSpinner: false });
    } catch (requestError) {
      setError(requestError.message || "Failed to delete portfolio item.");
    } finally {
      setLoading(false);
    }
  }

  if (loading && portfolio.length === 0) {
    return <p className="text-sm text-muted-foreground">Loading portfolio items...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Content</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Portfolio Management</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage case studies with a structured schema that directly powers the portfolio detail page.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-4 py-2 text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Portfolio Item
        </button>
      </div>

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">{success}</p>
      ) : null}

      {!showForm ? (
        <div className="rounded-2xl border border-border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Timeline
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedPortfolio.map((item) => {
                  const payload = normalizePortfolioPayload(item.payload || {});

                  return (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.cover_image_url ? (
                            <img src={item.cover_image_url} alt={item.title} className="h-10 w-10 rounded object-cover" />
                          ) : null}
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{item.excerpt}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{payload.timeline}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{payload.client}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                            {item.published ? "Published" : "Draft"}
                          </span>
                          {item.featured ? (
                            <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-1 text-xs text-accent">
                              Featured
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={item.slug ? `/portfolio/${item.slug}` : "/portfolio"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs hover:bg-secondary/60 transition-colors"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </a>
                          <button
                            onClick={() => startEdit(item)}
                            className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs hover:bg-secondary/60 transition-colors"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-destructive/30 text-destructive px-2 py-1 text-xs hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {sortedPortfolio.length === 0 && !loading ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No portfolio items found.</p>
              <button
                onClick={startCreate}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-4 py-2 text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Your First Portfolio Item
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-background p-6 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{editingItem ? "Edit Portfolio Item" : "Add Portfolio Item"}</h2>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Core</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Title *">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(event) => updateFormData("title", event.target.value)}
                  className={INPUT_CLASSNAME}
                  placeholder="Project title"
                  required
                />
              </Field>
              <Field label="Slug">
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(event) => updateFormData("slug", event.target.value)}
                  className={INPUT_CLASSNAME}
                  placeholder="auto-generated-if-empty"
                />
              </Field>
              <Field label="Display Order">
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(event) => updateFormData("display_order", event.target.value)}
                  className={INPUT_CLASSNAME}
                  min="0"
                />
              </Field>
              <Field label="Cover Image URL">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.cover_image_url}
                      onChange={(event) => updateFormData("cover_image_url", event.target.value)}
                      className={`${INPUT_CLASSNAME} flex-1`}
                      placeholder="https://example.com/image.jpg"
                    />
                    <label className="inline-flex items-center gap-2 rounded-xl border border-input bg-card px-3 py-2 text-sm cursor-pointer hover:bg-secondary/60 transition-colors">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/avif"
                        className="hidden"
                        onChange={handleCoverImageUpload}
                        disabled={coverUploading}
                      />
                      {coverUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {coverUploading ? "Uploading" : "Upload"}
                    </label>
                  </div>
                  {formData.cover_image_url ? (
                    <div className="rounded-xl border border-border p-2">
                      <img
                        src={formData.cover_image_url}
                        alt="Cover preview"
                        className="w-full h-44 object-cover rounded-lg"
                      />
                    </div>
                  ) : null}
                </div>
              </Field>
              <Field label="Color Gradient">
                <input
                  type="text"
                  value={formData.payload.color}
                  onChange={(event) => updateFormData("payload.color", event.target.value)}
                  className={INPUT_CLASSNAME}
                  placeholder="from-accent via-purple-500 to-pink-500"
                />
              </Field>
              <Field label="Card Size">
                <select
                  value={formData.payload.size}
                  onChange={(event) => updateFormData("payload.size", event.target.value)}
                  className={INPUT_CLASSNAME}
                >
                  <option value="sm">Small</option>
                  <option value="lg">Large</option>
                </select>
              </Field>
              <Field label="Year">
                <input
                  type="text"
                  value={formData.payload.year}
                  onChange={(event) => updateFormData("payload.year", event.target.value)}
                  className={INPUT_CLASSNAME}
                  placeholder="2026"
                />
              </Field>
              <Field label="Timeline">
                <input
                  type="text"
                  value={formData.payload.timeline}
                  onChange={(event) => updateFormData("payload.timeline", event.target.value)}
                  className={INPUT_CLASSNAME}
                  placeholder="Q4 2025"
                />
              </Field>
              <Field label="Client">
                <input
                  type="text"
                  value={formData.payload.client}
                  onChange={(event) => updateFormData("payload.client", event.target.value)}
                  className={INPUT_CLASSNAME}
                  placeholder="Enterprise"
                />
              </Field>
              <Field label="Technologies" hint="Comma or line separated">
                <textarea
                  value={formData.payload.technologies}
                  onChange={(event) => updateFormData("payload.technologies", event.target.value)}
                  rows={3}
                  className={TEXTAREA_CLASSNAME}
                  placeholder="React, Next.js, Tailwind, TypeScript"
                />
              </Field>
              <Field label="Live URL">
                <input
                  type="url"
                  value={formData.payload.liveUrl}
                  onChange={(event) => updateFormData("payload.liveUrl", event.target.value)}
                  className={INPUT_CLASSNAME}
                  placeholder="https://example.com"
                />
              </Field>
              <Field label="Source Code URL">
                <input
                  type="url"
                  value={formData.payload.githubUrl}
                  onChange={(event) => updateFormData("payload.githubUrl", event.target.value)}
                  className={INPUT_CLASSNAME}
                  placeholder="https://github.com/user/repo"
                />
              </Field>
            </div>
            <Field label="Excerpt *">
              <textarea
                value={formData.excerpt}
                onChange={(event) => updateFormData("excerpt", event.target.value)}
                rows={3}
                className={TEXTAREA_CLASSNAME}
                placeholder="Short description shown in lists and related cards"
                required
              />
            </Field>
            <Field label="Tags" hint="Comma or line separated">
              <textarea
                value={formData.tags}
                onChange={(event) => updateFormData("tags", event.target.value)}
                rows={2}
                className={TEXTAREA_CLASSNAME}
                placeholder="ui/ux, web design, development"
              />
            </Field>
            <div className="flex flex-wrap gap-6">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(formData.published)}
                  onChange={(event) => updateFormData("published", event.target.checked)}
                />
                Published
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(formData.featured)}
                  onChange={(event) => updateFormData("featured", event.target.checked)}
                />
                Featured
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">SEO</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Meta Title">
                <input
                  type="text"
                  value={formData.payload.seoMetaTitle}
                  onChange={(event) => updateFormData("payload.seoMetaTitle", event.target.value)}
                  className={INPUT_CLASSNAME}
                  placeholder="Custom page title for this project"
                />
              </Field>
              <Field label="Open Graph Title">
                <input
                  type="text"
                  value={formData.payload.seoOgTitle}
                  onChange={(event) => updateFormData("payload.seoOgTitle", event.target.value)}
                  className={INPUT_CLASSNAME}
                  placeholder="Optional social title override"
                />
              </Field>
              <Field label="Open Graph Image URL">
                <input
                  type="url"
                  value={formData.payload.seoOgImageUrl}
                  onChange={(event) => updateFormData("payload.seoOgImageUrl", event.target.value)}
                  className={INPUT_CLASSNAME}
                  placeholder="https://example.com/og-project.jpg"
                />
              </Field>
              <Field label="Meta Keywords" hint="Comma or line separated">
                <textarea
                  rows={3}
                  value={formData.payload.seoMetaKeywords}
                  onChange={(event) => updateFormData("payload.seoMetaKeywords", event.target.value)}
                  className={TEXTAREA_CLASSNAME}
                  placeholder="saas, ui/ux, case study"
                />
              </Field>
            </div>
            <Field label="Meta Description">
              <textarea
                rows={3}
                value={formData.payload.seoMetaDescription}
                onChange={(event) => updateFormData("payload.seoMetaDescription", event.target.value)}
                className={TEXTAREA_CLASSNAME}
                placeholder="Short SEO description for this portfolio page."
              />
            </Field>
            <Field label="Open Graph Description">
              <textarea
                rows={3}
                value={formData.payload.seoOgDescription}
                onChange={(event) => updateFormData("payload.seoOgDescription", event.target.value)}
                className={TEXTAREA_CLASSNAME}
                placeholder="Optional social description override."
              />
            </Field>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Hero</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Featured Label">
                <input
                  type="text"
                  value={formData.payload.heroFeaturedLabel}
                  onChange={(event) => updateFormData("payload.heroFeaturedLabel", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Type Label">
                <input
                  type="text"
                  value={formData.payload.heroTypeLabel}
                  onChange={(event) => updateFormData("payload.heroTypeLabel", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Award Label">
                <input
                  type="text"
                  value={formData.payload.heroAwardLabel}
                  onChange={(event) => updateFormData("payload.heroAwardLabel", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Hero Categories" hint="Comma or line separated">
                <textarea
                  value={formData.payload.heroCategories}
                  onChange={(event) => updateFormData("payload.heroCategories", event.target.value)}
                  rows={3}
                  className={TEXTAREA_CLASSNAME}
                />
              </Field>
            </div>
            <Field label="Hero Description">
              <textarea
                value={formData.payload.heroDescription}
                onChange={(event) => updateFormData("payload.heroDescription", event.target.value)}
                rows={4}
                className={TEXTAREA_CLASSNAME}
              />
            </Field>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Deep Dive</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Section Title">
                <input
                  type="text"
                  value={formData.payload.deepDiveTitle}
                  onChange={(event) => updateFormData("payload.deepDiveTitle", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Section Description">
                <input
                  type="text"
                  value={formData.payload.deepDiveDescription}
                  onChange={(event) => updateFormData("payload.deepDiveDescription", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Challenge Title">
                <input
                  type="text"
                  value={formData.payload.challengeTitle}
                  onChange={(event) => updateFormData("payload.challengeTitle", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Challenge Card Label">
                <input
                  type="text"
                  value={formData.payload.challengeCardLabel}
                  onChange={(event) => updateFormData("payload.challengeCardLabel", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Approach Title">
                <input
                  type="text"
                  value={formData.payload.approachTitle}
                  onChange={(event) => updateFormData("payload.approachTitle", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Approach Card Label">
                <input
                  type="text"
                  value={formData.payload.approachCardLabel}
                  onChange={(event) => updateFormData("payload.approachCardLabel", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Challenge Paragraphs" hint="Use blank lines between paragraphs">
                <textarea
                  value={formData.payload.challengeParagraphs}
                  onChange={(event) => updateFormData("payload.challengeParagraphs", event.target.value)}
                  rows={8}
                  className={TEXTAREA_CLASSNAME}
                />
              </Field>
              <Field label="Approach Paragraphs" hint="Use blank lines between paragraphs">
                <textarea
                  value={formData.payload.approachParagraphs}
                  onChange={(event) => updateFormData("payload.approachParagraphs", event.target.value)}
                  rows={8}
                  className={TEXTAREA_CLASSNAME}
                />
              </Field>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tech Stack Section</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Section Title">
                <input
                  type="text"
                  value={formData.payload.techStackTitle}
                  onChange={(event) => updateFormData("payload.techStackTitle", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Section Subtitle">
                <input
                  type="text"
                  value={formData.payload.techStackSubtitle}
                  onChange={(event) => updateFormData("payload.techStackSubtitle", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Top Carousel Items" hint="One item per line">
                <textarea
                  value={formData.payload.techRowOne}
                  onChange={(event) => updateFormData("payload.techRowOne", event.target.value)}
                  rows={8}
                  className={TEXTAREA_CLASSNAME}
                />
              </Field>
              <Field label="Bottom Carousel Items" hint="One item per line">
                <textarea
                  value={formData.payload.techRowTwo}
                  onChange={(event) => updateFormData("payload.techRowTwo", event.target.value)}
                  rows={8}
                  className={TEXTAREA_CLASSNAME}
                />
              </Field>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Results</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Results Title">
                <input
                  type="text"
                  value={formData.payload.resultsTitle}
                  onChange={(event) => updateFormData("payload.resultsTitle", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Results Summary">
                <input
                  type="text"
                  value={formData.payload.resultsSummary}
                  onChange={(event) => updateFormData("payload.resultsSummary", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
            </div>
            <Field
              label="Metrics"
              hint="One metric per line in this format: value | label | tone. Tones: success, info, warning, magenta."
            >
              <textarea
                value={formData.payload.metrics}
                onChange={(event) => updateFormData("payload.metrics", event.target.value)}
                rows={5}
                className={TEXTAREA_CLASSNAME}
                placeholder="300% | Increase in User Engagement | success"
              />
            </Field>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Related Section</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Section Title">
                <input
                  type="text"
                  value={formData.payload.relatedTitle}
                  onChange={(event) => updateFormData("payload.relatedTitle", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Section Description">
                <input
                  type="text"
                  value={formData.payload.relatedDescription}
                  onChange={(event) => updateFormData("payload.relatedDescription", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="View Project Label">
                <input
                  type="text"
                  value={formData.payload.relatedViewProjectLabel}
                  onChange={(event) => updateFormData("payload.relatedViewProjectLabel", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="View All Label">
                <input
                  type="text"
                  value={formData.payload.relatedViewAllLabel}
                  onChange={(event) => updateFormData("payload.relatedViewAllLabel", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Optional Rich Content</h3>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => updateFormData("content", value)}
              placeholder="Optional rich content. Stored with the item for future frontend use."
              height="260px"
              showPreview={true}
            />
          </section>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="rounded-lg border border-border px-6 py-2 text-sm font-medium hover:bg-secondary/60 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-accent text-accent-foreground px-6 py-2 text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-60"
            >
              {loading ? "Saving..." : editingItem ? "Update Item" : "Create Item"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
