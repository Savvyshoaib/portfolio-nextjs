import { renderTitle } from "@/lib/render-title";

const defaultContent = {
  eyebrow: "The Team",
  title: "Tools and minds behind the work.",
  titleEmphasis: "work",
};

const defaultItems = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind",
  "GSAP",
  "Figma",
  "Supabase",
  "Node",
  "Postgres",
  "Cloudflare",
];

function avatarGradient(index) {
  const gradients = [
    "linear-gradient(135deg, color-mix(in oklab, var(--brand-orange) 35%, transparent), color-mix(in oklab, var(--brand-magenta) 30%, transparent))",
    "linear-gradient(135deg, color-mix(in oklab, var(--brand-purple) 35%, transparent), color-mix(in oklab, var(--brand-orange) 30%, transparent))",
    "linear-gradient(135deg, color-mix(in oklab, var(--brand-magenta) 35%, transparent), color-mix(in oklab, var(--brand-purple) 28%, transparent))",
    "linear-gradient(135deg, color-mix(in oklab, var(--brand-purple) 28%, transparent), color-mix(in oklab, var(--brand-magenta) 25%, transparent), color-mix(in oklab, var(--brand-orange) 25%, transparent))",
  ];
  return gradients[index % gradients.length];
}

export function TechStack({ content = defaultContent, items = defaultItems }) {
  const resolved = { ...defaultContent, ...(content || {}) };
  const stack = Array.isArray(items) && items.length ? items : defaultItems;
  const featured = stack.slice(0, 4);
  const rest = stack.slice(4);

  return (
    <section className="py-32" data-gsap-section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-xs uppercase tracking-widest text-neon mb-3">- {resolved.eyebrow}</div>
            <h2 className="text-4xl md:text-6xl font-bold">{renderTitle(resolved.title, resolved.titleEmphasis)}</h2>
          </div>
          <p className="max-w-md text-muted-foreground">A compact senior team with a modern stack built for speed, reliability, and premium product quality.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8" data-gsap-stagger>
          {featured.map((name, index) => (
            <div key={`${name}-${index}`} className="group relative rounded-3xl overflow-hidden border border-border aspect-[3/4]" data-gsap-item>
              <div className="absolute inset-0" style={{ background: avatarGradient(index) }} />
              <div className="absolute inset-0 grid place-items-center text-7xl font-bold text-foreground/10">{name.charAt(0)}</div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-xl font-semibold">{name}</h3>
                <p className="text-sm text-muted-foreground">Core technology</p>
              </div>
              <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-neon glow-neon" />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3" data-gsap-stagger>
          {rest.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground hover:border-neon hover:text-neon transition-colors"
              data-gsap-item
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
