const defaultContent = {
  eyebrow: "Trusted by industry leaders",
  logos: ["FRAMER", "LINEAR", "VERCEL", "STRIPE", "FIGMA", "NOTION", "ARC", "RAYCAST", "LOOM", "VITE"],
};

export function Clients({ content = defaultContent }) {
  const resolved = { ...defaultContent, ...(content || {}) };
  const logos = Array.isArray(resolved.logos) ? resolved.logos : defaultContent.logos;

  return (
    <section className="py-20 border-y border-border bg-secondary/30" suppressHydrationWarning>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-10 text-center" suppressHydrationWarning>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{resolved.eyebrow}</p>
      </div>
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex w-max animate-marquee">
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={`${logo}-${index}`}
              className="flex items-center justify-center px-12 text-2xl sm:text-3xl font-bold tracking-tight text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

