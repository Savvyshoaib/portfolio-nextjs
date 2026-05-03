"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, ImageIcon, Loader2, RefreshCw, Search, Trash2 } from "lucide-react";
import { adminApi } from "@/lib/cms/admin-client";

function formatBytes(bytes) {
  const size = Number(bytes || 0);
  if (size <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  const value = size / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function formatDate(value) {
  if (!value) {
    return "Unknown";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Unknown";
  }

  return parsed.toLocaleString();
}

function getFolderLabel(path) {
  const normalized = String(path || "").trim();
  const lastSlash = normalized.lastIndexOf("/");
  if (lastSlash === -1) {
    return "root";
  }

  return normalized.slice(0, lastSlash) || "root";
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingPath, setDeletingPath] = useState("");
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchFiles({ showLoader = false } = {}) {
    try {
      if (showLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      const response = await adminApi.getMediaFiles();
      setFiles(Array.isArray(response?.files) ? response.files : []);
    } catch (requestError) {
      setError(requestError.message || "Failed to load media files.");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchFiles();
  }, []);

  const folderOptions = useMemo(() => {
    const folders = new Set();
    for (const file of files) {
      folders.add(getFolderLabel(file.path));
    }

    return ["all", ...Array.from(folders).sort((left, right) => left.localeCompare(right))];
  }, [files]);

  const filteredFiles = useMemo(() => {
    const term = search.trim().toLowerCase();
    return files.filter((file) => {
      const matchesFolder = folder === "all" ? true : getFolderLabel(file.path) === folder;
      if (!matchesFolder) {
        return false;
      }

      if (!term) {
        return true;
      }

      return (
        String(file.name || "").toLowerCase().includes(term) ||
        String(file.path || "").toLowerCase().includes(term) ||
        String(file.contentType || "").toLowerCase().includes(term)
      );
    });
  }, [files, folder, search]);

  async function handleDelete(file) {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete this image?\n\n${file.path}\n\nThis will permanently delete it from Supabase storage.`
    );
    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingPath(file.path);
      setError("");
      setSuccess("");
      await adminApi.deleteMediaFile(file.path);
      setFiles((previous) => previous.filter((entry) => entry.path !== file.path));
      setSuccess("Image deleted from Supabase storage.");
    } catch (requestError) {
      setError(requestError.message || "Failed to delete image.");
    } finally {
      setDeletingPath("");
    }
  }

  if (loading && files.length === 0) {
    return <p className="text-sm text-muted-foreground">Loading media library...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Media</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Media Library</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            View and manage uploaded images from Supabase storage.
          </p>
        </div>
        <button
          onClick={() => fetchFiles({ showLoader: true })}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary/60 transition-colors disabled:opacity-60"
        >
          {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </button>
      </div>

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
      ) : null}

      {success ? (
        <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">{success}</p>
      ) : null}

      <div className="rounded-2xl border border-border bg-background p-5 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by file name, path, or type..."
              className="w-full rounded-lg border border-input bg-card pl-10 pr-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
            />
          </label>

          <label className="w-full lg:w-72">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Folder</span>
            <select
              value={folder}
              onChange={(event) => setFolder(event.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
            >
              {folderOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All folders" : option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="text-sm text-muted-foreground">
          Showing {filteredFiles.length} of {files.length} image files
        </p>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background p-10 text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <ImageIcon className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {files.length === 0 ? "No uploaded images found in Supabase storage." : "No images match your current filters."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredFiles.map((file) => {
            const isDeleting = deletingPath === file.path;
            return (
              <article key={file.path} className="rounded-2xl border border-border bg-background overflow-hidden">
                <div className="aspect-[4/3] bg-muted/30">
                  <img src={file.url} alt={file.name || "Media file"} className="h-full w-full object-cover" loading="lazy" />
                </div>

                <div className="space-y-3 p-4">
                  <div>
                    <p className="font-medium truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground break-all">{file.path}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <p>Size: {formatBytes(file.size)}</p>
                    <p>Type: {file.contentType || "unknown"}</p>
                    <p className="col-span-2">Uploaded: {formatDate(file.createdAt)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-secondary/60 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(file)}
                      disabled={isDeleting}
                      className="inline-flex items-center gap-1 rounded-lg border border-destructive/30 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-60"
                    >
                      {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
