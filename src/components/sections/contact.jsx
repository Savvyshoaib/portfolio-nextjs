"use client";

import { useState, useEffect } from "react";
import { Reveal } from "../reveal";
import { CheckCircle2, Mail, MapPin, Send, Loader2 } from "lucide-react";

const defaultContent = {
  eyebrow: "Contact",
  title: "Let us make something unforgettable.",
  titleEmphasis: "unforgettable",
  description:
    "Drop a line about your project, timeline, and ambitions. We will reply within 24 hours.",
  email: "hello@nova.studio",
  studio: "Lisbon - Remote worldwide",
};

function renderTitle(title, emphasis) {
  if (!title || !emphasis || !title.includes(emphasis)) {
    return title;
  }

  const [before, ...rest] = title.split(emphasis);
  return (
    <>
      {before}
      <em className="font-light">{emphasis}</em>
      {rest.join(emphasis)}
    </>
  );
}

export function ContactSection({ compact = false, content = defaultContent }) {
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
  const resolved = { ...defaultContent, ...(content || {}) };

  // Auto-hide success message after 10 seconds and reset form
  useEffect(() => {
    if (sent) {
      const timer = setTimeout(() => {
        setSent(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setErrors({});
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [sent]);

  // Simple validation functions
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (value.trim().length < 2) error = "Name must be at least 2 characters";
        else if (value.trim().length > 100) error = "Name must be less than 100 characters";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) error = "Please enter a valid email address";
        break;
      case "subject":
        if (!value.trim()) error = "Subject is required";
        else if (value.trim().length < 3) error = "Subject must be at least 3 characters";
        else if (value.trim().length > 200) error = "Subject must be less than 200 characters";
        break;
      case "message":
        if (!value.trim()) error = "Message is required";
        else if (value.trim().length < 10) error = "Message must be at least 10 characters";
        else if (value.trim().length > 1000) error = "Message must be less than 1000 characters";
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // Validate field in real-time (with debounce)
    setTimeout(() => {
      validateField(name, value);
    }, 500);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    
    // Validate all fields with simple validation
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";
    else if (formData.name.trim().length > 100) newErrors.name = "Name must be less than 100 characters";
    
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = "Please enter a valid email address";
    
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    else if (formData.subject.trim().length < 3) newErrors.subject = "Subject must be at least 3 characters";
    else if (formData.subject.trim().length > 200) newErrors.subject = "Subject must be less than 200 characters";
    
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";
    else if (formData.message.trim().length > 1000) newErrors.message = "Message must be less than 1000 characters";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  return (
    <section className={compact ? "py-16" : "py-24 sm:py-32"} suppressHydrationWarning>
      <div className="mx-auto max-w-7xl px-4 sm:px-6" suppressHydrationWarning>
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">{resolved.eyebrow}</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
              {renderTitle(resolved.title, resolved.titleEmphasis)}
            </h2>
            <p className="mt-5 text-muted-foreground max-w-md">{resolved.description}</p>

            <ul className="mt-10 space-y-5">
              <li className="flex items-center gap-4">
                <span className="h-11 w-11 inline-flex items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Email</div>
                  <a href={`mailto:${resolved.email}`} className="font-medium hover:text-accent transition-colors">
                    {resolved.email}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <span className="h-11 w-11 inline-flex items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Studio</div>
                  <div className="font-medium">{resolved.studio}</div>
                </div>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            {sent ? (
              <div className="rounded-3xl border border-border bg-gradient-to-br from-accent/5 to-accent/10 p-8 sm:p-12 text-center shadow-elegant">
                <div className="mx-auto w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Message Sent Successfully!</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Thank you for reaching out! We've received your message and will get back to you within 24 hours.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                  This form will reset automatically in 10 seconds...
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-7 sm:p-8 shadow-elegant">
                {errors.form && (
                  <div className="mb-5 rounded-xl bg-destructive/10 text-destructive px-4 py-3 text-sm">
                    {errors.form}
                  </div>
                )}
                <div className="space-y-5">
                  <Field 
                    label="Name" 
                    name="name" 
                    placeholder="Your full name" 
                    error={errors.name}
                    value={formData.name}
                    onChange={(value) => handleInputChange("name", value)}
                  />
                  <Field 
                    label="Email" 
                    name="email" 
                    type="email" 
                    placeholder="you@company.com" 
                    error={errors.email}
                    value={formData.email}
                    onChange={(value) => handleInputChange("email", value)}
                  />
                  <Field 
                    label="Phone" 
                    name="phone" 
                    type="tel" 
                    placeholder="Your phone number (optional)" 
                    error={errors.phone}
                    value={formData.phone}
                    onChange={(value) => handleInputChange("phone", value)}
                  />
                  <Field 
                    label="Subject" 
                    name="subject" 
                    placeholder="What is this about?" 
                    error={errors.subject}
                    value={formData.subject}
                    onChange={(value) => handleInputChange("subject", value)}
                  />
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
                      className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all resize-none"
                    />
                    {errors.message && <p className="mt-1.5 text-xs text-destructive">{errors.message}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group inline-flex items-center justify-center gap-2 w-full rounded-xl bg-foreground text-background px-6 py-3.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
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
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

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
        className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all resize-none ${
          error 
            ? 'border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive/30' 
            : 'border-input bg-background focus:border-accent focus:ring-accent/30'
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-destructive animate-fadeIn">{error}</p>}
    </div>
  );
}

