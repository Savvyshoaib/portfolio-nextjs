"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { adminApi } from "@/lib/cms/admin-client";
import { useToast } from "@/components/ui/toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { success, error: showError } = useToast();

  const onSubmit = async (event) => {
    event.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      await adminApi.login({ email, password });
      success("Login successful! Redirecting to admin dashboard...");
      
      const nextPath =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("next") || "/admin"
          : "/admin";
      
      // Small delay to show the success message
      setTimeout(() => {
        router.replace(nextPath);
        router.refresh();
      }, 1000);
    } catch (submitError) {
      const errorMessage = submitError.message || "Unable to sign in. Please check your credentials.";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-elegant">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Admin Login</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to manage website content and SEO settings.</p>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
              placeholder="admin@yourdomain.com"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 pr-12 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                tabIndex="-1"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error ? (
            <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-foreground text-background px-4 py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground">
          Need an account?{" "}
          <Link href="/admin/register" className="text-accent hover:underline">
            Create admin user
          </Link>
        </p>
      </div>
    </div>
  );
}
