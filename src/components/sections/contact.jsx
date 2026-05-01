"use client";

import { useState } from "react";
import { z } from "zod";
import { Reveal } from "../reveal";
import { Mail, MapPin, Send, CheckCircle2 } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(10, "Tell us a bit more").max(1000),
});

export function ContactSection({ compact = false }) {
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    const result = schema.safeParse(data);
    if (!result.success) {
      const errs = {};
      result.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }

    setErrors({});
    setSent(true);
    e.currentTarget.reset();
  };

  return (
    <section className={compact ? "py-16" : "py-24 sm:py-32"} suppressHydrationWarning>
      <div className="mx-auto max-w-7xl px-4 sm:px-6" suppressHydrationWarning>
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Contact</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
              Let&apos;s make something <em className="font-light">unforgettable</em>.
            </h2>
            <p className="mt-5 text-muted-foreground max-w-md">
              Drop a line about your project, timeline, and ambitions. We&apos;ll reply within 24 hours.
            </p>

            <ul className="mt-10 space-y-5">
              <li className="flex items-center gap-4">
                <span className="h-11 w-11 inline-flex items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Email</div>
                  <a href="mailto:hello@nova.studio" className="font-medium hover:text-accent transition-colors">
                    hello@nova.studio
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <span className="h-11 w-11 inline-flex items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Studio</div>
                  <div className="font-medium">Lisbon · Remote worldwide</div>
                </div>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-7 sm:p-8 shadow-elegant">
              {sent && (
                <div className="mb-5 flex items-center gap-2 rounded-xl bg-accent/10 text-accent px-4 py-3 text-sm">
                  <CheckCircle2 className="h-4 w-4" /> Message received - we&apos;ll be in touch soon.
                </div>
              )}
              <div className="space-y-5">
                <Field label="Name" name="name" placeholder="Your full name" error={errors.name} />
                <Field label="Email" name="email" type="email" placeholder="you@company.com" error={errors.email} />
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
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all resize-none"
                  />
                  {errors.message && <p className="mt-1.5 text-xs text-destructive">{errors.message}</p>}
                </div>
                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-2 w-full rounded-xl bg-foreground text-background px-6 py-3.5 text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Send message
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", placeholder, error }) {
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
        className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
      />
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

