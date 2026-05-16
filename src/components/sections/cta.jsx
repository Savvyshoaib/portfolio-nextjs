import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const defaultContent = {
  eyebrow: "Contact",
  title: "Have a project in mind? Let's build it.",
  subtitle: "We take on a limited number of partners each quarter. Tell us about your idea and we will get back within 24 hours.",
  ctaLabel: "Start a project",
  ctaLink: "/contact",
};

export function CTA({ eyebrow, title, subtitle, cta, ctaLink, content }) {
  const source = {
    ...defaultContent,
    ...(content || {}),
  };

  const resolved = {
    eyebrow: eyebrow || source.eyebrow,
    title: title || source.title,
    subtitle: subtitle || source.subtitle,
    ctaLabel: cta || source.ctaLabel,
    ctaLink: ctaLink || source.ctaLink,
  };

  return (
    <section id="contact" className="py-32" data-gsap-section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border p-12 md:p-20 text-center noise">
          <div className="blob bg-neon/30 h-[500px] w-[500px] -top-40 left-1/2 -translate-x-1/2 animate-float" data-gsap-parallax data-gsap-depth="14" />
          <div className="relative">
            <div className="text-xs uppercase tracking-widest text-neon mb-4">- {resolved.eyebrow}</div>
            <h2 className="text-4xl md:text-7xl font-bold leading-[1.05]">
              <span className="text-neon italic font-light text-glow">{resolved.title}</span>
            </h2>
            <p className="mt-6 max-w-xl mx-auto text-muted-foreground">{resolved.subtitle}</p>
            <Link
              href={resolved.ctaLink}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-neon px-7 py-4 text-sm font-medium text-primary-foreground hover:glow-neon transition group"
            >
              {resolved.ctaLabel}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
