import { Reveal } from "../reveal";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const defaultContent = {
  eyebrow: "Selected work",
  title: "A few things we are proud of.",
  titleEmphasis: "proud of",
  linkLabel: "All projects",
  linkHref: "/portfolio",
};

const defaultProjects = [
  {
    title: "Lumen - Banking reimagined",
    tag: "Product and Brand",
    year: "2026",
    color: "from-violet-500 to-fuchsia-500",
    size: "lg",
  },
  {
    title: "Atlas Studios",
    tag: "Web and Motion",
    year: "2025",
    color: "from-emerald-400 to-teal-500",
    size: "sm",
  },
  {
    title: "Northwind Coffee",
    tag: "Brand and Packaging",
    year: "2025",
    color: "from-amber-400 to-orange-600",
    size: "sm",
  },
];

function renderTitle(title, emphasis) {
  if (!title || !emphasis || !title.includes(emphasis)) {
    return title;
  }

  const [before, ...rest] = title.split(emphasis);
  return (
    <>
      {before}
      <em className="font-light">{emphasis}</em>
      {rest.join(emphasis)}
    </>
  );
}

export function Portfolio({ content = defaultContent, items = defaultProjects }) {
  const resolved = { ...defaultContent, ...(content || {}) };
  const list = Array.isArray(items) && items.length ? items : defaultProjects;

  return (
    <section className="py-24 sm:py-32" suppressHydrationWarning>
      <div className="mx-auto max-w-7xl px-4 sm:px-6" suppressHydrationWarning>
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">{resolved.eyebrow}</span>
              <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl leading-[1.05]">
                {renderTitle(resolved.title, resolved.titleEmphasis)}
              </h2>
            </div>
            <Link
              href={resolved.linkHref}
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
            >
              {resolved.linkLabel} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-3">
          {list.map((project, index) => (
            <Reveal
              key={project.id || project.title || index}
              delay={index * 0.05}
              className={project.size === "lg" ? "md:col-span-2" : ""}
            >
              <Link
                href={resolved.linkHref}
                className="group relative block overflow-hidden rounded-3xl bg-card border border-border aspect-4/3 hover:shadow-glow transition-all duration-500"
              >
                <div
                  className={`relative aspect-4/3 overflow-hidden rounded-2xl bg-linear-to-br ${
                    project.color || "from-accent/40 to-accent"
                  } shadow-elegant transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(1_0_0/0.25),transparent_55%)]" />
                  <div className="absolute inset-0 noise" />
                  <div className="relative h-full flex flex-col justify-between p-6 sm:p-8">
                    <div className="flex items-center justify-between text-white/90 text-xs">
                      <span className="rounded-full bg-black/20 backdrop-blur px-3 py-1">{project.tag || project.excerpt}</span>
                      <span>{project.year}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{project.title}</h3>
                      <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/90 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        View case study <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

