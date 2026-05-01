import { Reveal } from "../reveal";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const defaultContent = {
  eyebrow: "Lets build",
  title: "Have an ambitious project in mind?",
  subtitle: "Tell us about it. We reply within 24 hours and love a good challenge.",
  ctaLabel: "Lets work together",
  ctaLink: "/contact",
};

export function CTA({
  eyebrow,
  title,
  subtitle,
  cta,
  ctaLink,
  content,
}) {
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
    <section className="py-24 sm:py-32" suppressHydrationWarning>
      <div className="mx-auto max-w-7xl px-4 sm:px-6" suppressHydrationWarning>
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl sm:rounded-[3rem] bg-gradient-accent p-10 sm:p-20 shadow-elegant noise">
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
            <div className="relative">
              <span className="text-xs uppercase tracking-[0.3em] text-accent-foreground/70 font-semibold">{resolved.eyebrow}</span>
              <h2 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl text-accent-foreground leading-[1.05]">
                {resolved.title}
              </h2>
              <p className="mt-5 max-w-xl text-accent-foreground/80">{resolved.subtitle}</p>
              <Link
                href={resolved.ctaLink}
                className="group mt-10 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-7 py-3.5 text-sm font-medium hover:opacity-90 transition-all"
              >
                {resolved.ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

