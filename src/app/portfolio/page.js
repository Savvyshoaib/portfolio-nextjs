import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { CTA } from "@/components/sections/cta";
import { buildPageMetadata, getPublicSiteData } from "@/lib/cms/public";

export async function generateMetadata() {
  return buildPageMetadata("portfolio");
}

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

export default async function PortfolioPage() {
  const data = await getPublicSiteData();
  const sections = data.sections || {};
  const pageHeader = sections?.pageHeaders?.portfolio || {};
  const allItems = Array.isArray(data.portfolio) ? data.portfolio : [];

  return (
    <>
      <section className="pt-40 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">{pageHeader.eyebrow || "Selected work"}</span>
            <h1 className="mt-4 text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl leading-[0.95]">
              {renderTitle(pageHeader.title, pageHeader.titleEmphasis)}
            </h1>
            <p className="mt-6 max-w-2xl text-muted-foreground text-lg">{pageHeader.description}</p>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {allItems.map((item, index) => (
              <Reveal key={item.id || item.slug || `${item.title}-${index}`} delay={(index % 6) * 0.05} className={item.size === "lg" ? "md:col-span-2" : ""}>
                <Link
                  href={item.slug ? `/portfolio/${item.slug}` : "/portfolio"}
                  className="group relative block overflow-hidden rounded-3xl bg-card border border-border aspect-4/3 hover:shadow-glow transition-all duration-500"
                >
                  {item.cover_image_url ? (
                    <img
                      src={item.cover_image_url}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${item.color || "from-accent/40 to-accent"} opacity-90 transition-transform duration-700 group-hover:scale-110`}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(1_0_0/0.25),transparent_55%)]" />
                  <div className="absolute inset-0 noise" />
                  <div className="relative h-full flex flex-col justify-between p-6 sm:p-8">
                    <div className="flex items-center justify-between text-white/90 text-xs">
                      <span className="rounded-full bg-black/20 backdrop-blur px-3 py-1">{item.tag || item.excerpt}</span>
                      <span>{item.year}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{item.title}</h3>
                      <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/90 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        View case study <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTA content={sections.ctaSecondary} />
    </>
  );
}

