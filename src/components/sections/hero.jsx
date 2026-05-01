"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const defaultContent = {
  badgeText: "Available for new projects - Q3 2026",
  headingTop: "Design that",
  headingEmphasis: "moves",
  headingBottom: "the world.",
  description:
    "We are an independent studio building bold brands, premium digital products, and award-winning web experiences for ambitious teams worldwide.",
  primaryCtaLabel: "Start a project",
  primaryCtaLink: "/contact",
  secondaryCtaLabel: "View our work",
  secondaryCtaLink: "/portfolio",
  stats: [
    { value: "120+", label: "Projects shipped" },
    { value: "48", label: "Awards won" },
    { value: "12y", label: "Of craft" },
    { value: "98%", label: "Client retention" },
  ],
};

export function Hero({ content = defaultContent }) {
  const resolved = {
    ...defaultContent,
    ...(content || {}),
  };
  const stats = Array.isArray(resolved.stats) ? resolved.stats : defaultContent.stats;

  return (
    <section className="relative pt-36 pb-24 sm:pt-44 sm:pb-32 overflow-hidden" suppressHydrationWarning>
      <div className="absolute inset-0 bg-hero" suppressHydrationWarning />
      <div className="absolute inset-0 grid-bg opacity-40" suppressHydrationWarning />
      <motion.div
        className="absolute -top-20 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        suppressHydrationWarning
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6" suppressHydrationWarning>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-foreground/80">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            {resolved.badgeText}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-8 text-center text-5xl sm:text-7xl md:text-[8rem] font-bold tracking-[-0.04em] leading-[0.9]"
        >
          <span className="text-gradient">{resolved.headingTop}</span>
          <br />
          <span className="italic font-light">{resolved.headingEmphasis}</span>
          <span className="text-gradient"> {resolved.headingBottom}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 mx-auto max-w-2xl text-center text-base sm:text-lg text-muted-foreground"
        >
          {resolved.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href={resolved.primaryCtaLink}
            className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90 transition-all hover:scale-[1.02]"
          >
            {resolved.primaryCtaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href={resolved.secondaryCtaLink}
            className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium hover:border-accent/50 transition-all"
          >
            {resolved.secondaryCtaLabel}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold tracking-tight">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

