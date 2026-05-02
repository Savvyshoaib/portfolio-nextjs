import { Reveal } from "../reveal";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { resolveServiceIcon } from "@/lib/icon-map";

const defaultContent = {
  eyebrow: "Services",
  title: "Everything you need to launch remarkable.",
  titleEmphasis: "remarkable",
  linkLabel: "All services",
  linkHref: "/services",
};

const defaultServices = [
  {
    title: "Brand and Identity",
    desc: "Visual systems, logos, and guidelines that scale across every touchpoint.",
    icon: "Layout",
  },
  {
    title: "Web Development",
    desc: "Performant, accessible, and beautifully animated sites built to last.",
    icon: "Code2",
  },
  {
    title: "Product Design",
    desc: "End-to-end UX for SaaS, mobile, and complex web applications.",
    icon: "Sparkles",
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

export function Services({ content = defaultContent, items = defaultServices }) {
  const resolved = { ...defaultContent, ...(content || {}) };
  const list = Array.isArray(items) && items.length ? items : defaultServices;
  const allServicesHref = "/services";

  return (
    <section className="py-24 sm:py-32 relative" suppressHydrationWarning>
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
              href={allServicesHref}
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
            >
              {resolved.linkLabel} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((service, index) => {
            const Icon = resolveServiceIcon(service.icon || service.payload?.icon);
            return (
              <Reveal key={service.id || service.title || index} delay={index * 0.05}>
                <Link
                  href={service.slug ? `/services/${service.slug}` : allServicesHref}
                  className="group relative block h-full rounded-3xl border border-border bg-card p-7 transition-all hover:border-accent/50 hover:shadow-glow hover:-translate-y-1 duration-300"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{service.desc || service.excerpt}</p>
                  <ArrowUpRight className="absolute top-7 right-7 h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all" />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

