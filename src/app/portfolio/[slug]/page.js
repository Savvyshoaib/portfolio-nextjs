import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { ArrowLeft, Calendar, ExternalLink, Code, Globe, Users } from "lucide-react";
import Link from "next/link";
import { getPublicSiteData } from "@/lib/cms/public";
import { normalizePortfolioPayload } from "@/lib/cms/portfolio-detail";
import { buildItemMetadata } from "@/lib/cms/item-seo";
import "./carousel.css";

const HERO_CATEGORY_STYLES = [
  "from-blue-500/10 to-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "from-purple-500/10 to-purple-600/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  "from-green-500/10 to-green-600/10 text-green-600 dark:text-green-400 border-green-500/20",
  "from-orange-500/10 to-orange-600/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
];

const OVERVIEW_STACK_STYLES = [
  "from-blue-500/10 to-blue-600/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  "from-gray-500/10 to-gray-600/10 text-gray-700 dark:text-gray-300 border-gray-500/20",
  "from-cyan-500/10 to-cyan-600/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20",
  "from-blue-500/10 to-blue-600/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
];

const FALLBACK_RELATED_GRADIENTS = [
  "from-blue-500 via-purple-500 to-pink-500",
  "from-green-500 via-emerald-500 to-cyan-500",
  "from-orange-500 via-red-500 to-pink-500",
];

function metricClassForTone(tone) {
  switch (tone) {
    case "success":
      return "from-green-500 to-emerald-500";
    case "info":
      return "from-blue-500 to-cyan-500";
    case "warning":
      return "from-orange-500 to-red-500";
    case "magenta":
      return "from-purple-500 to-pink-500";
    default:
      return "from-accent to-accent/70";
  }
}

function metricsGridClass(length) {
  if (length <= 1) {
    return "md:grid-cols-1";
  }

  if (length === 2) {
    return "md:grid-cols-2";
  }

  return "md:grid-cols-3";
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getPublicSiteData();
  const portfolioItem = data.portfolio.find((item) => item.slug === slug);

  if (!portfolioItem) {
    return {
      title: "Portfolio Item Not Found",
    };
  }

  const payload = normalizePortfolioPayload(portfolioItem.payload || {});
  return buildItemMetadata(
    payload.seo,
    {
      title: `${portfolioItem.title} - Portfolio`,
      description:
        payload.hero?.description ||
        portfolioItem.excerpt ||
        `Detailed view of ${portfolioItem.title} project`,
      keywords: portfolioItem.tags || payload.hero?.categories || [],
    },
    "website"
  );
}

export default async function PortfolioDetailPage({ params }) {
  const { slug } = await params;
  const data = await getPublicSiteData();
  const portfolioItem = data.portfolio.find((item) => item.slug === slug);

  if (!portfolioItem) {
    notFound();
  }

  const payload = normalizePortfolioPayload(portfolioItem.payload || {});
  const hero = payload.hero;
  const deepDive = payload.deepDive;
  const techStackSection = payload.techStackSection;
  const results = payload.results;
  const related = payload.related;
  const relatedProjects = data.portfolio
    .filter((item) => item.slug && item.slug !== slug)
    .slice(0, 3);
  const overviewStack = payload.technologies.slice(0, 4);

  return (
    <>
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 mb-8 group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Back to Portfolio</span>
            </Link>

            <div className="grid gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="mb-10">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="inline-flex items-center rounded-full bg-linear-to-r from-accent/20 to-accent/10 text-accent px-4 py-2 text-sm font-semibold border border-accent/20">
                      <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse" />
                      {hero.featuredLabel}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">{hero.typeLabel}</span>
                  </div>
                  <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[0.9] mb-8 bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {portfolioItem.title}
                  </h1>
                  <p className="text-2xl text-muted-foreground mb-8 leading-relaxed font-light">
                    {hero.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 mb-10">
                  {hero.categories.map((category, index) => (
                    <span
                      key={`${category}-${index}`}
                      className={`inline-flex items-center rounded-full bg-linear-to-r px-4 py-2 text-sm font-medium border ${HERO_CATEGORY_STYLES[index % HERO_CATEGORY_STYLES.length]}`}
                    >
                      {category}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  {payload.liveUrl ? (
                    <Link
                      href={payload.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 rounded-xl bg-linear-to-r from-accent to-accent/80 text-accent-foreground px-6 py-3 text-sm font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all duration-300 group"
                    >
                      <ExternalLink className="h-4 w-4 transition-transform group-hover:scale-110" />
                      <span>View Live Project</span>
                    </Link>
                  ) : null}
                  {payload.githubUrl ? (
                    <Link
                      href={payload.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-accent/10 hover:border-accent/40 transition-all duration-300 group"
                    >
                      <Code className="h-4 w-4 transition-transform group-hover:scale-110" />
                      <span>Source Code</span>
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">
                  <div className="rounded-3xl overflow-hidden border border-border shadow-elegant group">
                    <div className="aspect-4/3 relative overflow-hidden">
                      {portfolioItem.cover_image_url ? (
                        <img
                          src={portfolioItem.cover_image_url}
                          alt={portfolioItem.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-linear-to-br ${payload.color}`} />
                      )}
                      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <span className="absolute top-6 left-6 text-xs rounded-full bg-background/90 backdrop-blur-sm px-4 py-2 font-semibold text-foreground border border-background/20">
                        {hero.awardLabel}
                      </span>
                      <div className="absolute bottom-6 right-6">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <ExternalLink className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-8 shadow-elegant">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-3 text-foreground">
                      <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/60 rounded-lg flex items-center justify-center">
                        <Globe className="h-4 w-4 text-accent-foreground" />
                      </div>
                      Project Overview
                    </h3>
                    <dl className="space-y-5">
                      <div className="flex justify-between items-center pb-3 border-b border-border/50">
                        <dt className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-accent" />
                          Timeline
                        </dt>
                        <dd className="text-sm font-bold text-foreground">{payload.timeline}</dd>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-border/50">
                        <dt className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                          <Users className="h-4 w-4 text-accent" />
                          Client
                        </dt>
                        <dd className="text-sm font-bold text-foreground">{payload.client}</dd>
                      </div>
                      <div className="pt-2">
                        <dt className="text-sm text-muted-foreground font-medium mb-3 flex items-center gap-2">
                          <Code className="h-4 w-4 text-accent" />
                          Tech Stack
                        </dt>
                        <dd className="text-sm">
                          <div className="flex flex-wrap gap-2">
                            {overviewStack.map((tech, index) => (
                              <span
                                key={`${tech}-${index}`}
                                className={`rounded-lg bg-linear-to-r px-3 py-1 text-xs font-semibold border ${OVERVIEW_STACK_STYLES[index % OVERVIEW_STACK_STYLES.length]}`}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-background via-muted/20 to-muted/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {deepDive.title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{deepDive.description}</p>
            </div>

            <div className="space-y-20">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">!</span>
                    </div>
                    <h3 className="text-3xl font-bold text-foreground">{deepDive.challengeTitle}</h3>
                  </div>
                  {deepDive.challengeParagraphs.map((paragraph, index) => (
                    <p key={`challenge-${index}`} className="text-lg text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="relative">
                  <div className="aspect-16/10 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl border border-red-500/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-3xl font-bold">!</span>
                      </div>
                      <p className="text-foreground font-semibold">{deepDive.challengeCardLabel}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <div className="relative order-2 lg:order-1">
                  <div className="aspect-16/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-3xl font-bold">-&gt;</span>
                      </div>
                      <p className="text-foreground font-semibold">{deepDive.approachCardLabel}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 order-1 lg:order-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">-&gt;</span>
                    </div>
                    <h3 className="text-3xl font-bold text-foreground">{deepDive.approachTitle}</h3>
                  </div>
                  {deepDive.approachParagraphs.map((paragraph, index) => (
                    <p key={`approach-${index}`} className="text-lg text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className="py-16">
                <div className="text-center mb-16">
                  <h3 className="text-3xl font-bold text-foreground mb-4">{techStackSection.title}</h3>
                  <p className="text-lg text-muted-foreground">{techStackSection.subtitle}</p>
                </div>

                <div className="mb-8 overflow-hidden group">
                  <div className="flex gap-4 animate-scroll-left">
                    {[...techStackSection.rowOne, ...techStackSection.rowOne].map((tech, index) => (
                      <div
                        key={`row-one-${index}`}
                        className="w-28 h-20 rounded-2xl bg-muted/30 flex items-center justify-center cursor-pointer shrink-0"
                      >
                        <span className="text-sm font-semibold text-foreground hover:text-accent transition-colors duration-300 text-center px-2">
                          {tech}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overflow-hidden group">
                  <div className="flex gap-4 animate-scroll-right">
                    {[...techStackSection.rowTwo, ...techStackSection.rowTwo].map((tech, index) => (
                      <div
                        key={`row-two-${index}`}
                        className="w-28 h-20 rounded-2xl bg-muted/30 flex items-center justify-center cursor-pointer shrink-0"
                      >
                        <span className="text-sm font-semibold text-foreground hover:text-accent transition-colors duration-300 text-center px-2">
                          {tech}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center space-y-8">
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-6">{results.title}</h3>
                  <div className={`grid gap-8 ${metricsGridClass(results.metrics.length)}`}>
                    {results.metrics.map((metric, index) => (
                      <div key={`metric-${index}`}>
                        <div
                          className={`text-5xl font-bold bg-linear-to-r ${metricClassForTone(
                            metric.tone
                          )} bg-clip-text text-transparent mb-2`}
                        >
                          {metric.value}
                        </div>
                        <p className="text-muted-foreground">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {results.summary}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 bg-linear-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal delay={0.2}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {related.title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{related.description}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((item, index) => {
                const itemPayload = normalizePortfolioPayload(item.payload || {});
                const categoryLabel =
                  itemPayload.hero.categories[0] || item.tags?.[0] || item.excerpt || "Project";
                const gradient = itemPayload.color || FALLBACK_RELATED_GRADIENTS[index % FALLBACK_RELATED_GRADIENTS.length];

                return (
                  <Link
                    key={item.slug || `${item.title}-${index}`}
                    href={`/portfolio/${item.slug}`}
                    className="group block rounded-3xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden hover:border-accent/40 hover:shadow-elegant hover:shadow-accent/10 transition-all duration-500 hover:-translate-y-1"
                  >
                    <div className="aspect-16/10 relative overflow-hidden">
                      {item.cover_image_url ? (
                        <img
                          src={item.cover_image_url}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-linear-to-br ${gradient}`} />
                      )}
                      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                      <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                      <div className="absolute top-6 left-6">
                        <span className="text-xs rounded-full bg-background/90 backdrop-blur-sm px-4 py-2 font-semibold text-foreground border border-background/20">
                          {categoryLabel}
                        </span>
                      </div>
                      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <ArrowLeft className="h-5 w-5 text-white rotate-180" />
                        </div>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors mb-3">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {item.excerpt || "Innovative digital solution combining cutting-edge technology with exceptional user experience design."}
                      </p>
                      <div className="flex items-center gap-2 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>{related.viewProjectLabel}</span>
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-16">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-3 rounded-xl bg-linear-to-r from-accent to-accent/80 text-accent-foreground px-8 py-4 text-base font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all duration-300 group"
              >
                <span>{related.viewAllLabel}</span>
                <ArrowLeft className="h-5 w-5 rotate-180 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
