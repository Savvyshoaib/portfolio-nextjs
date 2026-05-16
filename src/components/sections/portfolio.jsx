import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const defaultContent = {
  eyebrow: "Selected Work",
  title: "Recent case studies.",
  titleEmphasis: "studies",
  linkLabel: "View archive",
  linkHref: "/portfolio",
};

const defaultProjects = [
  { title: "Lumen AI", tag: "AI - SaaS", year: "2026" },
  { title: "Northwave", tag: "Branding", year: "2025" },
  { title: "Orbit Pay", tag: "Fintech - Web", year: "2025" },
  { title: "Helio Studio", tag: "Motion - 3D", year: "2024" },
];

function renderTitle(title, emphasis) {
  if (!title || !emphasis || !title.includes(emphasis)) {
    return title;
  }

  const [before, ...rest] = title.split(emphasis);
  return (
    <>
      {before}
      <span className="text-neon italic font-light">{emphasis}</span>
      {rest.join(emphasis)}
    </>
  );
}

function projectGradient(seed = 0) {
  const sets = [
    "linear-gradient(135deg, color-mix(in oklab, var(--brand-purple) 40%, transparent), color-mix(in oklab, var(--brand-orange) 30%, transparent))",
    "linear-gradient(135deg, color-mix(in oklab, var(--brand-magenta) 36%, transparent), color-mix(in oklab, var(--brand-purple) 35%, transparent))",
    "linear-gradient(135deg, color-mix(in oklab, var(--brand-orange) 35%, transparent), color-mix(in oklab, var(--brand-magenta) 28%, transparent))",
    "linear-gradient(135deg, color-mix(in oklab, var(--brand-purple) 30%, transparent), color-mix(in oklab, var(--brand-magenta) 30%, transparent), color-mix(in oklab, var(--brand-orange) 25%, transparent))",
  ];
  return sets[seed % sets.length];
}

export function Portfolio({ content = defaultContent, items = defaultProjects }) {
  const resolved = { ...defaultContent, ...(content || {}) };
  const list = Array.isArray(items) && items.length ? items : defaultProjects;
  const allProjectsHref = String(resolved.linkHref || "").trim() || "/portfolio";

  return (
    <section id="work" className="relative py-32" data-gsap-section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-xs uppercase tracking-widest text-neon mb-3">- {resolved.eyebrow}</div>
            <h2 className="text-4xl md:text-6xl font-bold">{renderTitle(resolved.title, resolved.titleEmphasis)}</h2>
          </div>
          <Link href={allProjectsHref} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-neon transition group">
            {resolved.linkLabel}
            <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6" data-gsap-stagger>
          {list.map((project, index) => (
            <Link
              href={project.slug ? `/portfolio/${project.slug}` : allProjectsHref}
              key={project.id || project.slug || project.title || index}
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-border block"
              data-gsap-item
            >
              {project.cover_image_url ? (
                <img src={project.cover_image_url} alt={project.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <div className="absolute inset-0" style={{ background: projectGradient(index) }} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute inset-0 opacity-60 mix-blend-screen">
                <div className="absolute top-10 right-10 h-40 w-40 rounded-full bg-neon/40 blur-3xl transition-transform duration-700 group-hover:scale-150" />
                <div className="absolute bottom-10 left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              </div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="text-xs uppercase tracking-widest text-neon mb-2">{project.tag || project.excerpt}</div>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl md:text-4xl font-bold">{project.title}</h3>
                  <div className="h-12 w-12 rounded-full bg-neon text-primary-foreground grid place-items-center transition-transform group-hover:rotate-45">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
