"use client";

import Link from "next/link";
import { ArrowUpRight, Play, Sparkles } from "lucide-react";

const defaultContent = {
  badgeText: "Available for new projects - 2026",
  headingTop: "We Craft",
  headingEmphasis: "Digital",
  headingBottom: "Experiences.",
  description:
    "A future-forward studio building bold brands, immersive websites, and AI-powered products for ambitious teams across the globe.",
  primaryCtaLabel: "View our work",
  primaryCtaLink: "/portfolio",
  secondaryCtaLabel: "Start a project",
  secondaryCtaLink: "/contact",
  stats: [
    { value: "12+", label: "Years experience" },
    { value: "240", label: "Projects shipped" },
    { value: "38", label: "Global clients" },
    { value: "18", label: "Design awards" },
  ],
};

export function Hero({ content = defaultContent }) {
  const resolved = { ...defaultContent, ...(content || {}) };
  const stats = Array.isArray(resolved.stats) ? resolved.stats : defaultContent.stats;

  return (
    <section id="home" className="relative pt-40 pb-32 overflow-hidden noise" data-gsap-section>
      <div className="blob bg-neon/30 h-[500px] w-[500px] -top-32 -left-32 animate-float" data-gsap-parallax data-gsap-depth="12" />
      <div
        className="blob bg-neon/15 h-[600px] w-[600px] top-40 -right-40 animate-float"
        style={{ animationDelay: "3s" }}
        data-gsap-parallax
        data-gsap-depth="20"
      />
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none grid-bg" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative">
        <div className="mb-8 flex justify-center px-2 sm:px-0">
          <div className="hero-status-badge inline-flex max-w-full items-center justify-center gap-2.5 rounded-full glass px-4 py-2.5 text-center text-[0.68rem] font-medium leading-[1.35] uppercase tracking-[0.16em] text-foreground/75 sm:px-6 sm:text-xs">
            <Sparkles className="hero-status-icon h-3.5 w-3.5 shrink-0" />
            <span className="hero-status-text3">{resolved.badgeText}</span>
          </div>
        </div>

        <h1 className="py-[0.06em] text-center font-bold leading-[1.02] tracking-tight text-[clamp(3rem,10vw,7.8rem)]" data-gsap-reveal>
          <span className="block">{resolved.headingTop}</span>
          <span className="block">
            <span className="hero-heading-emphasis text-neon text-glow italic font-light">{resolved.headingEmphasis}</span>{" "}
            <span>{resolved.headingBottom}</span>
          </span>
        </h1>

        <p className="mt-8 max-w-2xl mx-auto text-center text-base md:text-lg text-muted-foreground">{resolved.description}</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={resolved.primaryCtaLink}
            className="group inline-flex items-center gap-2 rounded-full bg-neon px-6 py-3.5 text-sm font-medium text-primary-foreground hover:glow-neon transition-all"
          >
            {resolved.primaryCtaLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </Link>
          <Link href={resolved.secondaryCtaLink} className="group inline-flex items-center gap-3 rounded-full glass px-5 py-3 text-sm">
            <span className="grid place-items-center h-8 w-8 rounded-full bg-neon text-primary-foreground">
              <Play className="h-3.5 w-3.5 fill-current" />
            </span>
            {resolved.secondaryCtaLabel}
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto" data-gsap-stagger>
          {stats.map((item) => (
            <div key={item.label} className="glass rounded-3xl p-6 text-center hover:border-neon/50 transition-colors" data-gsap-item>
              <div className="text-3xl md:text-4xl font-bold text-neon">{item.value}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
