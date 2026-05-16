const defaultContent = {
  eyebrow: "Trusted by industry leaders",
  logos: ["FRAMER", "LINEAR", "VERCEL", "STRIPE", "FIGMA", "NOTION", "ARC", "RAYCAST", "LOOM", "VITE"],
  marqueeDurationSeconds: 30,
};

export function Clients({ content = defaultContent }) {
  const resolved = { ...defaultContent, ...(content || {}) };
  const logos = Array.isArray(resolved.logos) && resolved.logos.length ? resolved.logos : defaultContent.logos;
  const duration = Number(resolved.marqueeDurationSeconds) || defaultContent.marqueeDurationSeconds;

  return (
    <section className="border-y border-border py-8 overflow-hidden bg-card/30" data-gsap-section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{resolved.eyebrow}</p>
      </div>
      <div className="flex gap-16 whitespace-nowrap marquee-pauses-on-hover" style={{ animation: `marquee ${duration}s linear infinite` }}>
        {[...logos, ...logos, ...logos].map((logo, index) => (
          <div key={`${logo}-${index}`} className="flex items-center gap-16 text-3xl md:text-5xl font-semibold">
            <span className="text-foreground/80">{logo}</span>
            <span className="h-3 w-3 rounded-full bg-neon shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
}
