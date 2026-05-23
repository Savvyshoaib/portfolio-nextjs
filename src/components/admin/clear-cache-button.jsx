"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { adminApi } from "@/lib/cms/admin-client";
import { cn } from "@/lib/utils";

export function ClearCacheButton({ className, variant = "outline" }) {
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onClear = async () => {
    setClearing(true);
    setMessage("");
    setError("");

    try {
      const result = await adminApi.clearSiteCache();
      setMessage(result.message || "Site cache cleared.");
    } catch (requestError) {
      setError(requestError.message || "Failed to clear cache.");
    } finally {
      setClearing(false);
    }
  };

  const isOutline = variant === "outline";

  return (
    <div className={cn("space-y-2", className)}>
      <button
        type="button"
        onClick={onClear}
        disabled={clearing}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-opacity disabled:opacity-60",
          isOutline
            ? "border border-border bg-card hover:bg-secondary/60"
            : "bg-foreground text-background hover:opacity-90"
        )}
      >
        <RefreshCw className={cn("h-4 w-4", clearing && "animate-spin")} />
        {clearing ? "Clearing cache..." : "Clear site cache"}
      </button>
      {message ? <p className="text-xs text-accent">{message}</p> : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

