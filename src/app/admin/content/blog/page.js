"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, Calendar, Clock, User, Upload, Loader2 } from "lucide-react";
import { adminApi } from "@/lib/cms/admin-client";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { keywordsToCsv, normalizeItemSeo } from "@/lib/cms/item-seo";

function normalizeDateInput(value) {
  const input = String(value || "").trim();
  if (!input) {
    return "";
  }

  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString().slice(0, 10);
}

function createEmptyBlogForm() {
  return {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image_url: "",
    tags: "",
    payload: {
      author: "",
      readingTime: "",
      publishedAt: new Date().toISOString().split("T")[0],
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      ogTitle: "",
      ogDescription: "",
      ogImageUrl: "",
    },
  };
}

export default function BlogManagementPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [coverUploading, setCoverUploading] = useState(false);

  const [formData, setFormData] = useState(createEmptyBlogForm());

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getContent("blog");
      setBlogPosts(response.items || []);
    } catch (err) {
      setError(err.message || "Failed to fetch blog posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function loadInitialBlogPosts() {
      try {
        setError("");
        const response = await adminApi.getContent("blog");
        if (cancelled) {
          return;
        }
        setBlogPosts(response.items || []);
      } catch (requestError) {
        if (cancelled) {
          return;
        }
        setError(requestError.message || "Failed to fetch blog posts.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialBlogPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  const resetForm = () => {
    setFormData(createEmptyBlogForm());
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    const seo = normalizeItemSeo(item.payload?.seo, {
      metaTitle: item.title || "",
      metaDescription: item.excerpt || "",
    });

    setEditingItem(item);
    setFormData({
      title: item.title || "",
      slug: item.slug || "",
      excerpt: item.excerpt || "",
      content: item.content || "",
      cover_image_url: item.cover_image_url || "",
      tags: (item.tags || []).join(", "),
      payload: {
        author: item.payload?.author || "",
        readingTime: item.payload?.readingTime || "",
        publishedAt: normalizeDateInput(item.payload?.publishedAt || item.payload?.date) || new Date().toISOString().split("T")[0],
        metaTitle: seo.metaTitle,
        metaDescription: seo.metaDescription,
        metaKeywords: keywordsToCsv(seo.metaKeywords),
        ogTitle: seo.ogTitle,
        ogDescription: seo.ogDescription,
        ogImageUrl: seo.ogImageUrl,
      }
    });
    setShowForm(true);
  };

  const handleCoverImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setCoverUploading(true);
    setError("");

    try {
      const result = await adminApi.uploadFile(file, "blog_cover");
      updateFormData("cover_image_url", result?.url || "");
      setSuccess("Blog cover image uploaded successfully.");
    } catch (requestError) {
      setError(requestError.message || "Failed to upload blog cover image.");
    } finally {
      setCoverUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = {
        ...formData,
        id: editingItem?.id || undefined,
        slug: formData.slug.trim() || editingItem?.slug || "",
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        payload: {
          author: formData.payload.author,
          readingTime: formData.payload.readingTime,
          publishedAt: normalizeDateInput(formData.payload.publishedAt),
          seo: {
            metaTitle: formData.payload.metaTitle,
            metaDescription: formData.payload.metaDescription,
            metaKeywords: formData.payload.metaKeywords,
            ogTitle: formData.payload.ogTitle,
            ogDescription: formData.payload.ogDescription,
            ogImageUrl: formData.payload.ogImageUrl,
          },
        },
      };

      await adminApi.saveContent("blog", submitData);
      setSuccess(editingItem ? "Blog post updated successfully!" : "Blog post created successfully!");

      setShowForm(false);
      resetForm();
      await fetchBlogPosts();
    } catch (err) {
      setError(err.message || "Failed to save blog post.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    
    try {
      await adminApi.deleteContent("blog", id);
      setSuccess("Blog post deleted successfully!");
      await fetchBlogPosts();
    } catch (err) {
      setError(err.message || "Failed to delete blog post.");
    }
  };

  const updateFormData = (path, value) => {
    if (path.includes("payload.")) {
      const key = path.replace("payload.", "");
      setFormData(prev => ({
        ...prev,
        payload: {
          ...prev.payload,
          [key]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [path]: value
      }));
    }
  };

  if (loading && blogPosts.length === 0) {
    return <p className="text-sm text-muted-foreground">Loading blog posts...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Content</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Blog Management</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your blog posts and share your thoughts with the world.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-4 py-2 text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Blog Post
        </button>
      </div>

      {error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
      )}
      {success && (
        <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">{success}</p>
      )}

      {/* Blog Posts List */}
      {!showForm && (
        <div className="rounded-2xl border border-border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Author
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Published
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Reading Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Tags
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {blogPosts.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.cover_image_url && (
                          <img
                            src={item.cover_image_url}
                            alt={item.title}
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {item.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {item.payload?.author || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {item.payload?.publishedAt ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.payload.publishedAt).toLocaleDateString()}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {item.payload?.readingTime ? (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.payload.readingTime} min
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(item.tags || []).slice(0, 2).map((tag, index) => (
                          <span key={index} className="inline-flex items-center rounded-full bg-accent/10 text-accent px-2 py-1 text-xs">
                            {tag}
                          </span>
                        ))}
                        {(item.tags || []).length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{(item.tags || []).length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={item.slug ? `/blog/${item.slug}` : "/blog"}
                          target="_blank"
                          className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs hover:bg-secondary/60 transition-colors"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </a>
                        <button
                          onClick={() => handleEdit(item)}
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
                ))}
              </tbody>
            </table>
          </div>

          {blogPosts.length === 0 && !loading && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No blog posts found.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-4 py-2 text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Write Your First Blog Post
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-background p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {editingItem ? "Edit Blog Post" : "Add Blog Post"}
            </h2>
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

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                placeholder="Your blog post title"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => updateFormData("slug", e.target.value)}
                className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                placeholder="auto-generated-if-empty"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Author</label>
              <input
                type="text"
                value={formData.payload.author}
                onChange={(e) => updateFormData("payload.author", e.target.value)}
                className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Published Date</label>
              <input
                type="date"
                value={formData.payload.publishedAt}
                onChange={(e) => updateFormData("payload.publishedAt", e.target.value)}
                className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Reading Time (minutes)</label>
              <input
                type="number"
                value={formData.payload.readingTime}
                onChange={(e) => updateFormData("payload.readingTime", e.target.value)}
                className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                placeholder="5"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Cover Image URL</label>
            <div className="mt-2 space-y-3">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.cover_image_url}
                  onChange={(e) => updateFormData("cover_image_url", e.target.value)}
                  className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
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
                    alt="Blog cover preview"
                    className="w-full h-44 object-cover rounded-lg"
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Excerpt *</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => updateFormData("excerpt", e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all resize-none"
              placeholder="Brief summary of your blog post"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">SEO</label>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Meta Title</label>
                <input
                  type="text"
                  value={formData.payload.metaTitle}
                  onChange={(e) => updateFormData("payload.metaTitle", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                  placeholder="Custom page title for this post"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Open Graph Title</label>
                <input
                  type="text"
                  value={formData.payload.ogTitle}
                  onChange={(e) => updateFormData("payload.ogTitle", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                  placeholder="Optional social title override"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Open Graph Image URL</label>
                <input
                  type="url"
                  value={formData.payload.ogImageUrl}
                  onChange={(e) => updateFormData("payload.ogImageUrl", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                  placeholder="https://example.com/og-blog.jpg"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Meta Keywords</label>
                <textarea
                  value={formData.payload.metaKeywords}
                  onChange={(e) => updateFormData("payload.metaKeywords", e.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all resize-none"
                  placeholder="nextjs, react, cms"
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Meta Description</label>
              <textarea
                value={formData.payload.metaDescription}
                onChange={(e) => updateFormData("payload.metaDescription", e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all resize-none"
                placeholder="Short SEO description for this blog detail page."
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Open Graph Description</label>
              <textarea
                value={formData.payload.ogDescription}
                onChange={(e) => updateFormData("payload.ogDescription", e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all resize-none"
                placeholder="Optional social description override."
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Content</label>
            <div className="mt-2">
              <RichTextEditor
                value={formData.content}
                onChange={(value) => updateFormData("content", value)}
                placeholder="Write your blog post content here..."
                height="400px"
                showPreview={true}
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => updateFormData("tags", e.target.value)}
              className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
              placeholder="web development, react, tutorial (comma separated)"
            />
          </div>

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
              {loading ? "Saving..." : (editingItem ? "Update Post" : "Publish Post")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
