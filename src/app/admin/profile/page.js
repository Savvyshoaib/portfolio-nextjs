"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { adminApi } from "@/lib/cms/admin-client";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const response = await adminApi.getProfile();
        setProfile({
          fullName: response.profile.fullName || "",
          phone: response.profile.phone || "",
          email: response.profile.email || "",
          role: response.profile.role || "admin",
          password: "",
        });
      } catch (requestError) {
        setError(requestError.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const onSave = async (event) => {
    event.preventDefault();
    if (!profile) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await adminApi.saveProfile({
        fullName: profile.fullName,
        phone: profile.phone,
        password: profile.password,
      });
      setProfile((prev) => ({ ...prev, password: "" }));
      setSuccess("Profile updated.");
    } catch (saveError) {
      setError(saveError.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="text-sm text-destructive">{error || "Unable to load profile."}</p>;
  }

  return (
    <form className="space-y-8" onSubmit={onSave}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Profile</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Admin Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">Update your account details and credentials.</p>
      </div>

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
      ) : null}
      {success ? (
        <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">{success}</p>
      ) : null}

      <section className="rounded-2xl border border-border bg-background p-5 space-y-4">
        <Field label="Email" value={profile.email} readOnly />
        <Field label="Role" value={profile.role} readOnly />
        <Field
          label="Full Name"
          value={profile.fullName}
          onChange={(value) => setProfile((prev) => ({ ...prev, fullName: value }))}
        />
        <Field
          label="Phone"
          value={profile.phone}
          onChange={(value) => setProfile((prev) => ({ ...prev, phone: value }))}
        />
        <Field
          label="New Password"
          type="password"
          placeholder="Leave blank to keep current password"
          value={profile.password}
          onChange={(value) => setProfile((prev) => ({ ...prev, password: value }))}
        />
      </section>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}

function Field({ label, value, onChange, readOnly = false, type = "text", placeholder = "" }) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value || ""}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all read-only:opacity-70 read-only:cursor-not-allowed"
      />
    </div>
  );
}

