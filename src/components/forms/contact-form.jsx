"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

function Field({ label, name, type = "text", placeholder, error, value, onChange }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        maxLength={255}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
          error
            ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive/30"
            : "border-input bg-background focus:border-neon focus:ring-neon/30"
        }`}
      />
      {error ? <p className="mt-1.5 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export function ContactForm() {
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (!sent) return undefined;

    const timer = setTimeout(() => {
      setSent(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setErrors({});
    }, 10000);

    return () => clearTimeout(timer);
  }, [sent]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = "Please enter a valid email";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }
      setSent(true);
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-3xl glass p-8 sm:p-12 text-center border border-neon/30">
        <div className="mx-auto w-16 h-16 bg-neon rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
        </div>
        <h3 className="text-2xl font-bold mb-3">Message Sent Successfully!</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Thank you for reaching out! We&apos;ve received your message and will get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      {errors.form ? (
        <div className="mb-5 rounded-xl bg-destructive/10 text-destructive px-4 py-3 text-sm">{errors.form}</div>
      ) : null}
      <div className="space-y-5">
        <Field label="Name" name="name" placeholder="Your full name" error={errors.name} value={formData.name} onChange={(v) => handleInputChange("name", v)} />
        <Field label="Email" name="email" type="email" placeholder="you@company.com" error={errors.email} value={formData.email} onChange={(v) => handleInputChange("email", v)} />
        <Field label="Phone" name="phone" type="tel" placeholder="Your phone number (optional)" error={errors.phone} value={formData.phone} onChange={(v) => handleInputChange("phone", v)} />
        <Field label="Subject" name="subject" placeholder="What is this about?" error={errors.subject} value={formData.subject} onChange={(v) => handleInputChange("subject", v)} />
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            maxLength={1000}
            placeholder="Tell us about your project..."
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/30 transition-all resize-none"
          />
          {errors.message ? <p className="mt-1.5 text-xs text-destructive">{errors.message}</p> : null}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="group inline-flex items-center justify-center gap-2 w-full rounded-full bg-neon text-primary-foreground px-6 py-3.5 text-sm font-medium hover:glow-neon transition-all disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send message
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
