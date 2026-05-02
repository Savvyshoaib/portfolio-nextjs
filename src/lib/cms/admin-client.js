"use client";

async function parseJson(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { error: "Invalid JSON response." };
  }
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const payload = await parseJson(response);
  if (!response.ok) {
    const errorMessage = payload?.error || payload?.message || `Request failed (${response.status})`;
    throw new Error(errorMessage);
  }

  return payload;
}

export const adminApi = {
  getSession() {
    return request("/api/admin/auth/session");
  },
  login(credentials) {
    return request("/api/admin/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
  register(payload) {
    return request("/api/admin/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  logout() {
    return request("/api/admin/auth/logout", { method: "POST" });
  },
  getDashboard() {
    return request("/api/admin/dashboard");
  },
  getSettings() {
    return request("/api/admin/settings");
  },
  saveSettings(settings) {
    return request("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify({ settings }),
    });
  },
  getSections() {
    return request("/api/admin/sections");
  },
  saveSection(key, value) {
    return request("/api/admin/sections", {
      method: "PUT",
      body: JSON.stringify({ key, value }),
    });
  },
  getContent(type) {
    return request(`/api/admin/content/${type}`);
  },
  saveContent(type, item) {
    return request(`/api/admin/content/${type}`, {
      method: item?.id ? "PUT" : "POST",
      body: JSON.stringify({ item }),
    });
  },
  deleteContent(type, id) {
    return request(`/api/admin/content/${type}?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
  getProfile() {
    return request("/api/admin/profile");
  },
  saveProfile(payload) {
    return request("/api/admin/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  async uploadFile(file, type) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const payload = await parseJson(response);
    if (!response.ok) {
      const errorMessage = payload?.error || payload?.message || `Upload failed (${response.status})`;
      throw new Error(errorMessage);
    }

    return payload;
  },
  getContactSubmissions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return request(`/api/admin/contact${queryString ? `?${queryString}` : ''}`);
  },
  updateContactSubmission(id, data) {
    return request("/api/admin/contact", {
      method: "PUT",
      body: JSON.stringify({ id, ...data }),
    });
  },
  deleteContactSubmission(id) {
    return request(`/api/admin/contact?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
  getServiceInquiries(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return request(`/api/admin/contact/services-inquiry${queryString ? `?${queryString}` : ""}`);
  },
  updateServiceInquiry(id, data) {
    return request("/api/admin/contact/services-inquiry", {
      method: "PUT",
      body: JSON.stringify({ id, ...data }),
    });
  },
  deleteServiceInquiry(id) {
    return request(`/api/admin/contact/services-inquiry?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
  createContentItem(type, data) {
    return request("/api/admin/content", {
      method: "POST",
      body: JSON.stringify({ type, ...data }),
    });
  },
  updateContentItem(type, id, data) {
    return request("/api/admin/content", {
      method: "PUT",
      body: JSON.stringify({ type, id, ...data }),
    });
  },
  deleteContentItem(type, id) {
    return request(`/api/admin/content?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};

