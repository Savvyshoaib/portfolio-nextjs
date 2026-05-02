"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

function getDefaultServiceSlug(services, requestedSlug) {
  const available = Array.isArray(services) ? services : [];
  if (requestedSlug && available.some((service) => service.slug === requestedSlug)) {
    return requestedSlug;
  }

  return available[0]?.slug || "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ServiceInquiryForm({
  services = [],
  defaultServiceSlug = "",
  currentServiceTitle = "",
}) {
  const serviceOptions = useMemo(() => {
    if (!Array.isArray(services)) {
      return [];
    }

    return services
      .map((service) => ({
        slug: String(service?.slug || "").trim(),
        title: String(service?.title || "").trim(),
      }))
      .filter((service) => service.slug && service.title);
  }, [services]);

  const resolvedDefaultServiceSlug = useMemo(
    () => getDefaultServiceSlug(serviceOptions, defaultServiceSlug),
    [serviceOptions, defaultServiceSlug]
  );

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    serviceSlug: resolvedDefaultServiceSlug,
    message: "",
  });

  useEffect(() => {
    setFormData((previous) => ({
      ...previous,
      serviceSlug: getDefaultServiceSlug(serviceOptions, previous.serviceSlug || resolvedDefaultServiceSlug),
    }));
  }, [serviceOptions, resolvedDefaultServiceSlug]);

  const selectedService = useMemo(() => {
    return serviceOptions.find((service) => service.slug === formData.serviceSlug) || null;
  }, [serviceOptions, formData.serviceSlug]);

  const sectionTitle = currentServiceTitle
    ? `Start your ${currentServiceTitle.toLowerCase()} project`
    : "Start your project";

  async function onSubmit(event) {
    event.preventDefault();

    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const phoneNumber = formData.phoneNumber.trim();
    const message = formData.message.trim();
    const serviceSlug = formData.serviceSlug;

    if (!fullName || fullName.length < 2) {
      setError("Full name is required (at least 2 characters).");
      return;
    }

    if (!email || !isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!serviceSlug || !selectedService) {
      setError("Please select a valid service.");
      return;
    }

    if (!message || message.length < 10) {
      setError("Message is required (at least 10 characters).");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/service-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          phone: phoneNumber,
          serviceSlug,
          serviceTitle: selectedService.title,
          message,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to submit service inquiry.");
      }

      setSent(true);
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        serviceSlug: resolvedDefaultServiceSlug,
        message: "",
      });
    } catch (requestError) {
      setError(requestError.message || "Failed to submit service inquiry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-24 bg-linear-to-br from-accent via-accent/80 to-accent/60">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-accent-foreground mb-6">{sectionTitle}</h2>
            <p className="text-xl text-accent-foreground/90 mb-8 leading-relaxed">
              Share your goals and timeline. We will review your request and get back to you quickly with the next steps.
            </p>
            <div className="space-y-4">
              {[
                "Personalized response for your service needs",
                "Clear timeline and execution plan",
                "No obligation consultation",
              ].map((bullet) => (
                <div key={bullet} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent-foreground" />
                  <span className="text-accent-foreground">{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-background/10 backdrop-blur-sm rounded-3xl p-8 border border-accent-foreground/20">
            <h3 className="text-2xl font-bold text-accent-foreground mb-6">Service Inquiry Form</h3>

            {sent ? (
              <div className="rounded-2xl border border-accent-foreground/20 bg-background/20 px-5 py-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-accent-foreground mx-auto" />
                <p className="mt-3 text-accent-foreground font-medium">Inquiry submitted successfully.</p>
                <p className="mt-2 text-sm text-accent-foreground/80">
                  Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={onSubmit}>
                {error ? (
                  <p className="rounded-xl border border-destructive/40 bg-destructive/20 px-4 py-3 text-sm text-accent-foreground">
                    {error}
                  </p>
                ) : null}
                <div>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(event) => setFormData((previous) => ({ ...previous, fullName: event.target.value }))}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 rounded-xl bg-background/20 border border-accent-foreground/30 text-accent-foreground placeholder-accent-foreground/60 focus:outline-none focus:border-accent-foreground/60 transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData((previous) => ({ ...previous, email: event.target.value }))}
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-xl bg-background/20 border border-accent-foreground/30 text-accent-foreground placeholder-accent-foreground/60 focus:outline-none focus:border-accent-foreground/60 transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(event) => setFormData((previous) => ({ ...previous, phoneNumber: event.target.value }))}
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 rounded-xl bg-background/20 border border-accent-foreground/30 text-accent-foreground placeholder-accent-foreground/60 focus:outline-none focus:border-accent-foreground/60 transition-colors"
                  />
                </div>
                <div>
                  <select
                    value={formData.serviceSlug}
                    onChange={(event) => setFormData((previous) => ({ ...previous, serviceSlug: event.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-background/20 border border-accent-foreground/30 text-accent-foreground focus:outline-none focus:border-accent-foreground/60 transition-colors"
                  >
                    {serviceOptions.map((service) => (
                      <option key={service.slug} value={service.slug} className="text-foreground bg-background">
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <textarea
                    value={formData.message}
                    onChange={(event) => setFormData((previous) => ({ ...previous, message: event.target.value }))}
                    placeholder="Message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-background/20 border border-accent-foreground/30 text-accent-foreground placeholder-accent-foreground/60 focus:outline-none focus:border-accent-foreground/60 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-background text-accent px-6 py-3 rounded-xl font-semibold hover:bg-background/90 transition-all duration-300 disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {loading ? "Submitting..." : "Submit Inquiry"}
                </button>
              </form>
            )}
            <p className="text-sm text-accent-foreground/70 mt-4 text-center">We usually reply within 24 hours.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

