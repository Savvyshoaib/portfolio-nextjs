"use client";

import { useState } from "react";

export function Toggle({ label, checked, onChange, disabled = false }) {
  const [isChecked, setIsChecked] = useState(checked || false);

  const handleToggle = () => {
    if (disabled) return;
    
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={handleToggle}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          focus:outline-none focus:ring-2 focus:ring-accent/30
          ${isChecked ? "bg-accent" : "bg-muted"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-background transition-transform
            ${isChecked ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
      {label && (
        <label className="text-sm font-medium cursor-pointer" onClick={handleToggle}>
          {label}
        </label>
      )}
    </div>
  );
}
