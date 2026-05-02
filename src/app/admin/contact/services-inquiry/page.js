"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Trash2,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { adminApi } from "@/lib/cms/admin-client";

const statusColors = {
  new: "bg-green-100 text-green-800 border-green-200",
  read: "bg-blue-100 text-blue-800 border-blue-200",
  replied: "bg-purple-100 text-purple-800 border-purple-200",
  archived: "bg-gray-100 text-gray-800 border-gray-200",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800 border-gray-200",
  normal: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  urgent: "bg-red-100 text-red-800 border-red-200",
};

export default function AdminServiceInquiriesPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  async function fetchSubmissions() {
    try {
      setLoading(true);
      const response = await adminApi.getServiceInquiries({
        page: currentPage,
        limit: 10,
        search,
        status,
        priority,
        sortBy,
        sortOrder,
      });

      setSubmissions(response.submissions || []);
      setPagination(response.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
    } catch (requestError) {
      setError(requestError.message || "Failed to fetch service inquiries.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchSubmissions();
  }, [currentPage, search, status, priority, sortBy, sortOrder]);

  function handleSort(field) {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  }

  async function handleUpdate(id, updates) {
    try {
      await adminApi.updateServiceInquiry(id, updates);
      setSuccess("Inquiry updated successfully.");
      await fetchSubmissions();
    } catch (requestError) {
      setError(requestError.message || "Failed to update inquiry.");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this service inquiry?")) {
      return;
    }

    try {
      await adminApi.deleteServiceInquiry(id);
      setSuccess("Service inquiry deleted successfully.");
      await fetchSubmissions();
    } catch (requestError) {
      setError(requestError.message || "Failed to delete service inquiry.");
    }
  }

  function viewSubmission(submission) {
    setSelectedSubmission(submission);
    setShowViewModal(true);

    if (submission.status === "new") {
      void handleUpdate(submission.id, { status: "read" });
    }
  }

  function clearFilters() {
    setSearch("");
    setStatus("");
    setPriority("");
    setCurrentPage(1);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
  }

  function SortIcon({ field }) {
    if (sortBy !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  }

  if (loading && submissions.length === 0) {
    return <p className="text-sm text-muted-foreground">Loading service inquiries...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Contact</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Services Inquiry</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage inquiries submitted from service detail pages.
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

      <div className="rounded-2xl border border-border bg-background p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, service, or message..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-card text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary/60 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
        </div>

        {showFilters ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Status</label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full mt-1 rounded-lg border border-input bg-card px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Priority</label>
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                className="w-full mt-1 rounded-lg border border-input bg-card px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary/60 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {submissions.length} of {pagination.total} inquiries
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("created_at")}
                    className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  >
                    Date
                    <SortIcon field="created_at" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("name")}
                    className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  >
                    Name
                    <SortIcon field="name" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-left">Service</th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("status")}
                    className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  >
                    Status
                    <SortIcon field="status" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("priority")}
                    className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  >
                    Priority
                    <SortIcon field="priority" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(submission.created_at)}</td>
                  <td className="px-4 py-3 text-sm font-medium">{submission.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    <div>{submission.email}</div>
                    {submission.phone ? <div className="text-xs mt-0.5">{submission.phone}</div> : null}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium">{submission.service_title || submission.service_slug}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{submission.service_slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={submission.status}
                      onChange={(event) => handleUpdate(submission.id, { status: event.target.value })}
                      className={`text-xs px-2 py-1 rounded-full border font-medium ${statusColors[submission.status]}`}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={submission.priority}
                      onChange={(event) => handleUpdate(submission.id, { priority: event.target.value })}
                      className={`text-xs px-2 py-1 rounded-full border font-medium ${priorityColors[submission.priority]}`}
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => viewSubmission(submission)}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs hover:bg-secondary/60 transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(submission.id)}
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

        {submissions.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No service inquiries found.</p>
          </div>
        ) : null}
      </div>

      {pagination.totalPages > 1 ? (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
              disabled={pagination.page === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((previous) => Math.min(pagination.totalPages, previous + 1))}
              disabled={pagination.page === pagination.totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      {showViewModal && selectedSubmission ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowViewModal(false)} />
          <div className="relative bg-background border border-border rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-4 right-4 rounded-lg border border-border p-2 hover:bg-secondary/60 transition-colors"
            >
              x
            </button>

            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Service Inquiry Details</h2>
                <p className="text-sm text-muted-foreground">
                  Submitted on {formatDate(selectedSubmission.created_at)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
                  <p className="font-medium">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                  <p className="font-medium">{selectedSubmission.email}</p>
                </div>
                {selectedSubmission.phone ? (
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Phone</label>
                    <p className="font-medium">{selectedSubmission.phone}</p>
                  </div>
                ) : null}
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Service</label>
                  <p className="font-medium">{selectedSubmission.service_title || selectedSubmission.service_slug}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Status</label>
                  <p>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full border font-medium ${statusColors[selectedSubmission.status]}`}>
                      {selectedSubmission.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Priority</label>
                  <p>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full border font-medium ${priorityColors[selectedSubmission.priority]}`}>
                      {selectedSubmission.priority}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
                <div className="mt-1 p-4 bg-muted/30 rounded-lg border border-border">
                  <p className="whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>
              </div>

              {selectedSubmission.ip_address ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <label className="uppercase tracking-widest">IP Address</label>
                    <p>{selectedSubmission.ip_address}</p>
                  </div>
                  <div>
                    <label className="uppercase tracking-widest">Referrer</label>
                    <p>{selectedSubmission.referrer === "unknown" ? "Direct" : selectedSubmission.referrer}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

