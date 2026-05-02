"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, Eye, Wrench, Upload, Loader2 } from "lucide-react";
import { adminApi } from "@/lib/cms/admin-client";
import { normalizeServicePayload } from "@/lib/cms/service-detail";
import { keywordsToCsv, normalizeItemSeo } from "@/lib/cms/item-seo";
import { cn } from "@/lib/utils";

const INPUT_CLASSNAME =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all";

const TEXTAREA_CLASSNAME =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all resize-none";

const HERO_GRADIENT_OPTIONS = [
  { value: 0, label: "Blue / Purple / Pink" },
  { value: 1, label: "Green / Emerald / Cyan" },
  { value: 2, label: "Orange / Red / Pink" },
];

function toLineInput(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value.join("\n");
}

function parseLineList(value) {
  return String(value || "")
    .split(/\r?\n/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function toParagraphInput(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value.join("\n\n");
}

function parseParagraphs(value) {
  return String(value || "")
    .split(/\r?\n\s*\r?\n/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function formatApproachSteps(steps) {
  if (!Array.isArray(steps)) {
    return "";
  }

  return steps
    .map((step) => `${step?.title || ""} | ${step?.description || ""}`.trim())
    .join("\n");
}

function parseApproachSteps(value) {
  return String(value || "")
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [titlePart = "", ...descriptionParts] = line.split("|");
      return {
        title: titlePart.trim(),
        description: descriptionParts.join("|").trim(),
      };
    })
    .filter((step) => step.title || step.description);
}

function formatProcessSteps(steps) {
  if (!Array.isArray(steps)) {
    return "";
  }

  return steps
    .map((step) => `${step?.step || ""} | ${step?.title || ""} | ${step?.description || ""}`.trim())
    .join("\n");
}

function parseProcessSteps(value) {
  return String(value || "")
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [stepPart = "", titlePart = "", ...descriptionParts] = line.split("|");
      const fallbackStep = String(index + 1).padStart(2, "0");
      return {
        step: stepPart.trim() || fallbackStep,
        title: titlePart.trim(),
        description: descriptionParts.join("|").trim(),
      };
    })
    .filter((step) => step.title || step.description);
}

function parseTags(value) {
  return String(value || "")
    .split(/[\n,]/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function createPayloadForm() {
  const payload = normalizeServicePayload({}, { title: "Professional Service" });

  return {
    heroBadgeText: payload.hero.badgeText,
    heroSubtitle: payload.hero.subtitle,
    heroDescription: payload.hero.description,
    heroCategories: toLineInput(payload.hero.categories),
    heroGradientIndex: String(payload.hero.image.gradientIndex),
    heroAwardLabel: payload.hero.image.awardLabel,
    heroPrimaryCtaLabel: payload.hero.primaryCta.label,
    heroPrimaryCtaHref: payload.hero.primaryCta.href,
    heroSecondaryCtaLabel: payload.hero.secondaryCta.label,
    heroSecondaryCtaHref: payload.hero.secondaryCta.href,
    overviewDuration: payload.overview.duration,
    overviewTeamSize: payload.overview.teamSize,
    overviewSupport: payload.overview.support,
    aboutTitle: payload.about.title,
    aboutSubtitle: payload.about.subtitle,
    aboutOverviewTitle: payload.about.overviewTitle,
    aboutOverviewParagraphs: toParagraphInput(payload.about.overviewParagraphs),
    benefitsTitle: payload.benefits.title,
    benefitsItems: toLineInput(payload.benefits.items),
    approachTitle: payload.approach.title,
    approachSteps: formatApproachSteps(payload.approach.steps),
    processTitle: payload.process.title,
    processDescription: payload.process.description,
    processSteps: formatProcessSteps(payload.process.steps),
    ctaTitle: payload.cta.title,
    ctaDescription: payload.cta.description,
    ctaBullets: toLineInput(payload.cta.bullets),
    ctaFormTitle: payload.cta.formTitle,
    ctaNamePlaceholder: payload.cta.formNamePlaceholder,
    ctaEmailPlaceholder: payload.cta.formEmailPlaceholder,
    ctaMessagePlaceholder: payload.cta.formMessagePlaceholder,
    ctaSubmitLabel: payload.cta.formSubmitLabel,
    ctaResponseNote: payload.cta.responseNote,
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
    icon: "",
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
  const payload = normalizeServicePayload(item?.payload || {}, { title: item?.title || "" });
  const seo = normalizeItemSeo(payload?.seo, {
    metaTitle: item?.title || "",
    metaDescription: item?.excerpt || payload.hero.description,
  });

  return {
    title: item?.title || "",
    slug: item?.slug || "",
    excerpt: item?.excerpt || "",
    icon: item?.icon || item?.payload?.icon || "",
    content: item?.content || "",
    cover_image_url: item?.cover_image_url || "",
    tags: (item?.tags || []).join(", "),
    display_order: String(item?.display_order ?? 0),
    published: item?.published ?? true,
    featured: item?.featured ?? false,
    payload: {
      heroBadgeText: payload.hero.badgeText,
      heroSubtitle: payload.hero.subtitle,
      heroDescription: payload.hero.description,
      heroCategories: toLineInput(payload.hero.categories),
      heroGradientIndex: String(payload.hero.image.gradientIndex),
      heroAwardLabel: payload.hero.image.awardLabel,
      heroPrimaryCtaLabel: payload.hero.primaryCta.label,
      heroPrimaryCtaHref: payload.hero.primaryCta.href,
      heroSecondaryCtaLabel: payload.hero.secondaryCta.label,
      heroSecondaryCtaHref: payload.hero.secondaryCta.href,
      overviewDuration: payload.overview.duration,
      overviewTeamSize: payload.overview.teamSize,
      overviewSupport: payload.overview.support,
      aboutTitle: payload.about.title,
      aboutSubtitle: payload.about.subtitle,
      aboutOverviewTitle: payload.about.overviewTitle,
      aboutOverviewParagraphs: toParagraphInput(payload.about.overviewParagraphs),
      benefitsTitle: payload.benefits.title,
      benefitsItems: toLineInput(payload.benefits.items),
      approachTitle: payload.approach.title,
      approachSteps: formatApproachSteps(payload.approach.steps),
      processTitle: payload.process.title,
      processDescription: payload.process.description,
      processSteps: formatProcessSteps(payload.process.steps),
      ctaTitle: payload.cta.title,
      ctaDescription: payload.cta.description,
      ctaBullets: toLineInput(payload.cta.bullets),
      ctaFormTitle: payload.cta.formTitle,
      ctaNamePlaceholder: payload.cta.formNamePlaceholder,
      ctaEmailPlaceholder: payload.cta.formEmailPlaceholder,
      ctaMessagePlaceholder: payload.cta.formMessagePlaceholder,
      ctaSubmitLabel: payload.cta.formSubmitLabel,
      ctaResponseNote: payload.cta.responseNote,
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
  const normalizedPayload = normalizeServicePayload(
    {
      icon: formData.icon.trim(),
      hero: {
        badgeText: formData.payload.heroBadgeText,
        subtitle: formData.payload.heroSubtitle,
        description: formData.payload.heroDescription,
        categories: parseLineList(formData.payload.heroCategories),
        image: {
          gradientIndex: Number(formData.payload.heroGradientIndex || 0),
          awardLabel: formData.payload.heroAwardLabel,
        },
        primaryCta: {
          label: formData.payload.heroPrimaryCtaLabel,
          href: formData.payload.heroPrimaryCtaHref,
        },
        secondaryCta: {
          label: formData.payload.heroSecondaryCtaLabel,
          href: formData.payload.heroSecondaryCtaHref,
        },
      },
      overview: {
        duration: formData.payload.overviewDuration,
        teamSize: formData.payload.overviewTeamSize,
        support: formData.payload.overviewSupport,
      },
      about: {
        title: formData.payload.aboutTitle,
        subtitle: formData.payload.aboutSubtitle,
        overviewTitle: formData.payload.aboutOverviewTitle,
        overviewParagraphs: parseParagraphs(formData.payload.aboutOverviewParagraphs),
      },
      benefits: {
        title: formData.payload.benefitsTitle,
        items: parseLineList(formData.payload.benefitsItems),
      },
      approach: {
        title: formData.payload.approachTitle,
        steps: parseApproachSteps(formData.payload.approachSteps),
      },
      process: {
        title: formData.payload.processTitle,
        description: formData.payload.processDescription,
        steps: parseProcessSteps(formData.payload.processSteps),
      },
      cta: {
        title: formData.payload.ctaTitle,
        description: formData.payload.ctaDescription,
        bullets: parseLineList(formData.payload.ctaBullets),
        formTitle: formData.payload.ctaFormTitle,
        formNamePlaceholder: formData.payload.ctaNamePlaceholder,
        formEmailPlaceholder: formData.payload.ctaEmailPlaceholder,
        formMessagePlaceholder: formData.payload.ctaMessagePlaceholder,
        formSubmitLabel: formData.payload.ctaSubmitLabel,
        responseNote: formData.payload.ctaResponseNote,
      },
      seo: {
        metaTitle: formData.payload.seoMetaTitle,
        metaDescription: formData.payload.seoMetaDescription,
        metaKeywords: formData.payload.seoMetaKeywords,
        ogTitle: formData.payload.seoOgTitle,
        ogDescription: formData.payload.seoOgDescription,
        ogImageUrl: formData.payload.seoOgImageUrl,
      },
    },
    { title: formData.title.trim() }
  );

  return {
    id: itemId,
    title: formData.title.trim(),
    slug: formData.slug.trim(),
    excerpt: formData.excerpt.trim(),
    content: formData.content || "",
    cover_image_url: formData.cover_image_url.trim(),
    tags: parseTags(formData.tags),
    display_order: Number(formData.display_order || 0),
    published: Boolean(formData.published),
    featured: Boolean(formData.featured),
    payload: normalizedPayload,
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

export default function ServicesManagementPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [formData, setFormData] = useState(createEmptyForm());

  const sortedServices = useMemo(() => {
    return [...services].sort((left, right) => (left.display_order ?? 0) - (right.display_order ?? 0));
  }, [services]);

  async function fetchServices({ showSpinner = true } = {}) {
    try {
      if (showSpinner) {
        setLoading(true);
      }
      setError("");
      const response = await adminApi.getContent("services");
      setServices(response.items || []);
    } catch (requestError) {
      setError(requestError.message || "Failed to fetch services.");
    } finally {
      if (showSpinner) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialServices() {
      try {
        setError("");
        const response = await adminApi.getContent("services");
        if (cancelled) {
          return;
        }
        setServices(response.items || []);
      } catch (requestError) {
        if (cancelled) {
          return;
        }
        setError(requestError.message || "Failed to fetch services.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialServices();

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
      const result = await adminApi.uploadFile(file, "service_cover");
      updateFormData("cover_image_url", result?.url || "");
      setSuccess("Service cover image uploaded successfully.");
    } catch (requestError) {
      setError(requestError.message || "Failed to upload service cover image.");
    } finally {
      setCoverUploading(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!formData.title.trim()) {
      setError("Service title is required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const submitItem = buildSubmitItem(formData, editingItem?.id);
      await adminApi.saveContent("services", submitItem);
      setSuccess(editingItem ? "Service updated successfully!" : "Service created successfully!");
      setShowForm(false);
      resetForm();
      await fetchServices({ showSpinner: false });
    } catch (requestError) {
      setError(requestError.message || "Failed to save service.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const shouldDelete = window.confirm("Are you sure you want to delete this service?");
    if (!shouldDelete) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await adminApi.deleteContent("services", id);
      setSuccess("Service deleted successfully!");
      await fetchServices({ showSpinner: false });
    } catch (requestError) {
      setError(requestError.message || "Failed to delete service.");
    } finally {
      setLoading(false);
    }
  }

  if (loading && services.length === 0) {
    return <p className="text-sm text-muted-foreground">Loading services...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Content</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Services Management</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage list cards and detailed single-service page content from one structured form.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-4 py-2 text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
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
                    Service
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Slug
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Process Steps
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedServices.map((item) => {
                  const payload = normalizeServicePayload(item.payload || {}, { title: item.title || "" });
                  return (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gradient-accent flex items-center justify-center text-accent-foreground">
                            <Wrench className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{item.excerpt}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{item.slug || "-"}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{payload.overview.duration}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{payload.process.steps.length}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={item.slug ? `/services/${item.slug}` : "/services"}
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

          {sortedServices.length === 0 && !loading ? (
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No services found.</p>
              <button
                onClick={startCreate}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-4 py-2 text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Your First Service
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-background p-6 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{editingItem ? "Edit Service" : "Add Service"}</h2>
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
              <Field label="Service Title *">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(event) => updateFormData("title", event.target.value)}
                  className={INPUT_CLASSNAME}
                  placeholder="Web Development"
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
              <Field label="Card Icon">
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(event) => updateFormData("icon", event.target.value)}
                  className={INPUT_CLASSNAME}
                  placeholder="Code2, Sparkles, Layout..."
                />
              </Field>
              <Field label="Display Order">
                <input
                  type="number"
                  min="0"
                  value={formData.display_order}
                  onChange={(event) => updateFormData("display_order", event.target.value)}
                  className={INPUT_CLASSNAME}
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
                      placeholder="https://example.com/cover.jpg"
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
                        alt="Service cover preview"
                        className="w-full h-44 object-cover rounded-lg"
                      />
                    </div>
                  ) : null}
                </div>
              </Field>
              <Field label="Tags" hint="Comma or line separated">
                <textarea
                  rows={3}
                  value={formData.tags}
                  onChange={(event) => updateFormData("tags", event.target.value)}
                  className={TEXTAREA_CLASSNAME}
                />
              </Field>
            </div>
            <Field label="Service Excerpt *">
              <textarea
                rows={3}
                value={formData.excerpt}
                onChange={(event) => updateFormData("excerpt", event.target.value)}
                className={TEXTAREA_CLASSNAME}
                placeholder="Short description used in service listing cards."
                required
              />
            </Field>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center justify-between rounded-xl border border-border px-4 py-3 bg-card">
                <span className="text-sm">Published</span>
                <input
                  type="checkbox"
                  checked={Boolean(formData.published)}
                  onChange={(event) => updateFormData("published", event.target.checked)}
                  className="h-4 w-4 accent-[var(--color-accent)]"
                />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-border px-4 py-3 bg-card">
                <span className="text-sm">Featured</span>
                <input
                  type="checkbox"
                  checked={Boolean(formData.featured)}
                  onChange={(event) => updateFormData("featured", event.target.checked)}
                  className="h-4 w-4 accent-[var(--color-accent)]"
                />
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
                  placeholder="Custom page title for this service"
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
                  placeholder="https://example.com/og-service.jpg"
                />
              </Field>
              <Field label="Meta Keywords" hint="Comma or line separated">
                <textarea
                  rows={3}
                  value={formData.payload.seoMetaKeywords}
                  onChange={(event) => updateFormData("payload.seoMetaKeywords", event.target.value)}
                  className={TEXTAREA_CLASSNAME}
                  placeholder="web design, development, ui/ux"
                />
              </Field>
            </div>
            <Field label="Meta Description">
              <textarea
                rows={3}
                value={formData.payload.seoMetaDescription}
                onChange={(event) => updateFormData("payload.seoMetaDescription", event.target.value)}
                className={TEXTAREA_CLASSNAME}
                placeholder="Short SEO description for this service page."
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
              <Field label="Badge Text">
                <input
                  type="text"
                  value={formData.payload.heroBadgeText}
                  onChange={(event) => updateFormData("payload.heroBadgeText", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Subtitle">
                <input
                  type="text"
                  value={formData.payload.heroSubtitle}
                  onChange={(event) => updateFormData("payload.heroSubtitle", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Gradient Preset">
                <select
                  value={formData.payload.heroGradientIndex}
                  onChange={(event) => updateFormData("payload.heroGradientIndex", event.target.value)}
                  className={INPUT_CLASSNAME}
                >
                  {HERO_GRADIENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Award Label">
                <input
                  type="text"
                  value={formData.payload.heroAwardLabel}
                  onChange={(event) => updateFormData("payload.heroAwardLabel", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Primary CTA Label">
                <input
                  type="text"
                  value={formData.payload.heroPrimaryCtaLabel}
                  onChange={(event) => updateFormData("payload.heroPrimaryCtaLabel", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Primary CTA Href">
                <input
                  type="text"
                  value={formData.payload.heroPrimaryCtaHref}
                  onChange={(event) => updateFormData("payload.heroPrimaryCtaHref", event.target.value)}
                  className={INPUT_CLASSNAME}
                  placeholder="/contact"
                />
              </Field>
              <Field label="Secondary CTA Label">
                <input
                  type="text"
                  value={formData.payload.heroSecondaryCtaLabel}
                  onChange={(event) => updateFormData("payload.heroSecondaryCtaLabel", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Secondary CTA Href">
                <input
                  type="text"
                  value={formData.payload.heroSecondaryCtaHref}
                  onChange={(event) => updateFormData("payload.heroSecondaryCtaHref", event.target.value)}
                  className={INPUT_CLASSNAME}
                  placeholder="#pricing"
                />
              </Field>
            </div>
            <Field label="Hero Description">
              <textarea
                rows={4}
                value={formData.payload.heroDescription}
                onChange={(event) => updateFormData("payload.heroDescription", event.target.value)}
                className={TEXTAREA_CLASSNAME}
              />
            </Field>
            <Field label="Hero Categories" hint="One category per line">
              <textarea
                rows={4}
                value={formData.payload.heroCategories}
                onChange={(event) => updateFormData("payload.heroCategories", event.target.value)}
                className={TEXTAREA_CLASSNAME}
              />
            </Field>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Overview Card</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <Field label="Duration">
                <input
                  type="text"
                  value={formData.payload.overviewDuration}
                  onChange={(event) => updateFormData("payload.overviewDuration", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Team Size">
                <input
                  type="text"
                  value={formData.payload.overviewTeamSize}
                  onChange={(event) => updateFormData("payload.overviewTeamSize", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Support">
                <input
                  type="text"
                  value={formData.payload.overviewSupport}
                  onChange={(event) => updateFormData("payload.overviewSupport", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">About Section</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Section Title">
                <input
                  type="text"
                  value={formData.payload.aboutTitle}
                  onChange={(event) => updateFormData("payload.aboutTitle", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Overview Card Title">
                <input
                  type="text"
                  value={formData.payload.aboutOverviewTitle}
                  onChange={(event) => updateFormData("payload.aboutOverviewTitle", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
            </div>
            <Field label="Section Subtitle">
              <textarea
                rows={3}
                value={formData.payload.aboutSubtitle}
                onChange={(event) => updateFormData("payload.aboutSubtitle", event.target.value)}
                className={TEXTAREA_CLASSNAME}
              />
            </Field>
            <Field label="Overview Paragraphs" hint="Use blank lines between paragraphs">
              <textarea
                rows={8}
                value={formData.payload.aboutOverviewParagraphs}
                onChange={(event) => updateFormData("payload.aboutOverviewParagraphs", event.target.value)}
                className={TEXTAREA_CLASSNAME}
              />
            </Field>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Benefits and Approach</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Benefits Title">
                <input
                  type="text"
                  value={formData.payload.benefitsTitle}
                  onChange={(event) => updateFormData("payload.benefitsTitle", event.target.value)}
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
            </div>
            <Field label="Benefit Items" hint="One benefit per line">
              <textarea
                rows={6}
                value={formData.payload.benefitsItems}
                onChange={(event) => updateFormData("payload.benefitsItems", event.target.value)}
                className={TEXTAREA_CLASSNAME}
              />
            </Field>
            <Field label="Approach Steps" hint="One step per line: Title | Description">
              <textarea
                rows={7}
                value={formData.payload.approachSteps}
                onChange={(event) => updateFormData("payload.approachSteps", event.target.value)}
                className={cn(TEXTAREA_CLASSNAME, "font-mono")}
              />
            </Field>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Process</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Process Title">
                <input
                  type="text"
                  value={formData.payload.processTitle}
                  onChange={(event) => updateFormData("payload.processTitle", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
              <Field label="Process Description">
                <input
                  type="text"
                  value={formData.payload.processDescription}
                  onChange={(event) => updateFormData("payload.processDescription", event.target.value)}
                  className={INPUT_CLASSNAME}
                />
              </Field>
            </div>
            <Field label="Process Steps" hint="One step per line: 01 | Title | Description">
              <textarea
                rows={8}
                value={formData.payload.processSteps}
                onChange={(event) => updateFormData("payload.processSteps", event.target.value)}
                className={cn(TEXTAREA_CLASSNAME, "font-mono")}
              />
            </Field>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Optional Legacy Content</h3>
            <Field label="Rich Content (Not currently rendered on service page)">
              <textarea
                rows={6}
                value={formData.content}
                onChange={(event) => updateFormData("content", event.target.value)}
                className={TEXTAREA_CLASSNAME}
              />
            </Field>
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
              {loading ? "Saving..." : editingItem ? "Update Service" : "Create Service"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
