import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { resolveServiceIcon } from "@/lib/icon-map";

const defaultContent = {
  eyebrow: "Our Services",
  title: "Solutions that move brands forward.",
  titleEmphasis: "forward",
  linkLabel: "All services",
  linkHref: "/services",
};

function renderTitle(title, emphasis) {
  if (!title || !emphasis || !title.includes(emphasis)) {
    return title;
  }

  const [before, ...rest] = title.split(emphasis);
  return (
    <>
      {before}
      <span className="title-emphasis text-neon italic font-light">{emphasis}</span>
      {rest.join(emphasis)}
    </>
  );
}

const defaultServices = [
  { title: "Branding & Identity", desc: "Distinct brand systems that capture vision and build trust.", icon: "Layout" },
  { title: "UI / UX Design", desc: "Beautiful, intuitive interfaces engineered for conversion.", icon: "Sparkles" },
  { title: "Web Development", desc: "High-performance websites with cinematic interactions.", icon: "Code2" },
];

export function Services({ content = defaultContent, items = defaultServices }) {
  const resolved = { ...defaultContent, ...(content || {}) };
  const list = Array.isArray(items) && items.length ? items : defaultServices;
  const allServicesHref = String(resolved.linkHref || "").trim() || "/services";

  return (
    <section id="services" className="relative py-32" data-gsap-section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="text-xs uppercase tracking-widest text-neon mb-3">- {resolved.eyebrow}</div>
            <h2 className="text-4xl md:text-6xl font-bold leading-[1.05] max-w-3xl">{renderTitle(resolved.title, resolved.titleEmphasis)}</h2>
          </div>
          <Link href={allServicesHref} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-neon transition group">
            {resolved.linkLabel}
            <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" data-gsap-stagger>
          {list.map((service, index) => {
            const Icon = resolveServiceIcon(service.icon || service.payload?.icon);
            return (
              <Link
                key={service.id || service.title || index}
                href={service.slug ? `/services/${service.slug}` : allServicesHref}
                className="group relative rounded-3xl border border-border bg-card p-7 overflow-hidden hover:border-neon/40 transition-colors hover:-translate-y-1"
                data-gsap-item
              >
                <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-neon/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-start justify-between">
                  <div className="h-12 w-12 rounded-2xl grid place-items-center bg-neon/10 text-neon group-hover:bg-neon group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-neon group-hover:rotate-45 transition-all" />
                </div>
                <h3 className="relative mt-8 text-xl font-semibold">{service.title}</h3>
                <p className="relative mt-2 text-sm text-muted-foreground">{service.desc || service.excerpt}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
